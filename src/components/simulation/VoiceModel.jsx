// stability  낮으면 감정 풍부
// similarity_boost: 0.8, 높으면 음역대 유지
// style: 0.8, 높으면 억양 강화

// Jeanne Mance  K7gx0ylJdff0yjM2uVQS
// Selly Han ETPP7D0aZVdEj12Aa7ho
// Nova westbrook rSZFtT0J8GtnLqoDoFAp
// 남
// Mark 1SM7GgM6IMuvQlz2BwM3
// Hale dXtC3XhB9GtPusIpNtQx
// Edward goT3UYdM9bhm0n2lmKQx
const api_women = import.meta.env.VITE_ELEVENLABS_API_KEY1;
const api_men = import.meta.env.VITE_ELEVENLABS_API_KEY2;

const VoiceModel = [
  {
    voiceId: '1SM7GgM6IMuvQlz2BwM3', // 남성 Mark
    apiKey: { model: api_men },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'ETPP7D0aZVdEj12Aa7ho', // 여성 Selly Han
    apiKey: { model: api_women },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'dXtC3XhB9GtPusIpNtQx', // 남 Hale
    apiKey: { model: api_men },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.9,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'rSZFtT0J8GtnLqoDoFAp', // 여 Nova westbrook
    apiKey: { model: api_women },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.8,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'goT3UYdM9bhm0n2lmKQx', // 남 Edward
    apiKey: { model: api_men },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'K7gx0ylJdff0yjM2uVQS', // 여 Jeanne Mance
    apiKey: { model: api_women },
    voice_settings: {
      speed: 0.9,
      stability: 0.5,
      similarity_boost: 0.75,
      use_speaker_boost: true,
    },
  },
];

export default VoiceModel;
