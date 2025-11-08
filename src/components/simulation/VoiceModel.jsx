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
    voiceId: '1SM7GgM6IMuvQlz2BwM3', // 남성 친근하고 따듯하다
    apiKey: { model: api_men },
    voice_settings: {
      stability: 0.2,
      similarity_boost: 0.8,
      style: 0.8,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'ETPP7D0aZVdEj12Aa7ho', // 여성 차분하고 신뢰감
    apiKey: { model: api_women },
    voice_settings: {
      stability: 0.85,
      similarity_boost: 0.9,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'dXtC3XhB9GtPusIpNtQx', // 남 화난듯하지만 공정하다
    apiKey: { model: api_men },
    voice_settings: {
      stability: 0.2,
      similarity_boost: 0.6,
      style: 0.9,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'rSZFtT0J8GtnLqoDoFAp', // 여 유머러스하고 상냥
    apiKey: { model: api_women },
    voice_settings: {
      stability: 0.3,
      similarity_boost: 0.8,
      style: 0.8,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'goT3UYdM9bhm0n2lmKQx', // 남 엄격하고 직설적이다
    apiKey: { model: api_men },
    voice_settings: {
      speed: 0.9,
      stability: 0.8,
      similarity_boost: 0.9,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  {
    voiceId: 'K7gx0ylJdff0yjM2uVQS', // 여 차가운 외모지만 부드럽
    apiKey: { model: api_women },
    voice_settings: {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true,
    },
  },
  // {
  //   voiceId: 'dXtC3XhB9GtPusIpNtQx', // 남 호기심 많고 적극적이다
  //   apiKey: { model: api_men },
  //   voice_settings: {
  //     stability: 0.35,
  //     similarity_boost: 0.75,
  //     style: 0.8,
  //     use_speaker_boost: true,
  //   },
  // },
  // {
  //   voiceId: 'rSZFtT0J8GtnLqoDoFAp', // 여 침착하고 신중
  //   apiKey: { model: api_women },
  //   voice_settings: {
  //     stability: 0.9,
  //     similarity_boost: 0.95,
  //     style: 0.2,
  //     use_speaker_boost: true,
  //   },
  // },
  // {
  //   voiceId: 'goT3UYdM9bhm0n2lmKQx', // 남 분석적이고 논리적이다.
  //   apiKey: { model: api_men },
  //   voice_settings: {
  //     stability: 0.8,
  //     similarity_boost: 0.9,
  //     style: 0.3,
  //     use_speaker_boost: true,
  //   },
  // },
  // {
  //   voiceId: 'K7gx0ylJdff0yjM2uVQS', // 여 긍정적이고 에너지 넘침
  //   apiKey: { model: api_women },
  //   voice_settings: {
  //     speed: 0.9,
  //     stability: 0.25,
  //     similarity_boost: 0.75,
  //     style: 0.95,
  //     use_speaker_boost: true,
  //   },
  // },
];

export default VoiceModel;
