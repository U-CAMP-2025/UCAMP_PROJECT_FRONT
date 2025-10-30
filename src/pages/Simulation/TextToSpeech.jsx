import { languages } from 'eslint-plugin-prettier';
import React, { useEffect, useRef, useState } from 'react';

const TextToSpeech = ({ voiceModel, currentQuestion }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const stopRef = useRef(false);

  useEffect(() => {
    // stopRef가 true인 경우에는 API 호출을 하지 않음
    if (stopRef.current) {
      console.log('test');
      stopRef.current = true; // 첫 렌더링 이후 API 호출을 허용
      fetch(
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
            languages: 'ko',
            voice_settings: voiceModel.voice_settings,
          }),
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          setAudioUrl(URL.createObjectURL(blob));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    stopRef.current = true;
  }, [currentQuestion]);

  const handleAudioEnded = () => {
    setAudioUrl(null);
  };

  return (
    <div style={{ display: 'none' }}>
      {audioUrl && (
        <audio autoPlay controls onEnded={handleAudioEnded}>
          <source src={audioUrl} type='audio/mp3' />
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
