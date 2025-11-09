import styled, { keyframes } from 'styled-components';

// --- Animations ---
export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

export const podiumUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---

// 1. Hero Section
export const HeroContainer = styled.section`
  position: relative;
  background: linear-gradient(-45deg, #667eea, #764ba2, #6b8dd6, #8e37d7);
  background-size: 400% 400%;
  animation: ${gradientBG} 15s ease infinite;
  min-height: 560px;
  padding: 60px 5%;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin: 20px auto 60px;
  max-width: 1400px;
  box-shadow: 0 20px 40px -10px rgba(102, 126, 234, 0.4);

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 60px 24px;
    height: auto;
  }
`;

export const BackgroundBlur = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(60px);
    animation: ${float} 8s ease-in-out infinite;
  }
  &:before {
    top: -50px;
    right: 10%;
  }
  &:after {
    bottom: -50px;
    left: 10%;
    animation-delay: -4s;
  }
`;

export const ContentWrapper = styled.div`
  z-index: 2;
  max-width: 500px;
  animation: ${fadeInUp} 0.8s ease-out;
  @media (max-width: 968px) {
    margin-bottom: 60px;
  }
`;

export const MainHeading = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

export const MainHeading2 = styled.span`
  display: block;
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  margin-top: 8px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const Description = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 40px;
  line-height: 1.6;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

export const PrimaryButton = styled.button`
  padding: 18px 42px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: #fff;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const CardsWrapper = styled.div`
  position: relative;
  width: 500px;
  height: 400px;
  z-index: 1;
  perspective: 1000px; // 3D 효과를 위한 원근감

  @media (max-width: 968px) {
    width: 100%;
    max-width: 500px;
    height: 350px;
    margin-top: 40px;
  }
`;

// 글래스모피즘(Glassmorphism) 카드 스타일
export const Card = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 28px;
  padding: 24px;
  width: 220px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${float} 6s ease-in-out infinite;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.05) translateY(-10px) !important;
    z-index: 10 !important;
  }
`;

export const Card1 = styled(Card)`
  top: 0px;
  right: 150px;
  animation-delay: 0s;
  z-index: 2;
`;
export const Card2 = styled(Card)`
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  animation-delay: -2s;
  z-index: 3;
`;
export const Card3 = styled(Card)`
  bottom: 20px;
  right: 20px;
  animation-delay: -4s;
  z-index: 1;
`;

export const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  box-shadow: 0 8px 16px -4px rgba(102, 126, 234, 0.5);
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 8px;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
  margin: 0;
`;

// 2. Shared Section Styles
export const SectionContainer = styled.section`
  width: 80%;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
  background-color: ${(props) => props.$bgColor || 'transparent'};
  border-radius: ${(props) => (props.$bgColor ? '40px' : '0')};

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 16px;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const SectionSubTitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 48px;
`;

// 3. Problem & Solution Section
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

export const ProblemCard = styled.div`
  background: ${(props) => props.bgColor};
  border-radius: 32px;
  padding: 40px 32px;
  text-align: left;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.8s ease-out backwards;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
`;

export const AvatarWrapper2 = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  transition: transform 0.3s;
  ${ProblemCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

export const CardTitle2 = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
  line-height: 1.3;
`;

export const CardDescription2 = styled.p`
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  opacity: 0.9;
`;

// 4. Review Slider Section
export const SliderWrapper = styled.div`
  position: relative;
  padding: 0 60px;
  margin: 50px auto 80px;
  max-width: 1100px;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$direction === 'left' ? 'left: 0;' : 'right: 0;')}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #edf2f7;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-50%) scale(1.1);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CardContainer2 = styled.div`
  overflow: hidden;
  padding: 20px 10px; // 그림자 잘림 방지
  margin: -20px -10px;
`;

export const Track = styled.div`
  display: flex;
  gap: ${(props) => props.$gap}px;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  transform: translateX(${(props) => props.$translatePx}px);
`;

export const ReviewCardWrapper = styled.div`
  flex-shrink: 0;
