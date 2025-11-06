import { axiosInstance } from '@api/axios';
import ConfirmDialog from '@components/common/ConfirmDialog';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QuestionAudioRecorder from '@components/simulation/QuestionAudioRecorder';
import SessionVideoRecorder from '@components/simulation/SessionVideoRecorder';
import VoiceModel from '@components/simulation/VoiceModel';
import { PlayIcon, StopIcon, DiscIcon, CheckIcon } from '@radix-ui/react-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import * as S from './SimulationGoStyle';
import TextToSpeech from './TextToSpeech';

const MAX_SECONDS = 120;
const SHOW_CONSOLE_LOGS = true;

// 1..n 배열 만들고 셔플
function makeOneBasedShuffled(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SimulationGO() {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  // ===== PIP 드래그 =====
  const [pipPosition, setPipPosition] = useState(null); // pipPosition 상태 관리
  const [isDraggingPip, setIsDraggingPip] = useState(false); // 드래그 상태
  const dragOffsetRef = useRef({ x: 0, y: 0 }); // 마우스 클릭 위치와 요소 위치 차이
  const pipRef = useRef(null); // pip 요소의 참조

  // 드래그 시작 시 실행
  const handlePipMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingPip(true);

    // pip 요소의 현재 위치와 부모 요소의 위치 계산
    const rect = pipRef.current.getBoundingClientRect();
    const parentRect = pipRef.current.parentElement.getBoundingClientRect();

    // pipPosition 초기화 (첫 번째 드래그 시작 시 한 번만)
    const currentPos = pipPosition || {
      x: window.innerWidth - rect.width - 32, // 오른쪽 여백 16px
      y: window.innerHeight - rect.height - 32, // 아래 여백 16px
    };

    if (!pipPosition) setPipPosition(currentPos);

    // 드래그 시작 시 오프셋 계산
    dragOffsetRef.current = {
      x: e.clientX - currentPos.x - parentRect.left,
      y: e.clientY - currentPos.y - parentRect.top,
    };
  };

  // 마우스 움직일 때마다 실행
  const handlePipMouseMove = useCallback(
    (e) => {
      if (!isDraggingPip) return;
      e.preventDefault();
      const parentRect = pipRef.current.parentElement.getBoundingClientRect();

      // pip 요소의 새로운 위치 계산 (드래그 오프셋 반영)
      setPipPosition({
        x: e.clientX - parentRect.left - dragOffsetRef.current.x,
        y: e.clientY - parentRect.top - dragOffsetRef.current.y,
      });
    },
    [isDraggingPip], // isDraggingPip 상태에 따라 마우스 이동 이벤트 리스너가 변경됨
  );

  // 마우스 업 시 드래그 종료
  const handlePipMouseUp = useCallback(() => setIsDraggingPip(false), []);

  // 마우스 이동과 마우스 업 이벤트 리스너 추가 및 제거
  useEffect(() => {
    if (isDraggingPip) {
      window.addEventListener('mousemove', handlePipMouseMove);
      window.addEventListener('mouseup', handlePipMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePipMouseMove);
      window.removeEventListener('mouseup', handlePipMouseUp);
    };
  }, [isDraggingPip, handlePipMouseMove, handlePipMouseUp]);

  // pip 스타일 업데이트
  const pipStyle = useMemo(
    () =>
      pipPosition
        ? {
            position: 'fixed', // 브라우저 전체 기준
            top: `${pipPosition.y}px`, // pipPosition.y 위치로 설정
            left: `${pipPosition.x}px`, // pipPosition.x 위치로 설정
          }
        : {
            position: 'fixed',
            bottom: '0px', // 브라우저 오른쪽 아래 16px
            right: '0px',
          },
    [pipPosition],
  );

  // ===== 상태 =====
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setcurrentQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_SECONDS);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isQuestionRecording, setIsQuestionRecording] = useState(false);

  const [interviewerId, setInterviewerId] = useState(null);
  const [audioById, setAudioById] = useState({});
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const [questionList, setQaList] = useState([]);
  const [randomOrder, setRandomOrder] = useState([]);
  const [simPost, setPost] = useState(null);
  const [scriptMode, setScriptMode] = useState(false);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);

  // ★ STT 결과 모음 (qaId -> transcript)
  const [sttByQaId, setSttByQaId] = useState({}); // ★

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const moveNextGuardRef = useRef(false);

  // ===== 1) 상세 조회 =====
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

        if (!cancelled) {
          setInterviewerId(_interviewerId);
          setImageUrl(_imageUrl);
          setPost(post);
          setQaList(qaList);
          setAudioById({});
          setSttByQaId({}); // ★ 초기화

          setRandomOrder(
            data.simulationRandom === 'Y'
              ? makeOneBasedShuffled(qaList.length)
              : Array.from({ length: qaList.length }, (_, i) => i + 1),
          );

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

  // ===== 2) 파생 배열 =====
  const orderedQa = useMemo(() => {
    if (!questionList?.length || !randomOrder?.length) return [];
    return randomOrder.map((oneBased) => questionList[oneBased - 1]);
  }, [questionList, randomOrder]);

  const questions = useMemo(() => orderedQa.map((q) => q?.qaQuestion || ''), [orderedQa]);
  const answers = useMemo(() => orderedQa.map((q) => q?.qaAnswer || ''), [orderedQa]);
  const totalQuestions = questions.length;

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
    // 오디오 녹음 중이면 정지
    if (audioRef.current?.cancel) await audioRef.current.cancel();

    // 비디오 정지 → Blob 획득
    let blob = null;
    if (videoRef.current?.stopAsBlob) {
      blob = await videoRef.current.stopAsBlob();
    } else if (videoRef.current?.stop) {
      // fallback: stop()이 URL을 리턴하는 구버전
      const maybeUrl = await videoRef.current.stop();
      if (maybeUrl) {
        try {
          blob = await fetch(maybeUrl).then((r) => r.blob());
        } catch (e) {
          console.error('blob 변환 실패:', e);
        }
      }
    }
    if (blob) setVideoBlob(blob);

    // 화면 상태 리셋
    setIsSessionStarted(false);
    setcurrentQuestion('');
    moveNextGuardRef.current = false;
    setCurrentIdx(0);

    axiosInstance.patch(`/simulation/${simulationId}/${currentIdx + 1}`);

    // 라우터 state로 전달
    navigate(`/simulation/${simulationId}/end`, {
      state: {
        recordedBlob: blob || null,
        postData: simPost || null,
        sttByQaId,
      },
    });
  };

  // ===== 5) 질문 녹음 =====
  const startAnswer = async () => {
    if (!isSessionStarted || isQuestionRecording) return;
    const qaId = orderedQa?.[currentIdx]?.qaId;
    if (!qaId) return;
    if (audioRef.current?.start) await audioRef.current.start({ qaId, qIdx: currentIdx });
  };

  const finishAnswer = async () => {
    if (!audioRef.current?.finish) return;
    const { url, qaId } = await audioRef.current.finish();
    if (url && qaId) setAudioById((prev) => ({ ...prev, [qaId]: url }));
    goNextQuestionGuarded();
  };

  // 업로드 성공: (url, qaId, transcript)
  const handleSavedAudio = (url, qaId, transcript) => {
    if (!qaId) return;
    setAudioById((prev) => ({ ...prev, [qaId]: url }));

    // ★ STT 누적 저장
    if (typeof transcript === 'string' && transcript.trim()) {
      setSttByQaId((prev) => ({ ...prev, [qaId]: transcript }));
    }

    if (SHOW_CONSOLE_LOGS && typeof transcript === 'string') {
      const qText = orderedQa.find((q) => q?.qaId === qaId)?.qaQuestion || '';
      console.groupCollapsed(
        `[STT] qaId=${qaId} | "${qText.slice(0, 40)}${qText.length > 40 ? '…' : ''}"`,
      );
      console.groupEnd();
    }
  };

  const handleTick = (left) => setTimeLeft(left);
  const handleRecordingChange = (rec) => setIsQuestionRecording(rec);

  const handleAutoFinish = (qaId, url) => {
    if (url && qaId) setAudioById((prev) => ({ ...prev, [qaId]: url }));
    goNextQuestionGuarded();
  };

  // 타이머 종료 백업
  useEffect(() => {
    if (!isSessionStarted) return;
    if (timeLeft > 0) return;
    if (!isQuestionRecording) goNextQuestionGuarded();
  }, [timeLeft, isSessionStarted, isQuestionRecording]);

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

  // ===== UI =====
  return (
    <>
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
          {/* 사이드바 */}
          <S.Sidebar>
            <S.TopInfoBar>
              <S.TimerPill>{formatTime(timeLeft)}</S.TimerPill>
              <S.QuestionCounter>
                {Math.min(currentIdx + 1, totalQuestions)} / {totalQuestions || 0}
              </S.QuestionCounter>
            </S.TopInfoBar>
            <S.SidebarButton
              onClick={
                isSessionStarted
                  ? () => {
                      // 아직 남은 질문이 있으면 경고 모달
                      if (currentIdx < totalQuestions - 1) setEndConfirmOpen(true);
                      else stopSession();
                    }
                  : startSession
              }
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

          {/* 메인 */}
          <S.MainContent>
            <S.InterviewerVideo>
              {isSessionStarted && <S.LiveIndicator>LIVE</S.LiveIndicator>}

              {imageUrl && <img src={imageUrl} alt='면접관 이미지' />}
            </S.InterviewerVideo>

            <S.UserPipVideoWrapper
              ref={pipRef}
              style={pipStyle}
              $isVisible={isSessionStarted}
              data-dragging={isDraggingPip}
              onMouseDown={handlePipMouseDown}
            >
              <SessionVideoRecorder ref={videoRef} />
            </S.UserPipVideoWrapper>

            <S.QuestionHeader>
              {isSessionStarted && (
                <S.QuestionBadge>Q{totalQuestions === 0 ? 0 : currentIdx + 1}</S.QuestionBadge>
              )}
              <S.QuestionText>{currentQuestion || '준비가 완료되면 시작해 주세요!'}</S.QuestionText>
            </S.QuestionHeader>

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
              onTick={setTimeLeft}
              onRecordingChange={setIsQuestionRecording}
              onAutoFinish={handleAutoFinish}
            />
          </S.MainContent>
        </S.SimulationLayout>
      </S.MainContentWrapper>
      <ConfirmDialog
        open={endConfirmOpen}
        onOpenChange={setEndConfirmOpen}
        title='면접 종료'
        messages={[
          '면접 질문이 남아있는 상태에서 종료하면, 답변을 완료하지 않은 질문의 면접 결과는 저장되지 않습니다.',
          '종료하시겠어요?',
        ]}
        onConfirm={async () => {
          await stopSession(); // 확인 → 진짜 종료
          // stopSession 안에서 라우팅하므로 setEndConfirmOpen(false)는 생략 가능
        }}
      />
    </>
  );
}

function formatTime(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
