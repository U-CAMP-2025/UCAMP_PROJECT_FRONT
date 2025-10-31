import React, { useEffect, useRef, useState } from 'react';

const TextToSpeech = ({ voiceModel, currentQuestion, enabled = false }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!enabled || !currentQuestion || !voiceModel) return;

    // if (stopRef.current === false) {
    //   stopRef.current = true;
    //   return;
    // }

    const fetchAudio = async () => {
      try {
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
        setAudioUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('TTS API 에러:', error);
      }
    };

    fetchAudio();
  }, [currentQuestion, enabled, voiceModel]);

  const handleAudioEnded = () => {
    setAudioUrl(null);
  };

  return (
    <div style={{ display: 'none' }}>
      {enabled && audioUrl && (
        <audio autoPlay controls onEnded={handleAudioEnded}>
          <source src={audioUrl} type='audio/mp3' />
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
