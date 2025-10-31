import axiosInstance from '@api/axios';
import QuestionAudioRecorder from '@components/simulation/QuestionAudioRecorder';
import SessionVideoRecorder from '@components/simulation/SessionVideoRecorder';
import VoiceModel from '@components/simulation/VoiceModel';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextToSpeech from './TextToSpeech';

const MAX_SECONDS = 60;

export default function SimulationGO() {
  const { simulationId } = useParams();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setcurrentQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_SECONDS);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isQuestionRecording, setIsQuestionRecording] = useState(false);
  const [interviewerId, setInterviewerId] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [questionList, setQaList] = useState([]); // 서버에서 온 {qaId, qaOrder, qaQuestion, qaAnswer}
  const [simPost, setPost] = useState(null);

  const videoRef = useRef(null); // SessionVideoRecorder 제어
  const audioRef = useRef(null); // QuestionAudioRecorder 제어

  // ===== 1) 시뮬레이션 상세 조회 (interviewer, post, qaList) =====
  useEffect(() => {
    if (!simulationId) return;

    let cancelled = false;

    (async () => {
      try {
        const resp = await axiosInstance.get(`/simulation/${simulationId}`);
        const data = resp.data && resp.data.data;

        if (!data) return;

        const _interviewerId = (data.interviewer && data.interviewer.interviewerId) ?? null;
        const _imageUrl = (data.interviewer && data.interviewer.interviewerImageUrl) ?? null;
        const post = data.post ?? null;
        const qaList = (post && post.qaList) ?? [];

        if (!cancelled) {
          setInterviewerId(_interviewerId);
          setImageUrl(_imageUrl);
          setPost(post);
          setQaList(Array.isArray(qaList) ? qaList : []);
        }
      } catch (err) {
        console.error('에러:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [simulationId]);

  // ===== 2) qaList → 질문 문자열 배열 (정렬 보강) =====
  const questions = useMemo(() => {
    if (!questionList || questionList.length === 0) return [];
    const sorted = [...questionList].sort(
      (a, b) => (a && a.qaOrder ? a.qaOrder : 0) - (b && b.qaOrder ? b.qaOrder : 0),
    );
    return sorted.map((q) => (q && q.qaQuestion) || '');
  }, [questionList]);

  const totalQuestions = questions.length;

  // ===== 3) qaList가 들어오면 첫 질문 세팅 =====
  useEffect(() => {
    if (totalQuestions > 0) {
      setCurrentIdx(0);
      setcurrentQuestion(questions[0]);
      setTimeLeft(MAX_SECONDS);
    } else {
      setCurrentIdx(0);
      setcurrentQuestion('');
    }
  }, [totalQuestions, questions]);

  // ===== 4) 세션 시작/종료 =====
  const startSession = async () => {
    if (isSessionStarted) return;
    if (videoRef.current && videoRef.current.start) {
      await videoRef.current.start(); // 비디오 녹화 시작
    }
    setIsSessionStarted(true);
    setTimeLeft(MAX_SECONDS);
    setcurrentQuestion(questions[0]); // 첫 질문 세팅 (TTS용)
  };

  const stopSession = async () => {
    if (audioRef.current && audioRef.current.cancel) {
      await audioRef.current.cancel(); // 진행 중 오디오 취소
    }
    let url = null;
    if (videoRef.current && videoRef.current.stop) {
      url = await videoRef.current.stop(); // 비디오 저장
    }
    if (url) setVideoUrl(url);
    setIsSessionStarted(false);
  };

  // ===== 5) 질문 오디오 =====
  const startAnswer = async () => {
    if (!isSessionStarted || isQuestionRecording) return;
    if (audioRef.current && audioRef.current.start) {
      await audioRef.current.start(currentIdx); // 현재 질문 인덱스로 시작
    }
  };

  const finishAnswer = async () => {
    if (audioRef.current && audioRef.current.finish) {
      await audioRef.current.finish(); // 저장 후 종료
    }
    goNextQuestion();
  };

  const goNextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((idx) => idx + 1);
      setTimeLeft(MAX_SECONDS);
      setcurrentQuestion(questions[currentIdx + 1]);
    } else {
      stopSession();
    }
  };

  // ===== 6) 콜백들 (오디오 컴포넌트에서 올려줌) =====
  const handleSavedAudio = (url, qIdx) => {
    setAudioUrls((prev) => {
      const next = [...prev];
      next[qIdx] = url;
      return next;
    });

    // (선택) qaId 활용하고 싶을 때:
    // const qaId = questionList?.[qIdx]?.qaId;
    // await axiosInstance.post('/answers', { simulationId, qaId, audioUrl: url });
  };

  const handleTick = (left) => setTimeLeft(left);
  const handleRecordingChange = (rec) => setIsQuestionRecording(rec);

  // ===== 7) UI =====
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ElevenLabs TTS */}
      {!!interviewerId && (
        <TextToSpeech
          voiceModel={VoiceModel[(parseInt(interviewerId, 10) || interviewerId) - 1]}
          currentQuestion={currentQuestion}
          enabled={isSessionStarted}
        />
      )}

      {/* 면접관 이미지 URL (디버그/프리뷰용) */}
      <p>{imageUrl}</p>

      {/* 비디오 레코더 (세션 전체) */}
      <SessionVideoRecorder ref={videoRef} />

      {/* 오디오 레코더 (질문별) — 화면엔 안 보임 */}
      <QuestionAudioRecorder
        ref={audioRef}
        maxSeconds={MAX_SECONDS}
        onSaved={handleSavedAudio}
        onTick={handleTick}
        onRecordingChange={handleRecordingChange}
      />

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
          {Math.min(currentIdx + 1, totalQuestions)}/{totalQuestions || 0}
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
          Q{totalQuestions === 0 ? 0 : currentIdx + 1}
        </span>
        <span>{currentQuestion || '질문이 없습니다.'}</span>
      </div>

      {/* 녹음 파일(질문별) */}
      <div>
        <h4 style={{ margin: '12px 0 8px' }}>녹음 파일(질문별)</h4>
        <ol style={{ paddingLeft: 18, lineHeight: 1.9 }}>
          {questions.map((q, i) => (
            <li key={i}>
              Q{i + 1}.{' '}
              {audioUrls[i] ? (
                <a href={audioUrls[i]} download={`q${i + 1}.webm`}>
                  다운로드
                </a>
              ) : (
                <span style={{ color: '#999' }}>아직 생성되지 않음</span>
              )}
              <div style={{ fontSize: 12, color: '#666' }}>{q}</div>
            </li>
          ))}
          {questions.length === 0 && <li style={{ color: '#999' }}>질문이 없습니다.</li>}
        </ol>
      </div>

      {/* 세션 비디오 */}
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

// ===== 스타일 & 유틸 =====
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
