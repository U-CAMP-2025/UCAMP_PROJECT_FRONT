import { fetchUserStatus } from '@api/userAPIS';
import { Header } from '@components/layout/Header';
import { PageContainer } from '@components/layout/PageContainer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import { useAuthStore } from '@store/auth/useAuthStore';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function LandingPage() {
  const { isLogin } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  const maxIndex = cardData.length - cardsPerView;
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useNavigate();
  const currentData = mockData[activeTab];
  const sortedData = [...currentData].sort((a, b) => b.score - a.score);

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [
    sortedData[1], // 2nd place (left)
    sortedData[0], // 1st place (center)
    sortedData[2], // 3rd place (right)
  ];

  const handleClickLoginButton = () => {
    if (isLogin) {
      navigate('/myqa'); // 이미 로그인된 경우 마이페이지로 이동
    } else {
      setLoginDialogOpen(true); // 로그인 안 됐으면 다이얼로그 열기
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // 신규 유저 판별
  useEffect(() => {
    if (isLogin) {
      fetchUserStatus().then((response) => {
        console.log(response);
      });
    }
  }, []);

  // slider pixel-based calculation
  const containerRef = useRef(null);
  const [cardWidthPx, setCardWidthPx] = useState(0);
  const cardGap = 20; // px

  useLayoutEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const cardW = (w - cardGap * (cardsPerView - 1)) / cardsPerView;
      setCardWidthPx(cardW);
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [cardsPerView]);

  const offsetPx = cardWidthPx ? -currentIndex * (cardWidthPx + cardGap) : 0;

  return (
    <>
      <Header></Header>
      <PageContainer footer>
        {/* Hero Section */}
        <HeroContainer>
          <BackgroundCircle />
          <ContentWrapper>
            <MainHeading>
              면접 강화 툴<br />
              면접톡!
            </MainHeading>
            <SubHeading>
              합격은 면접톡이 <br />
              책임진다
            </SubHeading>
            <Description>면접 연습&피드백 루틴을 경험해보세요!</Description>
            <ButtonGroup>
              <PrimaryButton onClick={handleClickLoginButton}>지금 시작하기</PrimaryButton>
              <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
            </ButtonGroup>
          </ContentWrapper>

          <CardsWrapper>
            <Card as={Card1}>
              <CardIcon>📝</CardIcon>
              <CardTitle>AI 면접 분석</CardTitle>
              <CardDescription>연습 후 답변을 분석하고 개선점을 알려드립니다</CardDescription>
            </Card>
            <Card as={Card2}>
              <CardIcon>💼</CardIcon>
              <CardTitle>합격 전략</CardTitle>
              <CardDescription>
                지원자들의 면접노트 공유하며
                <br /> 정보 고립을 해결합니다.
              </CardDescription>
            </Card>
            <Card as={Card3}>
              <CardIcon>🧑‍⚖️</CardIcon>
              <CardTitle>실전 환경</CardTitle>
              <CardDescription>
                AI 면접관과 함께 실전처럼 연습하고 결과를 저장하세요.
              </CardDescription>
            </Card>
          </CardsWrapper>
        </HeroContainer>
        {/* Course Section */}
        <Container>
          <Title2>면접 준비, 혼자 하려니 막막하지 않나요?</Title2>
          <CardsWrapper2>
            {cards.map((card) => (
              <Cardd key={card.id} bgColor={card.bgColor}>
                <AvatarWrapper2>{card.avatar}</AvatarWrapper2>
                <CardTitle2>{card.title}</CardTitle2>
                <CardDescription2>{card.description}</CardDescription2>
              </Cardd>
            ))}
          </CardsWrapper2>
        </Container>
        {/* Testimonial Section */}
        <Container>
          <Title2>이젠 다른 사람들과 협력해보세요!</Title2>
          {/* Ranking */}
          <ContainerR>
            <HeaderR>
              <TitleR>주간랭킹</TitleR>
              <Tabs>
                <Tab active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                  활동순
                </Tab>
                <Tab active={activeTab === 'world'} onClick={() => setActiveTab('world')}>
                  스크랩순
                </Tab>
              </Tabs>
            </HeaderR>

            <PodiumContainer>
              {podiumOrder.map((user, index) => {
                const actualRank = user.rank;
                const pedestalHeights = [80, 120, 60]; // heights for 2nd, 1st, 3rd

                return (
                  <PodiumItem key={user.id}>
                    {actualRank === 1 && <Crown>👑</Crown>}
                    <AvatarWrapper>
                      <Avatar bg={actualRank === 1 ? '#fff8e1' : '#f5f5f5'} rank={actualRank}>
                        {user.avatar}
                      </Avatar>
                      <RankBadge rank={actualRank}>{actualRank}</RankBadge>
                    </AvatarWrapper>
                    <Username>{user.username}</Username>
                    <Score>{user.score.toLocaleString()}</Score>
                    <ScoreLabel>---</ScoreLabel>
                    <Pedestal height={pedestalHeights[index]} />
                  </PodiumItem>
                );
              })}
            </PodiumContainer>
          </ContainerR>
          {/* ////////////////////////////////////////////////// */}
          <SliderWrapper>
            <ArrowButton $direction='left' onClick={handlePrev} disabled={currentIndex === 0}>
              <svg viewBox='0 0 24 24' fill='none'>
                <path d='M15 18l-6-6 6-6' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </ArrowButton>

            <CardContainer2 ref={containerRef}>
              <Track $translatePx={offsetPx}>
                {cardData.map((card) => (
                  <CardWrapper
                    key={card.id}
                    style={{ minWidth: cardWidthPx ? `${cardWidthPx}px` : undefined }}
                  >
                    <Cards>
                      <Title3>{card.title}</Title3>
                      <ReviewSection>
                        💬
                        {card.reviews.map((review, idx) => (
                          <ReviewItem key={idx}>
                            <ReviewText>`{review.text}`</ReviewText>
                          </ReviewItem>
                        ))}
                      </ReviewSection>
                    </Cards>
                  </CardWrapper>
                ))}
              </Track>
            </CardContainer2>

            <ArrowButton2
              $direction='right'
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
            >
              <svg viewBox='0 0 24 24' fill='none'>
                <path d='M9 18l6-6-6-6' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </ArrowButton2>
          </SliderWrapper>
        </Container>
        {/* CTA Section */}
        <Container2>
          <CTASection>
            <Content>
              <SubText>면접 준비, 지금부터 시작해보세요.</SubText>
              <MainText>면접톡과 함께 시작할 준비가 되셨나요?</MainText>
              <ButtonGroup2>
                <PrimaryButton2 onClick={handleClickLoginButton}>
                  시작하기
                  <ArrowIcon>
                    <svg viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M5 12h14M12 5l7 7-7 7'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </ArrowIcon>
                </PrimaryButton2>
                <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
              </ButtonGroup2>
            </Content>
          </CTASection>
        </Container2>
      </PageContainer>
    </>
  );
}

