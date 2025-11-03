import { axiosInstance } from '@api/axios';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QuestionAudioRecorder from '@components/simulation/QuestionAudioRecorder';
import SessionVideoRecorder from '@components/simulation/SessionVideoRecorder';
import VoiceModel from '@components/simulation/VoiceModel';
import { PlayIcon, StopIcon, DiscIcon, CheckIcon } from '@radix-ui/react-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import * as S from './SimulationGoStyle';
import TextToSpeech from './TextToSpeech';

const MAX_SECONDS = 60;
const SHOW_CONSOLE_LOGS = true; // 콘솔 로그 on/off

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
  const [ttsSpeaking, setTtsSpeaking] = useState(false); // TTS true/false

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const moveNextGuardRef = useRef(false);

  // ===== 1) 시뮬레이션 상세 조회: 원본 저장 + 1..N 랜덤 목록 생성 =====
  useEffect(() => {
    if (!simulationId) return;
    let cancelled = false;

    (async () => {
      try {
        // ✅ baseURL이 /api 이므로 슬래시 없이 호출
        const resp = await axiosInstance.get(`/simulation/${simulationId}/start`);
        const data = resp.data?.data;
        if (!data) return;

        const _interviewerId = data.interviewer?.interviewerId ?? null;
        const _imageUrl = data.interviewer?.interviewerImageUrl ?? null;
        const post = data.post ?? null;
        const qaList = Array.isArray(post?.qaList) ? post.qaList : [];
        const rand = data.simulationRandom;
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
      // STT는 onSaved에서 처리(중복 방지)
    }
    goNextQuestionGuarded();
  };

  // === 업로드 성공 콜백: (url, qaId, transcript)
  const handleSavedAudio = (url, qaId, transcript) => {
    if (!qaId) return;
    setAudioById((prev) => ({ ...prev, [qaId]: url }));

    if (SHOW_CONSOLE_LOGS && typeof transcript === 'string') {
      // 화면에는 표시하지 않고 콘솔로만 출력
      // 현재 질문 텍스트도 함께 찍어두면 디버깅 편함
      const qText = orderedQa.find((q) => q?.qaId === qaId)?.qaQuestion || '';
      // 길이 긴 로그는 그룹으로 보기 좋게
      console.groupCollapsed(
        `[STT] qaId=${qaId} | "${qText.slice(0, 40)}${qText.length > 40 ? '…' : ''}"`,
      );
      console.log(transcript);
      console.groupEnd();
    }
  };

  const handleTick = (left) => setTimeLeft(left);
  const handleRecordingChange = (rec) => setIsQuestionRecording(rec);

  const handleAutoFinish = (qaId, url) => {
    if (url && qaId) {
      setAudioById((prev) => ({ ...prev, [qaId]: url }));
      // 필요 시 자동 저장에서도 transcript 로그를 받고 싶다면 QuestionAudioRecorder 쪽에서 전달 확장
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
  }; // ===== 렌더링 =====

  return (
    <PageContainer header footer activeMenu='면접 시뮬레이션'>
      <S.MainContentWrapper>
        {!!interviewerId && isSessionStarted && currentQuestion && (
          <TextToSpeech
            voiceModel={VoiceModel[(parseInt(interviewerId, 10) || interviewerId) - 1]}
            currentQuestion={currentQuestion}
            enabled={isSessionStarted}
            onSpeakingChange={setTtsSpeaking}
          />
        )}

        <S.SimulationLayout>
          {/* 1.1 좌측 사이드바 */}
          <S.Sidebar>
            <S.SidebarButton
              onClick={isSessionStarted ? stopSession : startSession}
              $variant={isSessionStarted ? 'danger' : 'default'}
            >
              {isSessionStarted ? <StopIcon /> : <PlayIcon />}
              {isSessionStarted ? '면접 종료' : '면접 시작'}
            </S.SidebarButton>

            <S.SidebarButton
              onClick={startAnswer}
              disabled={ttsSpeaking || !isSessionStarted || isQuestionRecording}
            >
              <DiscIcon />
              답변하기 (녹음)
            </S.SidebarButton>

            <S.SidebarButton
              onClick={finishAnswer}
              disabled={!isSessionStarted || !isQuestionRecording}
            >
              <CheckIcon />
              답변 완료 (다음)
            </S.SidebarButton>

            <S.SwitchToggleWrapper style={{ marginTop: '16px', padding: '8px' }}>
              <Typography size={2} weight='medium'>
                스크립트 ON/OFF
              </Typography>
              <S.StyledSwitch
                checked={scriptMode}
                onCheckedChange={setScriptMode}
                style={{ marginLeft: 'auto' }}
              >
                <S.StyledThumb />
              </S.StyledSwitch>
            </S.SwitchToggleWrapper>
          </S.Sidebar>

          {/* 1.2 메인 콘텐츠 영역 */}
          <S.MainContent>
            {/* 상단 타이머/카운터 */}
            <S.TopInfoBar>
              {isSessionStarted && <S.LiveIndicator>LIVE</S.LiveIndicator>}
              <S.TimerPill>{formatTime(timeLeft)}</S.TimerPill>
              <S.QuestionCounter>
                {Math.min(currentIdx + 1, totalQuestions)} / {totalQuestions || 0}
              </S.QuestionCounter>
            </S.TopInfoBar>

            {/* 면접관 영상 */}
            <S.InterviewerVideo>
              {imageUrl && <img src={imageUrl} alt='면접관 이미지' />}
            </S.InterviewerVideo>

            <S.UserPipVideoWrapper $isVisible={isSessionStarted}>
              <SessionVideoRecorder ref={videoRef} />
            </S.UserPipVideoWrapper>

            {/* 질문 텍스트 */}
            <S.QuestionHeader>
              <S.QuestionBadge>Q{totalQuestions === 0 ? 0 : currentIdx + 1}</S.QuestionBadge>
              <S.QuestionText>{currentQuestion || '준비가 완료되면 시작해 주세요!'}</S.QuestionText>
            </S.QuestionHeader>

            {/* 스크립트 패널 */}
            {scriptMode && (
              <S.ScriptPanel>
                <S.ScriptLabel>스크립트</S.ScriptLabel>
                <S.ScriptQuestion>{questions[currentIdx] || '질문이 없습니다.'}</S.ScriptQuestion>
                <S.ScriptAnswer $hasContent={!!answers[currentIdx]}>
                  {answers[currentIdx] || '이 질문에 대한 스크립트가 없습니다.'}
                </S.ScriptAnswer>
              </S.ScriptPanel>
            )}

            {/* 오디오 레코더 (숨김) */}
            <QuestionAudioRecorder
              ref={audioRef}
              maxSeconds={MAX_SECONDS}
              simulationId={simulationId}
              onSaved={handleSavedAudio}
              onTick={handleTick}
              onRecordingChange={handleRecordingChange}
              onAutoFinish={handleAutoFinish}
            />

            {/* 3. 녹음/비디오 결과 (디버깅/확인용) */}
            {/* <S.RecordingListSection>
              <Typography as='h4' size={4} weight='semiBold'>
                녹음 파일 (질문별)
              </Typography>
              <S.StyledOL>
                {orderedQa.map((q, i) => {
                  const qaId = q?.qaId;
                  const url = qaId ? audioById[qaId] : null;
                  return (
                    <S.StyledLI key={qaId ?? i}>
                      Q{i + 1}.{' '}
                      {url ? (
                        <S.DownloadLink
                          href={url}
                          download={`audio_${String(qaId).padStart(2, '0')}.webm`}
                        >
                          다운로드
                        </S.DownloadLink>
                      ) : (
                        <Typography size={2} muted>
                          아직 생성되지 않음
                        </Typography>
                      )}
                      <Typography size={2} muted>
                        {q?.qaQuestion || ''}
                      </Typography>
                    </S.StyledLI>
                  );
                })}
              </S.StyledOL>
            </S.RecordingListSection> */}

            <S.SessionVideoSection>
              <Typography as='h4' size={4} weight='semiBold'>
                세션 비디오 (종료 시)
              </Typography>
              {videoUrl ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <S.StyledVideo src={videoUrl} controls />
                  <S.DownloadLink href={videoUrl} download='session.webm'>
                    비디오 다운로드
                  </S.DownloadLink>
                </div>
              ) : (
                <Typography size={2} muted>
                  세션 비디오 없음
                </Typography>
              )}
            </S.SessionVideoSection>
          </S.MainContent>
        </S.SimulationLayout>
      </S.MainContentWrapper>
    </PageContainer>
  );
}

// ===== 스타일 & 유틸 =====
function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
