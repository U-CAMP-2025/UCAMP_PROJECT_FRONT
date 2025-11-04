import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { RecordRTCPromisesHandler } from 'recordrtc';

const SessionVideoRecorder = forwardRef(function SessionVideoRecorder(
  { width = 416, height = 256 },
  ref,
) {
  const videoElRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const config = {
    audioBitsPerSecond: 32000, // 오디오 비트레이트 32kbps
    videoBitsPerSecond: 500000, // 비디오 비트레이트 500kbps
    bitsPerSecond: 530000, // 전체 비트레이트
    frameRate: 12, // 프레임 레이트 12fps
    width: 854, // 해상도 480p (854x480)
    height: 480, // 해상도 480p
  };

  useImperativeHandle(ref, () => ({
    start: async () => {
      if (recRef.current) return;
      // 카메라+마이크 스트림
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      streamRef.current = stream;

      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
        await videoElRef.current.play().catch(() => {});
      }

      const rec = new RecordRTCPromisesHandler(stream, {
        type: 'video',
        mimeType: 'video/mp4',
        ...config,
      });
      recRef.current = rec;
      await rec.startRecording();
    },

    stop: async () => {
      if (!recRef.current) return null;
      await recRef.current.stopRecording();
      const blob = await recRef.current.getBlob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      recRef.current.reset();
      recRef.current.destroy();
      recRef.current = null;

      // 스트림 종료
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      return url;
    },

    getUrl: () => videoUrl,
  }));

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <div
      style={{
        border: '1px solid #cfcfcf',
        borderRadius: 14,
        padding: 8,
        width,
        height,
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
  );
});

export default SessionVideoRecorder;
