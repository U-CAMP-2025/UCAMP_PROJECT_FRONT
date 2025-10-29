import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

import TextToSpeech from './TextToSpeech';

const QUESTIONS = [
  '자기소개를 해주세요.',
  '우리 회사에 지원한 동기는 무엇인가요?',
  '최근에 해결한 어려운 문제 하나를 설명해 주세요.',
  '협업에서 가장 중요하게 생각하는 점은?',
  '입사 후 3년 목표는 무엇인가요?',
];

const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';

const MAX_SECONDS = 60; // 질문당 제한 시간(초)

export default function SimulationGO() {
  // param
  const { simulationId } = useParams();
  const [simInfo, setSimInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // 상태
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setcurrentQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_SECONDS);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isQuestionRecording, setIsQuestionRecording] = useState(false);

  // 🔊 TTS refs (✅ 반드시 컴포넌트 내부에 있어야 함)
  const synthRef = useRef(null);
  const voiceRef = useRef(null); // 선택된 음성 캐시
  const utterRef = useRef(null); // 현재 발화 객체

  // 미디어
  const videoElRef = useRef(null);
  const videoStreamRef = useRef(null); // 비디오(+마이크) 스트림 (세션 전체 녹화)
  const audioStreamRef = useRef(null); // 오디오 전용 스트림 (질문별 녹음)

  // 레코더
  const videoRecRef = useRef(null); // 세션 전체 비디오 레코더
  const audioRecRef = useRef(null); // 질문별 오디오 레코더

  // 결과
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]); // index별 오디오 URL 저장

  // 타이머
  const timerRef = useRef(null); // 1초 카운트다운 표시용
  const timeoutRef = useRef(null); // 60초 만료 처리용 (단발)
  const finishingRef = useRef(false); // 중복 완료 방지 가드

  useEffect(() => {
    async function fetchSimulation() {
      try {
        // axiosInstance 사용 시:
        // const { data } = await axiosInstance.get(`/simulation/${simulationId}`);
        // setSimInfo(data.data);

        // 만약 아직 API가 없다면 아래 두 줄만 두고 넘어가도 됩니다.
        setSimInfo({ id: simulationId });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (simulationId) fetchSimulation();
  }, [simulationId]);

  // 🔊 TTS 초기화
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    synthRef.current = window.speechSynthesis;

    const pickVoice = () => {
      const list = synthRef.current.getVoices();
      // 1) Google 한국 → 2) ko-* → 3) 첫 번째
      const googleKo = list.find((v) => (v.name || '').includes('Google 한국'));
      const ko = list.find((v) => (v.lang || '').toLowerCase().startsWith('ko'));
      voiceRef.current = googleKo || ko || list[0] || null;
    };

    pickVoice(); // 즉시 한 번
    window.speechSynthesis.onvoiceschanged = pickVoice; // 비동기 로딩 대비
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 🔊 읽기 함수
  function speakQuestion(text) {
    const synth = synthRef.current;
    if (!synth || !text) return;
    // 이전 읽기 중이면 취소
    if (synth.speaking || synth.paused) synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang = voiceRef.current?.lang || 'ko-KR';
    u.rate = 1;
    u.pitch = 1;

    // (선택) 읽기 끝나면 자동 녹음 시작하고 싶다면:
    // u.onend = () => { if (!isQuestionRecording) startQuestionAudio(); };

    utterRef.current = u;
    synth.speak(u);
  }

  // ────────────────────────────────────────────
  // 권한 및 스트림 준비
  const setupMedia = async () => {
    // 비디오 정의
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });

    // 오디오 정의
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    videoStreamRef.current = videoStream;
    audioStreamRef.current = audioStream;

    if (videoElRef.current) {
      videoElRef.current.srcObject = videoStream;
      await videoElRef.current.play().catch(() => {});
    }
  };

  // ────────────────────────────────────────────
  // 세션 시작 / 종료
  const startSession = async () => {
    // false이니 return 아니면 진행
    if (isSessionStarted) return;
    await setupMedia();

    const videoRec = new RecordRTCPromisesHandler(videoStreamRef.current, {
      type: 'video',
      mimeType: 'video/mp4',
    });
    videoRecRef.current = videoRec;
    await videoRec.startRecording();

    setIsSessionStarted(true);
    setTimeLeft(MAX_SECONDS);

    // 첫 질문 자동 읽기
    // speakQuestion(QUESTIONS[0]);
    setcurrentQuestion(QUESTIONS[0]);
  };

  const stopSession = async () => {
    // 질문 오디오 정리
    await stopQuestionAudio(true);

    // 비디오 저장
    if (videoRecRef.current) {
      await videoRecRef.current.stopRecording();
      const blob = await videoRecRef.current.getBlob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      videoRecRef.current.reset();
      videoRecRef.current.destroy();
      videoRecRef.current = null;
    }

    cleanupStreams();

    // TTS 중지
    if (synthRef.current) synthRef.current.cancel();

    setIsSessionStarted(false);
  };

  const cleanupStreams = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((t) => t.stop());
      videoStreamRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
  };

  // ────────────────────────────────────────────
  // 질문 오디오 시작/정지
  const startQuestionAudio = async () => {
    if (!audioStreamRef.current || isQuestionRecording) return;

    // 타이머 초기화
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const audioRec = new RecordRTCPromisesHandler(audioStreamRef.current, {
      type: 'audio',
      recorderType: RecordRTC.StereoAudioRecorder,
      numberOfAudioChannels: 1,
      disableLogs: true,
    });
    audioRecRef.current = audioRec;
    await audioRec.startRecording();

    finishingRef.current = false; // 새로운 질문 시작 시 가드 리셋
    setIsQuestionRecording(true);
    setTimeLeft(MAX_SECONDS);

    // ⏱ 표시용 1초 카운트다운
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    //  단발 타임아웃: 정확히 한 번만 finishAnswer 호출
    timeoutRef.current = setTimeout(() => {
      finishAnswer();
    }, MAX_SECONDS * 1000);
  };

  const stopQuestionAudio = async (silent = false) => {
    if (!audioRecRef.current) return;
    try {
      await audioRecRef.current.stopRecording();
      const blob = await audioRecRef.current.getBlob();
      const url = URL.createObjectURL(blob);

      setAudioUrls((prev) => {
        const next = [...prev];
        next[currentIdx] = url; // 현재 질문 인덱스에 음성 URL 저장
        return next;
      });

      audioRecRef.current.reset();
      audioRecRef.current.destroy();
      audioRecRef.current = null;
    } catch (e) {
      if (!silent) console.error(e);
    } finally {
      setIsQuestionRecording(false);
    }
  };

  // ────────────────────────────────────────────
  // 네비게이션 & 자동 읽기 트리거
  const goNextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
      setTimeLeft(MAX_SECONDS);
    } else {
      stopSession();
    }
  };

  //  다음 질문으로 바뀌면 자동 읽기
  useEffect(() => {
    if (!isSessionStarted) return;
    // 녹음 중에는 읽지 않으려면 아래 가드 추가
    // if (isQuestionRecording) return;

    const q = QUESTIONS[currentIdx] || '';
    // speakQuestion(q);
    setcurrentQuestion(QUESTIONS[currentIdx]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, isSessionStarted]);

  const startAnswer = async () => {
    if (!isSessionStarted || isQuestionRecording) return;
    await startQuestionAudio();
  };

  const finishAnswer = async () => {
    if (finishingRef.current) return; // 중복 방지
    finishingRef.current = true;

    // 타이머 정리 (표시/타임아웃 모두)
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    await stopQuestionAudio();
    goNextQuestion();

    // 다음 질문에서 다시 사용할 수 있도록 가드 해제
    finishingRef.current = false;
  };

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupStreams();
      if (synthRef.current) synthRef.current.cancel(); //  TTS 중지
      audioUrls.forEach((u) => u && URL.revokeObjectURL(u));
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ────────────────────────────────────────────
  // UI
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TextToSpeech voice={voiceId} currentQuestion={currentQuestion} />
      {/* 컨트롤 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <button style={btnStyle} onClick={isSessionStarted ? stopSession : startSession}>
          {isSessionStarted ? '세션 종료' : '세션 시작'}
        </button>
        <button
          style={btnStyle}
          onClick={startAnswer}
          disabled={!isSessionStarted || isQuestionRecording}
        >
          답변하기 (녹음 시작)
        </button>
        <button
          style={btnStyle}
          onClick={finishAnswer}
          disabled={!isSessionStarted || !isQuestionRecording}
        >
          답변 완료 (저장 후 다음)
        </button>
        <div style={pillStyle}>
          <strong>{formatTime(timeLeft)}</strong>
        </div>
        <span style={{ marginLeft: 8 }}>
          {currentIdx + 1}/{QUESTIONS.length}
        </span>
        {isQuestionRecording && <span style={{ fontSize: 12 }}>녹음 중...</span>}
      </div>

      {/* 현재 질문 표시 */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 12,
            color: '#64748B',
            marginRight: 8,
            border: '1px solid #D4CAFE',
            borderRadius: 8,
            padding: '2px 6px',
          }}
        >
          Q{currentIdx + 1}
        </span>
        <span>{QUESTIONS[currentIdx]}</span>
      </div>

      {/* 영상 보이기 */}
      <div
        style={{
          border: '1px solid #cfcfcf',
          borderRadius: 14,
          padding: 8,
          width: 520,
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <video
          ref={videoElRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }}
        />
      </div>

      {/* 녹음 진행/저장 (질문별 오디오 다운로드) */}
      <div>
        <h4 style={{ margin: '12px 0 8px' }}>녹음 파일(질문별)</h4>
        <ol style={{ paddingLeft: 18, lineHeight: 1.9 }}>
          {QUESTIONS.map((_, i) => (
            <li key={i}>
              Q{i + 1}.{' '}
              {audioUrls[i] ? (
                <a href={audioUrls[i]} download={`q${i + 1}.webm`}>
                  다운로드
                </a>
              ) : (
                <span style={{ color: '#999' }}>아직 생성되지 않음</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* 영상 저장 항목 (세션 비디오) */}
      <div style={{ marginTop: 16 }}>
        <h4 style={{ margin: '12px 0 8px' }}>세션 비디오</h4>
        {videoUrl ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <video src={videoUrl} controls style={{ width: 320, borderRadius: 10 }} />
            <a href={videoUrl} download='session.webm'>
              비디오 다운로드
            </a>
          </div>
        ) : (
          <span style={{ color: '#999' }}>세션 비디오 없음</span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 스타일 유틸
const btnStyle = {
  borderRadius: 10,
  cursor: 'pointer',
};

const pillStyle = {
  background: '#000',
  color: '#fff',
  padding: '6px 14px',
  fontWeight: 700,
  minWidth: 120,
  textAlign: 'center',
};

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