`;

// 말풍선 스타일 리뷰 카드
export const ReviewCard = styled.div`
  background: #fff;
  border-radius: 24px;
  border-bottom-left-radius: 4px; // 말풍선 효과
  padding: 28px;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #edf2f7;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ReviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: left;
`;

export const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

export const ReviewItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.5;

  span {
    font-size: 1.2rem;
  } // 이모지 크기
`;

export const ReviewText = styled.span`
  font-size: 0.95rem;
  color: #4a5568;
`;

// 5. Ranking Section
export const RankingContainer = styled.div`
  background: #ebf8ff;
  border-radius: 32px;
  /* 타이틀이 밖으로 나갔으므로 상단 패딩을 줄임 (60px -> 40px) */
  padding: 40px;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.08);
  border: 1px solid #e2e8f0;
  max-width: 1000px; /* 너무 넓어지지 않게 최대 너비 설정 권장 */
  margin: 0 auto; /* 중앙 정렬 */
`;

export const CompetitionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a202c; /* 조금 더 진한 색상으로 주목도 UP */
  margin-top: 80px; /* 위쪽 섹션(슬라이더)과의 간격 확보 */
  margin-bottom: 30px; /* 아래쪽 랭킹 박스와의 간격 */
  line-height: 1.3;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-top: 60px;
  }
`;

export const RankingHeader = styled.div`
  display: flex;
  flex-direction: column; /* 수직 정렬로 변경 */
  align-items: center; /* 가운데 정렬 */
  justify-content: center;
  gap: 24px; /* 타이틀과 탭 사이 간격 */
  margin-bottom: 50px;
`;

export const RankingSubTitle = styled.h3`
  font-size: 1.6rem; /* 1.25rem -> 1.6rem으로 확대 */
  font-weight: 700; /* 600 -> 700으로 조금 더 두껍게 */
  color: #2d3748; /* #718096 -> 조금 더 진한 회색으로 변경하여 강조 */
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.4rem; /* 모바일에서도 적당히 크게 유지 */
  }
`;

export const Tabs = styled.div`
  display: flex;
  background: #f7fafc;
  padding: 6px;
  border-radius: 14px;
`;

export const Tab = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? '#667eea' : '#718096')};
  box-shadow: ${(props) => (props.active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none')};

  &:hover {
    color: #667eea;
  }
`;

export const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4%;
  padding-top: 30px;
  min-height: 300px; // 높이 확보
`;

export const PodiumItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 30%;
  max-width: 180px;
  animation: ${podiumUp} 1s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
`;

export const Crown = styled.div`
  position: absolute;
  top: -50px;
  font-size: 40px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  animation: ${float} 3s ease-in-out infinite;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border: 4px solid #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

export const RankBadge = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  background: ${(props) =>
    props.rank === 1 ? '#FFD700' : props.rank === 2 ? '#C0C0C0' : '#CD7F32'};
  color: white;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

export const Username = styled.div`
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
`;

export const Score = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
`;

export const Pedestal = styled.div`
  width: 100%;
  height: ${(props) => props.height}px;
  // 랭킹별 다른 컬러 적용
  background: ${(props) =>
    props.rank === 1
      ? 'linear-gradient(to bottom, #667eea, #764ba2)'
      : props.rank === 2
        ? 'linear-gradient(to bottom, #a3bffa, #8a9fdc)'
        : 'linear-gradient(to bottom, #d6bcfa, #9f7aea)'};
  border-radius: 16px 16px 0 0;
  opacity: 0.8;
  box-shadow: inset 0 -20px 40px rgba(0, 0, 0, 0.1);
`;

// 6. CTA Section
export const CTAContainer = styled.div`
  margin: 100px auto 40px;
  max-width: 1200px;
  padding: 0 5%;
`;

export const CTAContent = styled.div`
  background:
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
    linear-gradient(to right, #4facfe 0%, #00f2fe 100%);

  border-radius: 40px;
  padding: 80px 40px;
  text-align: center;

  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px -15px rgba(79, 172, 254, 0.4);

  @media (max-width: 768px) {
    padding: 60px 30px;
  }
`;

