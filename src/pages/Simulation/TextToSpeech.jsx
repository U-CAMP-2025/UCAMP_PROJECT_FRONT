// TextToSpeech.jsx
import React, { useEffect, useRef, useState } from 'react';

const TextToSpeech = ({ voiceModel, currentQuestion, enabled = false, onSpeakingChange }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const lastUrlRef = useRef(null);

  useEffect(() => {
    if (!enabled || !currentQuestion || !voiceModel) return;

    const fetchAudio = async () => {
      try {
        onSpeakingChange?.(true);
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceModel.voiceId}/stream?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: currentQuestion,
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
      } catch (error) {
        console.error('TTS API 에러:', error);
        onSpeakingChange?.(false);
      }
    };

    fetchAudio();

    // 컴포넌트 업데이트/언마운트 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentQuestion, enabled, voiceModel, onSpeakingChange]);

  // enabled가 false가 되면 즉시 speaking=false로
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

  const handlePlay = () => onSpeakingChange?.(true); // ✅ 재생 시작 → true
  const handleEnded = () => {
    // ✅ 종료 → false
    onSpeakingChange?.(false);
    // 재사용 시 새 blob으로 교체되므로 URL은 여기서 바로 지우지 않아도 됨
  };
  const handlePause = () => onSpeakingChange?.(false); // (일시정지) → false
  const handleError = () => onSpeakingChange?.(false); // (에러) → false

  return (
    <div style={{ display: 'none' }}>
      {enabled && audioUrl && (
        <audio
          ref={audioRef}
          autoPlay
          controls
          src={audioUrl}
          onPlay={handlePlay}
          onPlaying={handlePlay} // 일부 브라우저 호환
          onEnded={handleEnded}
          onPause={handlePause}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default TextToSpeech;
