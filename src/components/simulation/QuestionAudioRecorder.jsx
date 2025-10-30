import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

const QuestionAudioRecorder = forwardRef(function QuestionAudioRecorder(
  {
    maxSeconds = 60,
    onSaved, // (url, questionIdx) => void
    onTick, // (timeLeft) => void
    onRecordingChange, // (isRecording) => void
  },
  ref,
) {
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const finishingRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(maxSeconds);
  const [isRecording, setIsRecording] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(null);

  useImperativeHandle(ref, () => ({
    // 질문 인덱스를 넘겨 시작
    start: async (questionIdx) => {
      if (isRecording) return;
      finishingRef.current = false;
      setCurrentIdx(questionIdx);

      // 오디오 전용 스트림
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const rec = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        disableLogs: true,
      });
      recRef.current = rec;
      await rec.startRecording();

      setTimeLeft(maxSeconds);
      setIsRecording(true);
      onRecordingChange?.(true);
      onTick?.(maxSeconds);

      // 1초 카운트다운
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          onTick?.(Math.max(next, 0));
          if (next <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return Math.max(next, 0);
        });
      }, 1000);

      // 단발 타임아웃
      timeoutRef.current = setTimeout(() => {
        api.finish(); // 시간이 끝나면 자동 완료
      }, maxSeconds * 1000);
    },

    stop: async () => {
      // 강제 중단(저장O)
      await safeStop(false);
    },

    finish: async () => {
      // 정상 완료(저장O)
      await safeStop(false);
    },

    cancel: async () => {
      // 취소(저장X)
      await safeStop(true);
    },
  }));

  const api = {
    finish: async () => await safeStop(false),
  };

  const cleanupTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  async function safeStop(silent = false) {
    if (finishingRef.current) return;
    finishingRef.current = true;

    cleanupTimers();

    try {
      if (recRef.current) {
        await recRef.current.stopRecording();
        const blob = await recRef.current.getBlob();
        if (!silent && currentIdx != null) {
          const url = URL.createObjectURL(blob);
          onSaved?.(url, currentIdx);
        }
        recRef.current.reset();
        recRef.current.destroy();
        recRef.current = null;
      }
    } catch (e) {
      if (!silent) console.error(e);
    } finally {
      cleanupStream();
      setIsRecording(false);
      onRecordingChange?.(false);
      setCurrentIdx(null);
    }
  }

  useEffect(() => {
    return () => {
      cleanupTimers();
      cleanupStream();
    };
  }, []);

  return null; // UI는 부모에서 처리(타이머 등), 필요하면 표시용 요소를 넣어도 됨
});

export default QuestionAudioRecorder;