// const float = keyframes`
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-20px); }
// `;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const HeroContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 600px;
  padding: 80px 0px 80px 70px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 40px;
  width: 100%;
  max-width: 1200px; /* 너무 넓어지는 것 방지 */
  margin: 0 auto;
  margin-bottom: 30px;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 60px 24px;
    text-align: center;
    width: 95%;
  }
`;

const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ${pulse} 4s ease-in-out infinite;

  &:nth-child(1) {
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: 20%;
  }

  &:nth-child(2) {
    width: 300px;
    height: 300px;
    top: -50px;
    right: 15%;
    animation-delay: 1s;
  }

  &:nth-child(3) {
    width: 200px;
    height: 200px;
    bottom: 30%;
    right: 30%;
    animation-delay: 2s;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  max-width: 600px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 968px) {
    max-width: 100%;
    margin-bottom: 40px;
  }
`;

const MainHeading = styled.h1`
  font-size: 64px;
  font-weight: 900;
  color: white;
  margin: 0 0 24px 0;
  line-height: 1.2;
  letter-spacing: -1px;

  @media (max-width: 968px) {
    font-size: 48px;
  }

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const SubHeading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 32px 0;
  line-height: 1.4;

  @media (max-width: 968px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const CtaText = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 32px 0;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 32px;
  }
`;

const PrimaryButton = styled(Button)`
  background: white;
  color: #667eea;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const CardsWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 400px;
  height: 400px;

  @media (max-width: 968px) {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: unset;
  }
`;

const Card = styled.div`
  position: absolute;
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 240px;
  height: 180px;
  @media (max-width: 968px) {
    position: relative;
    max-width: 100%;
  }
`;
const Card1 = styled(Card)`
  top: 70px;
  right: 200px;
  z-index: 2;
`;
const Card2 = styled(Card)`
  top: 40px;
  left: 280px;
  transform: translateX(-50%);
  z-index: 1;
`;
const Card3 = styled(Card)`
  bottom: 10px;
  right: 360px;
  z-index: 3;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-size: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
`;

