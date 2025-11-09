import { axiosInstance } from '@api/axios';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

const QuestionAudioRecorder = forwardRef(function QuestionAudioRecorder(
  {
    maxSeconds = 120,
    onSaved, // (url, qaId, transcript)
    onTick, // (timeLeft)
    onRecordingChange, // (isRecording)
    onAutoFinish, // (qaId, url)
    simulationId,
  },
  ref,
) {
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const finishingRef = useRef(false);

  // 현재 녹음 메타
  const qaIdRef = useRef(null);
  const qIdxRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(maxSeconds);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    onRecordingChange?.(isRecording);
  }, [isRecording, onRecordingChange]);

  useEffect(() => {
    onTick?.(timeLeft);
  }, [timeLeft, onTick]);
  useImperativeHandle(ref, () => ({
    // 부모에서: start({ qaId, qIdx })
    start: async ({ qaId, qIdx } = {}) => {
      if (isRecording) return;
      if (!qaId && qIdx == null) return; // 최소한 하나는 필요
      finishingRef.current = false;

      qaIdRef.current = qaId ?? null;
      qIdxRef.current = typeof qIdx === 'number' ? qIdx : null;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const rec = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        recorderType: RecordRTC.MediaStreamRecorder, // ★ WebM(Opus)
        mimeType: 'audio/webm;codecs=opus', // ★ 진짜 webm
        numberOfAudioChannels: 1,
        disableLogs: true,
      });
      recRef.current = rec;
      await rec.startRecording();

      setTimeLeft(maxSeconds);
      setIsRecording(true);
      // onRecordingChange?.(true);
      // onTick?.(maxSeconds);

      // 카운트다운
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return next;
        });
      }, 1000);

      // 타임아웃 → finish 후 (qaId, url)로 통지
      timeoutRef.current = setTimeout(async () => {
        const { url, qaId: _qaId } = await api.finish();
        if (_qaId && url) onAutoFinish?.(_qaId, url);
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

  // qaId 기반 업로드 & 반환 { url, qaId, qIdx }
  async function safeStop(silent = false) {
    if (finishingRef.current) return { url: null, qaId: qaIdRef.current, qIdx: qIdxRef.current };
    finishingRef.current = true;

    cleanupTimers();

    let url = null;
    let transcript = '';
    const qaId = qaIdRef.current;
    const qIdx = qIdxRef.current;

    try {
      if (recRef.current) {
        await recRef.current.stopRecording();
        const blob = await recRef.current.getBlob();
        console.debug('[REC] stopped. blob.size=', blob.size, 'blob.type=', blob.type);

        // 로컬 프리뷰 URL (업로드 실패 시 폴백)
        const localPreviewUrl = URL.createObjectURL(blob);

        if (!silent && (qaId || qIdx != null)) {
          try {
            // 파일명: qaId가 있으면 audio{qaId(2자리)}.webm, 없으면 인덱스
            const prettyId =
              qaId != null
                ? String(qaId).padStart(2, '0')
                : String((qIdx ?? 0) + 1).padStart(2, '0');
            const mime = blob.type || 'audio/webm';
            const ext = mime.includes('wav')
              ? 'wav'
              : mime.includes('webm')
                ? 'webm'
                : mime.includes('m4a')
                  ? 'm4a'
                  : mime.includes('mp3')
                    ? 'mp3'
                    : 'webm';
            const file = new File([blob], `audio_${prettyId}_${simulationId}.${ext}`, {
              type: mime,
            });

            const form = new FormData();
            form.append('file', file);
            if (simulationId) form.append('simulationId', simulationId);
            if (qaId != null) form.append('qaId', String(qaId)); // ✅ 서버 식별자

            // ✅ baseURL이 /api 이므로 슬래시 없이 호출
            // const res = await axiosInstance.post(
            //   qaId != null && simulationId
            //     ? `simulation/${simulationId}/answers/${qaId}/audio`
            //     : `simulation/answers/audio`,
            //   form,
            // );
            const urlPath =
              qaId != null && simulationId
                ? `simulation/${simulationId}/answers/${qaId}/audio`
                : `simulation/answers/audio`;

            console.debug('[UPLOAD] start', {
              urlPath,
              name: file.name,
              size: file.size,
              type: file.type,
            });

            axiosInstance
              .post(
                qaId != null && simulationId
                  ? `simulation/${simulationId}/answers/${qaId}/audio`
                  : `simulation/answers/audio`,
                form,
              )
              .then((res) => {
                console.log('업로드 성공:', res.data);
              })
              .catch((err) => {
                console.error('업로드 실패:', err);
              });

            // const serverUrl = res?.data?.data?.url || res?.data?.url || null;
            // transcript = res?.data?.data?.transcript ?? '';
            // url = serverUrl || localPreviewUrl;

            // ✅ 부모로 (url, qaId, transcript)
            // onSaved?.(url, qaId ?? qIdx, transcript);
            // console.log('upload result:', res.data);
          } catch (uploadErr) {
            console.error('오디오 업로드 실패:', uploadErr);
            url = localPreviewUrl;
            onSaved?.(url, qaId ?? qIdx, transcript);
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
      // onRecordingChange?.(false);
      qaIdRef.current = null;
      qIdxRef.current = null;
    }

    return { url, qaId, qIdx };
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
