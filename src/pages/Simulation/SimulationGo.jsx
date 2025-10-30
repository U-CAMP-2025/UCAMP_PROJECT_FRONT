import axiosInstance from '@api/axios';
import QuestionAudioRecorder from '@components/simulation/QuestionAudioRecorder';
import SessionVideoRecorder from '@components/simulation/SessionVideoRecorder';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextToSpeech from './TextToSpeech';

const QUESTIONS = [
  '자기소개를 해주세요.',
  '우리 회사에 지원한 동기는 무엇인가요?',
  '최근에 해결한 어려운 문제 하나를 설명해 주세요.',
  '협업에서 가장 중요하게 생각하는 점은?',
  '입사 후 3년 목표는 무엇인가요?',
];

const VOICE_A = 'WzMnDIgiICcj1oXbUBO0'; // 남
const VOICE_B = 'ksaI0TCD9BstzEzlxj4q'; // 여
const interviewer_A = new Set([1, 3, 5, 7, 9]);
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

  const videoRef = useRef(null); // SessionVideoRecorder 제어
  const audioRef = useRef(null); // QuestionAudioRecorder 제어

  // 시뮬레이션 상세 → interviewerId 추출
  useEffect(() => {
    if (!simulationId) return;
    axiosInstance
      .get(`/simulation/${simulationId}`)
      .then((resp) => {
        const id = resp.data?.data?.interviewer?.interviewerId;
        setInterviewerId(id);
      })
      .catch((err) => console.error('에러:', err));
  }, [simulationId]);

  // 면접관 → 보이스 선택(두 개만)
  const resolvedVoice = (() => {
    if (interviewerId == null) return undefined;
    return interviewer_A.has(Number(interviewerId)) ? VOICE_A : VOICE_B;
  })();

  // 세션 시작/종료
  const startSession = async () => {
    if (isSessionStarted) return;
    await videoRef.current?.start(); // 비디오 녹화 시작
    setIsSessionStarted(true);
    setTimeLeft(MAX_SECONDS);
    setcurrentQuestion(QUESTIONS[0]); // 첫 질문 세팅 (TTS용)
  };

  const stopSession = async () => {
    await audioRef.current?.cancel(); // 진행 중 오디오 취소
    const url = await videoRef.current?.stop(); // 비디오 저장
    if (url) setVideoUrl(url);
    setIsSessionStarted(false);
  };

  // 질문 오디오
  const startAnswer = async () => {
    if (!isSessionStarted || isQuestionRecording) return;
    await audioRef.current?.start(currentIdx); // 현재 질문 인덱스로 시작
  };

  const finishAnswer = async () => {
    await audioRef.current?.finish(); // 저장 후 종료
    goNextQuestion();
  };

  const goNextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
      setTimeLeft(MAX_SECONDS);
      setcurrentQuestion(QUESTIONS[currentIdx + 1]);
    } else {
      stopSession();
    }
  };

  // 콜백들 (오디오 컴포넌트에서 올려줌)
  const handleSavedAudio = (url, qIdx) => {
    setAudioUrls((prev) => {
      const next = [...prev];
      next[qIdx] = url;
      return next;
    });
  };

  const handleTick = (left) => setTimeLeft(left);
  const handleRecordingChange = (rec) => setIsQuestionRecording(rec);

  // UI
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ElevenLabs TTS */}
      <TextToSpeech voice={resolvedVoice} currentQuestion={currentQuestion} />

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

      {/* 녹음 파일(질문별) */}
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

// 스타일
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