const CardDescription = styled.p`
  font-size: 13px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
`;

const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0px;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 968px) {
    padding: 16px;
    width: 95%;
  }
`;
const Container2 = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 968px) {
    padding: 24px 16px;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AvatarWrapper = styled.div`
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;
//
const Title2 = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 40px;

  @media (max-width: 968px) {
    font-size: 1.6rem;
    margin-bottom: 24px;
    text-align: center;
  }
`;

const Subtitle2 = styled.p`
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 60px;
  }
`;

const CardsWrapper2 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 968px) {
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    padding: 0 8px;
  }
`;

const Cardd = styled.div`
  background: ${({ bgColor }) => bgColor};
  border-radius: 24px;
  padding: 48px 32px;
  text-align: left;
  max-width: 360px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
  width: 100%;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    text-align: center;
    max-width: 90%; // 모바일에서 카드가 화면 꽉 차도록
    padding: 32px 20px;
  }
`;

const AvatarWrapper2 = styled.div`
  width: 64px;
  height: 64px;
  background: #fff;
  border-radius: 50%;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const CardTitle2 = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const CardDescription2 = styled.p`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.7;
`;
//

const SliderWrapper = styled.div`
  position: relative;
  padding: 0 60px;
`;

const CardContainer2 = styled.div`
  display: flex;
  gap: 20px;
  overflow: hidden;
`;

const CardWrapper = styled.div`
  min-width: calc(33.333% - 14px);
  transition: transform 0.5s ease-in-out;
  /* translate handled by Track wrapper */

  @media (max-width: 1024px) {
    min-width: calc(50% - 10px);
  }

  @media (max-width: 640px) {
    min-width: 100%;
  }
`;

const Cards = styled.div`
  background: #f3f8fc;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  padding: 10px 28px 22px 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
`;

const Track = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.35s ease;
  transform: translateX(${(props) => (props.$translatePx ? `${props.$translatePx}px` : '0px')});
`;

const Title3 = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.4;
  text-align: left;
  margin-bottom: 50px;
`;

const ReviewSection = styled.div`
  text-align: left;
`;

const ReviewItem = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ReviewText = styled.p`
  font-size: 15px;
  color: #747373ff;
  line-height: 1.2;
  margin-bottom: 0px;
  width: 100%;
`;
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$direction === 'left' ? 'left: 0;' : 'right: 0;')}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover:not(:disabled) {
    background: #f8f8f8;
    border-color: #d0d0d0;
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: #333;
    stroke-width: 2;
  }
`;

const ArrowButton2 = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$direction === 'left' ? 'left: 0;' : 'right: 0;')}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover:not(:disabled) {
    background: #f8f8f8;
    border-color: #d0d0d0;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: #333;
    stroke-width: 2;
  }
`;
//////////////////////
const ContainerR = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 20px 0px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #eef9ffff;
  margin-bottom: 30px;
  width: 100%;
`;

const HeaderR = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const TitleR = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 10px 0px 0px 10px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  color: ${(props) => (props.active ? '#000' : '#999')};
  font-weight: ${(props) => (props.active ? '500' : '400')};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #000;
  }
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 10px;
  padding: 0 20px;
`;

const PodiumItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Crown = styled.div`
  position: absolute;
  top: -30px;
  font-size: 24px;
`;

const AvatarWrapperR = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${(props) => props.bg || '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 8px;
  border: 3px solid
    ${(props) => (props.rank === 1 ? '#FFD700' : props.rank === 2 ? '#C0C0C0' : '#CD7F32')};
`;

const RankBadge = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: ${(props) =>
    props.rank === 1 ? '#FFD700' : props.rank === 2 ? '#C0C0C0' : '#CD7F32'};
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid white;
`;

const Username = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Score = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin-bottom: 2px;
`;

const ScoreLabel = styled.div`
  font-size: 12px;
  color: #999;
`;

const Pedestal = styled.div`
  width: 100px;
  height: ${(props) => props.height}px;
  background: linear-gradient(to bottom, #f5f5f5, #e0e0e0);
  border-radius: 8px 8px 0 0;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #999;
`;
// const Container2 = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 20px;
//   background: linear-gradient(135deg, #4a9fe5 0%, #5bc5ba 100%);
//   min-height: 200px;
// `;

