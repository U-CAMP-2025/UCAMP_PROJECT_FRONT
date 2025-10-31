import axiosInstance from '@api/axios';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

const QuestionAudioRecorder = forwardRef(function QuestionAudioRecorder(
  {
    maxSeconds = 60,
    onSaved, // (url, qIdx) => void
    onTick, // (timeLeft) => void
    onRecordingChange, // (isRecording) => void
    onAutoFinish, // (qIdx, url) => void
    simulationId,
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

      //  타임아웃: qIdx를 finish 전에 캡처
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

  // 반환값을 { url, qIdx }로 변경
  async function safeStop(silent = false) {
    if (finishingRef.current) return { url: null, qIdx: null };
    finishingRef.current = true;

    cleanupTimers();

    let url = null;
    const qIdx = currentIdx; // 현재 질문 인덱스 보관

    try {
      if (recRef.current) {
        await recRef.current.stopRecording();
        const blob = await recRef.current.getBlob();

        // 1) 로컬 미리보기 URL (선택)
        const localPreviewUrl = URL.createObjectURL(blob);

        // 2) silent가 아니면 업로드 시도
        if (!silent && qIdx != null) {
          try {
            const file = new File([blob], `q${(qIdx ?? 0) + 1}.webm`, { type: 'audio/webm' });
            const form = new FormData();
            form.append('file', file);

            // Content-Type 수동 설정 금지 (Axios가 자동 설정)
            const res = await axiosInstance.post(
              `/simulation/${simulationId}/answers/${qIdx}/audio`,
              form,
            );

            // 서버가 url을 줄 수도/안 줄 수도 있음 (지금 단계는 보통 없음)
            const serverUrl =
              res?.data?.data?.url ?? // (나중에 URL 주도록 바꾸면 여기서 잡힘)
              res?.data?.url ?? // 널가드
              null;

            // 현재 단계(저장만)에서는 serverUrl이 보통 null 이므로, 로컬 프리뷰로 폴백
            url = serverUrl || localPreviewUrl;

            // 필요하면 업로드 메타를 참고할 수도 있음
            // const { ok, storedName, originalName, size, contentType } = res?.data || {};
            console.log('upload result:', res.data);

            onSaved?.(url, qIdx);
          } catch (uploadErr) {
            console.error('오디오 업로드 실패:', uploadErr);
            // 업로드 실패 시에도 로컬 프리뷰로 UI 지속
            url = localPreviewUrl;
            onSaved?.(url, qIdx);
          }
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
      setCurrentIdx(null); // qIdx는 이미 보관했으므로 리셋 OK
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
