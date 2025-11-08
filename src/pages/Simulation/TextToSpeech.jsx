// TextToSpeech.jsx
import React, { useEffect, useRef, useState } from 'react';

const TextToSpeech = ({
  voiceModel,
  currentQuestion,
  ttsKey,
  enabled = false,
  onSpeakingChange,
}) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const lastUrlRef = useRef(null);

  useEffect(() => {
    if (!enabled || !voiceModel) return;
    if (ttsKey == null) return;

    const fetchAudio = async () => {
      try {
        if (!voiceModel.apiKey?.model) {
          console.error('Missing ElevenLabs API key');
          onSpeakingChange?.(false);
          return;
        }

        onSpeakingChange?.(true);

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceModel.voiceId}/stream?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': voiceModel.apiKey.model,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: currentQuestion ?? '', // ✅ 같은 텍스트여도 ttsKey로 강제 재요청
              model_id: 'eleven_multilingual_v2',
              voice_settings: voiceModel.voice_settings,
            }),
          },
        );

        if (!response.ok) throw new Error(`TTS 요청 실패: ${response.status}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // 이전 URL 정리
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;

        setAudioUrl(url);

        // ✅ src 갱신 후 강제 재생
        requestAnimationFrame(() => {
          const el = audioRef.current;
          if (el) {
            try {
              el.load();
              const p = el.play?.();
              if (p && typeof p.then === 'function') p.catch(() => onSpeakingChange?.(false));
            } catch {
              onSpeakingChange?.(false);
            }
          }
        });
      } catch (error) {
        console.error('TTS API 에러:', error);
        onSpeakingChange?.(false);
      }
    };

    fetchAudio();

    // 클린업: 컴포넌트 업데이트/언마운트 시 플레이 중지
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    // ✅ enabled/voiceModel/ttsKey가 바뀔 때마다 재생 (currentQuestion은 있어도 되고 없어도 됨)
  }, [enabled, voiceModel, ttsKey, onSpeakingChange]);

  // enabled = false가 되면 speaking=false
  useEffect(() => {
    if (!enabled) onSpeakingChange?.(false);
  }, [enabled, onSpeakingChange]);

  // Object URL 메모리 정리
  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    };
  }, []);

  const handlePlay = () => onSpeakingChange?.(true);
  const handleEnded = () => onSpeakingChange?.(false);
  const handlePause = () => onSpeakingChange?.(false);
  const handleError = () => onSpeakingChange?.(false);

  return (
    <div style={{ display: 'none' }}>
      {enabled && audioUrl && (
        <audio
          ref={audioRef}
          autoPlay
          controls
          src={audioUrl}
          onPlay={handlePlay}
          onPlaying={handlePlay}
          onEnded={handleEnded}
          onPause={handlePause}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default TextToSpeech;