export const CTAButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const SubText = styled.p`
  font-size: 1.3rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 16px;
`;

export const MainText = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.3;
  margin-bottom: 48px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const PrimaryButton2 = styled.button`
  padding: 20px 48px;
  font-size: 1.4rem;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: #fff;
  color: #00c6fb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);

  /* 중앙 정렬 */
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  /* 추가 설정 */
  width: auto;
  white-space: nowrap;
  line-height: 1;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    color: #005bea;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 18px 32px;
    font-size: 1.2rem;
  }
`;

export const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: currentColor;
  border-radius: 50%;
  padding: 6px;
  transition: transform 0.3s ease;

  ${PrimaryButton2}:hover & {
    transform: translateX(6px);
  }

  svg {
    width: 100%;
    height: 100%;
    stroke: #fff;
    fill: none;
    display: block;
  }
`;

// --- Data ---
export const cardData = [
  {
    id: 1,
    title: '👩‍💻 백엔드 신입 질문셋',
    reviews: [{ text: '실무 면접이랑 정말 비슷했어요!' }, { text: '꼬리물기 질문 대비에 최고👍' }],
  },
  {
    id: 2,
    title: '🎨 디자인 인성면접',
    reviews: [
      { text: '압박 면접도 유연하게 대처했어요.' },
      { text: '면접관 의도를 파악하게 됐습니다.' },
    ],
  },
  {
    id: 3,
    title: '⚡️ 프론트엔드 기술면접',
    reviews: [
      { text: '필수 CS 지식 정리하기 좋아요.' },
      { text: '최신 기술 트렌드 질문도 있네요!' },
    ],
  },
  {
    id: 4,
    title: '💼 경력직 이직 질문',
    reviews: [
      { text: '물경력 고민이었는데 도움됐어요.' },
      { text: '연봉 협상 팁까지 얻어갑니다 ㅎㅎ' },
    ],
  },
];

export const cards = [
  {
    id: 1,
    bgColor: '#E0F7FA', // 더 밝고 깨끗한 민트
    avatar: '😫',
    title: '혼자 준비하기 너무 막막해요',
    description: '예상 질문 뽑기부터 답변 정리까지... 어디서부터 시작해야 할지 모르겠다면?',
  },
  {
    id: 2,
    bgColor: '#F3E5F5', // 더 부드러운 라벤더
    avatar: '🤔',
    title: '내 답변, 괜찮은 걸까요?',
    description: '열심히 준비했지만 확신이 없을 때, 다른 유저의 피드백과 AI의 조언을 받아보세요.',
  },
  {
    id: 3,
    bgColor: '#FFF3E0', // 따뜻한 오렌지
    avatar: '😨',
    title: '실전만 되면 머리가 하얘져요',
    description: 'AI 면접관과의 무한 반복 실전 연습으로 면접 공포증을 극복하세요!',
  },
];

export const mockData = {
  friends: [
    { id: 1, username: '열정신입', score: 25, avatar: '🐣', rank: 2 },
    { id: 2, username: '합격가즈아', score: 30, avatar: '🔥', rank: 1 },
    { id: 3, username: '취뽀성공', score: 20, avatar: '🍀', rank: 3 },
  ],
  world: [
    { id: 1, username: '이직러', score: 476, avatar: '💼', rank: 2 },
    { id: 2, username: '면접왕', score: 530, avatar: '👑', rank: 1 },
    { id: 3, username: '개발자', score: 329, avatar: '💻', rank: 3 },
  ],
};

export const VideoWrapper = styled.div`
  margin-top: 40px;
  border-radius: 20px;
  overflow: hidden;
  width: 90%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
  40% { transform: translateY(-10px) translateX(-50%); }
  60% { transform: translateY(-5px) translateX(-50%); }
`;

export const FloatingScrollButton = styled.button`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary[9] || '#667eea'}; /* 테마 색상 또는 직접 지정 */
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100; /* 다른 요소보다 위에 오도록 */
  transition: all 0.3s ease;
  animation: ${bounce} 2s infinite;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[9] || '#667eea'};
    color: white;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;