const CTASection = styled.div`
  width: 80%;
  margin: 0 auto;
  background: linear-gradient(135deg, #4a90e2 0%, #50c9c3 50%, #3b8b7a 100%);
  border-radius: 24px;
  padding: 80px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -5%;
    width: 500px;
    height: 500px;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 60px 30px;
  }
`;
const Content = styled.div`
  position: relative;
  z-index: 1;
`;
const SubText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
  font-weight: 400;
`;
const MainText = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin-bottom: 48px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 36px;
  }
`;

const ButtonGroup2 = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
`;
const PrimaryButton2 = styled(Button)`
  background: white;
  color: #4a9fe5;
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;
const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: #4a9fe5;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  ${PrimaryButton}:hover & {
    transform: translateX(4px);
  }

  svg {
    width: 14px;
    height: 14px;
    stroke: white;
    stroke-width: 2.5;
  }
`;
const cardData = [
  {
    id: 1,
    title: '백엔드 신입 질문셋 제공드립니다.',
    reviews: [
      { text: '면접 질문이 정말 실전에 도움이 되었어요!' },
      { text: '기술 면접 준비하는데 큰 도움이 되었습니다.' },
      { text: '덕분에 자신감 있게 면접 봤어요.' },
    ],
  },
  {
    id: 2,
    title: '디자인분야 인성면접 단골질문',
    reviews: [
      { text: '경력직 면접 준비에 최적화된 질문들이에요.' },
      { text: '실무 경험과 연결되는 질문들이 인상적입니다!' },
      { text: '면접관 입장을 이해하는데 도움이 되었어요~' },
    ],
  },
  {
    id: 3,
    title: '신입 프론트 기술면접목록',
    reviews: [
      { text: '프론트엔드 기초부터 잘 정리되어 있어요.' },
      { text: '실제 면접에서 비슷한 질문이 많이 나왔습니다!' },
      { text: '덕분에 합격했어요. 감사합니다!' },
    ],
  },
  {
    id: 4,
    title: '프론트 경력 질문셋',
    reviews: [
      { text: '경력 면접 특유의 깊이 있는 질문들이 좋았어요.' },
      { text: '실무 경험을 효과적으로 어필하는 방법을 배웠습니다.' },
      { text: '면접 준비 시간을 크게 단축할 수 있었어요.' },
    ],
  },
  {
    id: 5,
    title: '개발자 질문',
    reviews: [
      { text: '전반적인 개발자 역량을 점검할 수 있어서 좋았어요.' },
      { text: '다양한 직무에 대비할 수 있는 질문들이 유용했습니다.' },
      { text: '체계적으로 준비할 수 있게 도와주셔 감사해요.' },
    ],
  },
];

const cards = [
  {
    id: 1,
    bgColor: '#d4f4e7',
    avatar: '👩🏻',
    title: '혼자 연습하려니까 번거롭고 힘들어요.',
    description:
      '질문을 일일이 정리하고 답변을 관리하는 것도 벅찬데, 실전처럼 환경을 갖추는 것도 어려워요. 이렇게 준비하는 게 맞는지 모르겠어요.',
  },
  {
    id: 2,
    bgColor: '#e8e5f5',
    avatar: '👨🏻',
    title: '효율적으로 면접 준비하는 방법을 모르겠어요.',
    description:
      '이번이 첫 면접인데, 무엇부터 준비해야 할지 막막해요. 다른 사람들은 어떻게 준비하는지 궁금해요.',
  },
  {
    id: 3,
    bgColor: '#ffd4d4',
    avatar: '👨🏻‍🦱',
    title: '제 답변, 이대로 괜찮은 걸까요?',
    description:
      '저 혼자 준비한 답변이 면접관 입장에서 어떻게 들릴지, 다른 사람들에게 피드백을 받고 싶어요.',
  },
];
const mockData = {
  friends: [
    { id: 1, username: '정윤서', score: 38, avatar: '👩‍🏫', rank: 2 },
    { id: 2, username: '박하은', score: 58, avatar: '👩‍💻', rank: 1 },
    { id: 3, username: '최준호', score: 32, avatar: '🧑‍⚖️', rank: 3 },
  ],
  world: [
    { id: 1, username: '이도현', score: 91, avatar: '👨‍💻', rank: 2 },
    { id: 2, username: '김민준', score: 123, avatar: '👨‍💼', rank: 1 },
    { id: 3, username: '김서연', score: 78, avatar: '👩‍💼', rank: 3 },
  ],
};
