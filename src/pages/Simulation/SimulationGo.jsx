import { axiosInstance } from '@api/axios';
import QuestionAudioRecorder from '@components/simulation/QuestionAudioRecorder';
import SessionVideoRecorder from '@components/simulation/SessionVideoRecorder';
import VoiceModel from '@components/simulation/VoiceModel';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextToSpeech from './TextToSpeech';

const MAX_SECONDS = 60;

// 1..n 배열 만들고 셔플 (표시용은 1-based를 유지)
function makeOneBasedShuffled(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1); // [1..n]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SimulationGO() {
  const { simulationId } = useParams();

  const [currentIdx, setCurrentIdx] = useState(0); // 진행 중인 "랜덤 순서"의 인덱스(0-based)
  const [currentQuestion, setcurrentQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_SECONDS);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isQuestionRecording, setIsQuestionRecording] = useState(false);

  const [interviewerId, setInterviewerId] = useState(null);
  const [audioById, setAudioById] = useState({}); // qaId -> url
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [questionList, setQaList] = useState([]); // ✅ 서버 원본 (순서 절대 변경 X)
  const [randomOrder, setRandomOrder] = useState([]); // ✅ [1..N] 랜덤 숫자 배열 (표시/진행 전용)
  const [qaState, setQaState] = useState(null);
  const [simPost, setPost] = useState(null);
  const [scriptMode, setScriptMode] = useState(false);
  const [ttsSpeaking, setTtsSpeaking] = useState(false); // TTS true false

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const moveNextGuardRef = useRef(false);

  // ===== 1) 시뮬레이션 상세 조회: 원본 저장 + 1..N 랜덤 목록 생성 =====
  useEffect(() => {
    if (!simulationId) return;
    let cancelled = false;

    (async () => {
      try {
        const resp = await axiosInstance.get(`/simulation/${simulationId}/start`);
        const data = resp.data?.data;
        if (!data) return;

        const _interviewerId = data.interviewer?.interviewerId ?? null;
        const _imageUrl = data.interviewer?.interviewerImageUrl ?? null;
        const post = data.post ?? null;
        const qaList = Array.isArray(post?.qaList) ? post.qaList : [];
        const rand = data.simulationRandom;
        console.log(rand);
        if (!cancelled) {
          setInterviewerId(_interviewerId);
          setImageUrl(_imageUrl);
          setPost(post);
          setQaList(qaList);
          setAudioById({});

          // ✅ simulationRandom 값에 따라 randomOrder 다르게 생성
          if (data.simulationRandom === 'Y') {
            setRandomOrder(makeOneBasedShuffled(qaList.length)); // 랜덤
          } else {
            setRandomOrder(Array.from({ length: qaList.length }, (_, i) => i + 1)); // 순차
          }
          console.log(data.simulationRandom);

          setCurrentIdx(0);
          setcurrentQuestion('');
          setTimeLeft(MAX_SECONDS);
          moveNextGuardRef.current = false;
        }
      } catch (err) {
        console.error('에러:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [simulationId]);

  // ===== 2) 표시/진행용 파생 배열: orderedQa (원본 + 1-based 인덱스) =====
  const orderedQa = useMemo(() => {
    if (!questionList?.length || !randomOrder?.length) return [];
    return randomOrder.map((oneBased) => questionList[oneBased - 1]); // qaList[1], qaList[4], ...
  }, [questionList, randomOrder]);

  const questions = useMemo(() => orderedQa.map((q) => q?.qaQuestion || ''), [orderedQa]);
  const answers = useMemo(() => orderedQa.map((q) => q?.qaAnswer || ''), [orderedQa]);
  const totalQuestions = questions.length;

  // ===== 3) 초기화(orderedQa가 준비되면) =====
  useEffect(() => {
    if (totalQuestions > 0) {
      setCurrentIdx(0);
      setTimeLeft(MAX_SECONDS);
      setcurrentQuestion('');
    } else {
      setCurrentIdx(0);
      setcurrentQuestion('');
    }
    moveNextGuardRef.current = false;
  }, [totalQuestions]);

  // ===== 4) 세션 시작/종료 =====
  const startSession = async () => {
    if (isSessionStarted) return;
    if (videoRef.current?.start) await videoRef.current.start();
    setIsSessionStarted(true);
    setTimeLeft(MAX_SECONDS);
    setcurrentQuestion(orderedQa?.[0]?.qaQuestion || '');
    moveNextGuardRef.current = false;
  };

  const stopSession = async () => {
    if (audioRef.current?.cancel) await audioRef.current.cancel();
    let url = null;
    if (videoRef.current?.stop) url = await videoRef.current.stop();
    if (url) setVideoUrl(url);
    setIsSessionStarted(false);
    setcurrentQuestion('');
    moveNextGuardRef.current = false;
    setCurrentIdx(0);
  };

  // ===== 5) 질문 녹음 제어 (qaId 기반) =====
  const startAnswer = async () => {
    if (!isSessionStarted || isQuestionRecording) return;
    const qaId = orderedQa?.[currentIdx]?.qaId; // ✅ 현재 표시 순서의 qaId
    if (!qaId) return;
    if (audioRef.current?.start) await audioRef.current.start({ qaId, qIdx: currentIdx });
  };

  const finishAnswer = async () => {
    if (!audioRef.current?.finish) return;
    const { url, qaId } = await audioRef.current.finish(); // ✅ qaId 반환 받음
    if (url && qaId) {
      setAudioById((prev) => ({ ...prev, [qaId]: url }));
    }
    goNextQuestionGuarded();
  };

  const handleSavedAudio = (url, qaId) => {
    if (!qaId) return;
    setAudioById((prev) => ({ ...prev, [qaId]: url }));
  };

  const handleTick = (left) => setTimeLeft(left);
  const handleRecordingChange = (rec) => setIsQuestionRecording(rec);

  const handleAutoFinish = (qaId, url) => {
    if (url && qaId) {
      setAudioById((prev) => ({ ...prev, [qaId]: url }));
    }
    goNextQuestionGuarded();
  };

  // ===== 백업 감시 =====
  useEffect(() => {
    if (!isSessionStarted) return;
    if (timeLeft > 0) return;
    if (!isQuestionRecording) goNextQuestionGuarded();
  }, [timeLeft, isSessionStarted, isQuestionRecording]);

  // ===== 다음 질문 이동 =====
  const goNextQuestionGuarded = () => {
    if (moveNextGuardRef.current) return;
    moveNextGuardRef.current = true;
    goNextQuestion();
  };

  const goNextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTimeLeft(MAX_SECONDS);
      setcurrentQuestion(orderedQa?.[nextIdx]?.qaQuestion || '');
      moveNextGuardRef.current = false;
    } else {
      stopSession();
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {!!interviewerId && isSessionStarted && currentQuestion && (
        <TextToSpeech
          voiceModel={VoiceModel[(parseInt(interviewerId, 10) || interviewerId) - 1]}
          currentQuestion={currentQuestion}
          enabled={isSessionStarted}
          onSpeakingChange={setTtsSpeaking}
        />
      )}

      {/* 상단 컨트롤 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <button style={btnStyle} onClick={isSessionStarted ? stopSession : startSession}>
          {isSessionStarted ? '세션 종료' : '세션 시작'}
        </button>
        <button
          style={btnStyle}
          onClick={startAnswer}
          disabled={ttsSpeaking || !isSessionStarted || isQuestionRecording}
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
          {Math.min(currentIdx + 1, totalQuestions)}/{totalQuestions || 0}
        </span>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <input
            type='checkbox'
            checked={scriptMode}
            onChange={(e) => setScriptMode(e.target.checked)}
          />
          <span style={{ fontSize: 14 }}>스크립트 모드</span>
        </label>
        {isQuestionRecording && <span style={{ fontSize: 12 }}>녹음 중...</span>}
      </div>

      {/* 본문 */}
      <div
        style={{ display: 'grid', gridTemplateColumns: scriptMode ? '1fr 1fr' : '1fr', gap: 16 }}
      >
        <div>
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
              Q{totalQuestions === 0 ? 0 : currentIdx + 1}
            </span>
            <span>{currentQuestion || '준비가 완료되면 시작해 주세요!'}</span>
          </div>

          <img src={imageUrl} alt='interviewer' />

          <SessionVideoRecorder ref={videoRef} />

          <QuestionAudioRecorder
            ref={audioRef}
            maxSeconds={MAX_SECONDS}
            simulationId={simulationId}
            onSaved={handleSavedAudio} // (url, qaId)
            onTick={handleTick}
            onRecordingChange={handleRecordingChange}
            onAutoFinish={handleAutoFinish} // (qaId, url)
          />

          {/* 녹음 리스트: 랜덤 순서(orderedQa)에 맞게 표시. 다운로드 파일명은 qaId 기반 */}
          <div style={{ marginTop: 12 }}>
            <h4>녹음 파일(질문별)</h4>
            <ol style={{ paddingLeft: 18, lineHeight: 1.9 }}>
              {orderedQa.map((q, i) => {
                const qaId = q?.qaId;
                const url = qaId ? audioById[qaId] : null;
                return (
                  <li key={qaId ?? i}>
                    Q{i + 1}.{' '}
                    {url ? (
                      <a href={url} download={`audio${String(qaId).padStart(2, '0')}.webm`}>
                        다운로드
                      </a>
                    ) : (
                      <span style={{ color: '#999' }}>아직 생성되지 않음</span>
                    )}
                    <div style={{ fontSize: 12, color: '#666' }}>{q?.qaQuestion || ''}</div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 세션 비디오 */}
          <div style={{ marginTop: 16 }}>
            <h4>세션 비디오</h4>
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

        {/* 우측 스크립트: 랜덤 순서(orderedQa) 그대로 */}
        {scriptMode && (
          <div
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: 16,
              background: '#FBFBFF',
            }}
          >
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>스크립트</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {questions[currentIdx] || '질문이 없습니다.'}
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: answers[currentIdx] ? '#111827' : '#9CA3AF',
              }}
            >
              {answers[currentIdx] || '이 질문에 대한 스크립트가 없습니다.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== 스타일 & 유틸 =====
const btnStyle = { borderRadius: 10, cursor: 'pointer' };
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
