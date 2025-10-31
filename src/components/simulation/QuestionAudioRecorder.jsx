import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

const QuestionAudioRecorder = forwardRef(function QuestionAudioRecorder(
  {
    maxSeconds = 60,
    onSaved, // (url, qIdx) => void
    onTick, // (timeLeft) => void
    onRecordingChange, // (isRecording) => void
    onAutoFinish, // (qIdx, url) => void
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
    start: async (questionIdx) => {
      if (isRecording) return;
      finishingRef.current = false;
      setCurrentIdx(questionIdx);

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

      // 카운트다운
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

      // ★ 타임아웃: qIdx를 finish 전에 캡처
      timeoutRef.current = setTimeout(async () => {
        const qIdx = currentIdx; // <- 캡처!
        const { url } = await api.finish(); // 저장 수행
        if (qIdx != null && url) onAutoFinish?.(qIdx, url);
      }, maxSeconds * 1000);
    },

    stop: async () => await safeStop(false),
    finish: async () => await safeStop(false),
    cancel: async () => await safeStop(true),
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

  // ★ 반환값을 { url, qIdx }로 변경
  async function safeStop(silent = false) {
    if (finishingRef.current) return { url: null, qIdx: null };
    finishingRef.current = true;

    cleanupTimers();

    let url = null;
    // ★ 현재 인덱스를 먼저 보관
    const qIdx = currentIdx;

    try {
      if (recRef.current) {
        await recRef.current.stopRecording();
        const blob = await recRef.current.getBlob();
        if (!silent && qIdx != null) {
          url = URL.createObjectURL(blob);
          onSaved?.(url, qIdx);
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
      setCurrentIdx(null); // ← 이제 리셋해도 됨(이미 qIdx 보관)
    }

    return { url, qIdx };
  }

  useEffect(() => {
    return () => {
      cleanupTimers();
      cleanupStream();
    };
  }, []);

  return null;
});

export default QuestionAudioRecorder;
