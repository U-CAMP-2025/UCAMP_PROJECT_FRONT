import { fetchUserStatus } from '@api/userAPIS';
import * as L from '@components/common/LandingStyles';
import { PageContainer } from '@components/layout/PageContainer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';
import styled from 'styled-components';

export default function LandingPage() {
  const { isLogin } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  const maxIndex = Math.max(0, L.cardData.length - cardsPerView);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useNavigate();
  // 1️⃣ SECTION_IDS에 plan-section 추가
  const SECTION_IDS = [
    'problem-section',
    'video-section',
    'ranking-section',
    'ranking-section2',
    'plan-section',
    'cta-section',
    'hero-section',
  ];

  const [nextSectionIdx, setNextSectionIdx] = useState(0);

  const handleScrollDown = () => {
    const targetId = SECTION_IDS[nextSectionIdx];

    scroller.scrollTo(targetId, {
      duration: 800, // 스크롤 지속 시간 (ms)
      delay: 0,
      smooth: 'easeInOutQuart', // 부드러운 스크롤 효과
      offset: -80, // 헤더 높이만큼 오프셋 조정 (필요시 변경)
    });

    // 다음 섹션 인덱스로 업데이트 (마지막 섹션 도달 시 다시 처음(Hero)으로 돌아가게 설정함)
    setNextSectionIdx((prev) => (prev + 1) % SECTION_IDS.length);
  };

  const currentData = L.mockData[activeTab];
  const sortedData = [...currentData].sort((a, b) => b.score - a.score);

  // 포디움 배치 순서: 2등(왼쪽), 1등(가운데), 3등(오른쪽)
  const podiumOrder = [
    sortedData[1], // 2nd
    sortedData[0], // 1st
    sortedData[2], // 3rd
  ];

  const handleClickLoginButton = () => {
    if (isLogin) {
      navigate('/myqa');
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  useEffect(() => {
    if (isLogin) {
      fetchUserStatus().then((response) => {
        console.log(response);
      });
    }
  }, [isLogin]);

  const containerRef = useRef(null);
  const [cardWidthPx, setCardWidthPx] = useState(0);
  const cardGap = 24;

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
      <PageContainer header footer>
        <Wrapper>
          {' '}
          {/* Hero Section */}
          <L.HeroContainer id='hero-section'>
            <L.BackgroundBlur />
            <L.ContentWrapper>
              <L.MainHeading2>면접톡!</L.MainHeading2>

              <L.Description>
                혼자 하는 면접 준비는 이제 그만! 👋 <br />
                함께 성장하는 면접 커뮤니티
              </L.Description>
              <L.ButtonGroup>
                <L.PrimaryButton onClick={handleClickLoginButton}>
                  1분 만에 시작하기 🚀
                </L.PrimaryButton>
                <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
              </L.ButtonGroup>
            </L.ContentWrapper>

            <L.CardsWrapper>
              <L.Card as={L.Card2}>
                <L.CardIcon>📝</L.CardIcon>
                <L.CardTitle>AI 면접 분석</L.CardTitle>
                <L.CardDescription>
                  내 답변을 분석하고 <br />
                  완벽한 피드백까지!
                </L.CardDescription>
              </L.Card>
              <L.Card as={L.Card1}>
                <L.CardIcon>💼</L.CardIcon>
                <L.CardTitle>합격 전략 공유</L.CardTitle>
                <L.CardDescription>
                  다른 사람들의 면접 준비 방법,
                  <br />
                  면접 노트로 확인하세요.
                </L.CardDescription>
              </L.Card>
              <L.Card as={L.Card3}>
                <L.CardIcon>🎯</L.CardIcon>
                <L.CardTitle>실전 모의 면접</L.CardTitle>
                <L.CardDescription>
                  떨지 않고 완벽하게,
                  <br />
                  AI 면접관과 실전 연습!
                </L.CardDescription>
              </L.Card>
            </L.CardsWrapper>
          </L.HeroContainer>
          {/* Problem & Solution Section */}
          <L.SectionContainer id='problem-section'>
            <L.SectionTitle>면접 준비, 이런 고민 해보셨죠? 🤯</L.SectionTitle>
            <L.CardsGrid>
              {L.cards.map((card, index) => (
                <L.ProblemCard
                  key={card.id}
                  bgColor={card.bgColor}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <L.AvatarWrapper2>{card.avatar}</L.AvatarWrapper2>
                  <L.CardTitle2>{card.title}</L.CardTitle2>
                  <L.CardDescription2>{card.description}</L.CardDescription2>
                </L.ProblemCard>
              ))}
            </L.CardsGrid>
          </L.SectionContainer>
          <L.SectionTitle id='video-section'>면접톡과 함께 준비해보세요!</L.SectionTitle>
          <L.VideoWrapper>
            <iframe
              src='https://www.youtube.com/embed/2MJbpywFSX0'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </L.VideoWrapper>
          {/* Social Proof & Ranking Section */}
          <L.SectionContainer $bgColor='#f8f9fd' id='ranking-section'>
            <L.SectionTitle>이미 많은 분들이 함께하고 있어요! 🔥</L.SectionTitle>

            {/* Review Slider */}
            <L.SliderWrapper>
              <L.ArrowButton $direction='left' onClick={handlePrev} disabled={currentIndex === 0}>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M15 18l-6-6 6-6' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </L.ArrowButton>

              <L.CardContainer2 ref={containerRef}>
                <L.Track $translatePx={offsetPx} $gap={cardGap}>
                  {L.cardData.map((card) => (
                    <L.ReviewCardWrapper
                      key={card.id}
                      style={{ minWidth: cardWidthPx ? `${cardWidthPx}px` : undefined }}
                    >
                      <L.ReviewCard>
                        <L.ReviewTitle>{card.title}</L.ReviewTitle>
                        <L.ReviewList>
                          {card.reviews.map((review, idx) => (
                            <L.ReviewItem key={idx}>
                              <span>💬</span> <L.ReviewText>{review.text}</L.ReviewText>
                            </L.ReviewItem>
                          ))}
                        </L.ReviewList>
                      </L.ReviewCard>
                    </L.ReviewCardWrapper>
                  ))}
                </L.Track>
              </L.CardContainer2>

              <L.ArrowButton
                $direction='right'
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M9 18l6-6-6-6' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </L.ArrowButton>
            </L.SliderWrapper>

            {/* Ranking Podium */}
            <L.CompetitionTitle id='ranking-section2'>
              다른 유저들과 선의의 경쟁을 펼쳐보세요 🏆
            </L.CompetitionTitle>
            <L.RankingContainer>
              <L.RankingHeader>
                <L.RankingSubTitle>이번 주 명예의 전당</L.RankingSubTitle>
                <L.Tabs>
                  <L.Tab active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                    🔥 연습 횟수순
                  </L.Tab>
                  <L.Tab active={activeTab === 'world'} onClick={() => setActiveTab('world')}>
                    📚 스크랩순
                  </L.Tab>
                </L.Tabs>
              </L.RankingHeader>

              <L.PodiumContainer>
                {podiumOrder.map((user, index) => {
                  const actualRank = user.rank;
                  // 포디움 높이: 2등(index 0), 1등(index 1), 3등(index 2)
                  const pedestalHeights = [100, 140, 70];
                  const delay = [0.2, 0, 0.4];

                  return (
                    <L.PodiumItem key={user.id} style={{ animationDelay: `${delay[index]}s` }}>
                      {actualRank === 1 && <L.Crown>👑</L.Crown>}
                      <L.AvatarWrapper rank={actualRank}>
                        <L.Avatar>{user.avatar}</L.Avatar>
                        <L.RankBadge rank={actualRank}>{actualRank}</L.RankBadge>
                      </L.AvatarWrapper>
                      <L.Username>{user.username}</L.Username>
                      <L.Score>{user.score.toLocaleString()}회</L.Score>
                      <L.Pedestal height={pedestalHeights[index]} rank={actualRank} />
                    </L.PodiumItem>
                  );
                })}
              </L.PodiumContainer>
            </L.RankingContainer>
          </L.SectionContainer>
          {/* ====== 플러스 이용권 소개 섹션 ====== */}
          <PlansIntroSection id='plan-section'>
            <PlansTitle>더 많은 기능이 필요하신가요?</PlansTitle>
            <PlansRow>
              <PlanCard>
                <PlanName>일반 회원</PlanName>
                <PlanDesc>기본 제공 기능</PlanDesc>
                <PlanList>
                  <li>면접 노트 9개 저장</li>
                  <li>면접 연습 일 3회</li>
                  <li>스크랩 노트 조회만 가능</li>
                </PlanList>
                <PlanPrice>무료</PlanPrice>
              </PlanCard>

              <PlanCard $plus>
                <PlanName>플러스 회원</PlanName>
                <PlanDesc>더 많은 연습과 저장공간</PlanDesc>
                <PlanList>
                  <li>면접 노트 21개 저장</li>
                  <li>면접 연습 무제한</li>
                  <li>스크랩 노트 수정 가능</li>
                  <li>AI 피드백 + 음성결과 수정</li>
                </PlanList>
                <PlanPrice>₩5,900 / 월</PlanPrice>
                <PlanButton
                  onClick={() => {
                    if (isLogin) navigate('/payment');
                    else setLoginDialogOpen(true);
                  }}
                >
                  플러스 이용권 결제하기
                </PlanButton>
              </PlanCard>
            </PlansRow>
          </PlansIntroSection>
          {/* CTA Section */}
          <L.CTAContainer id='cta-section'>
            <L.CTAContent>
              <L.SubText>면접 합격, 혼자가 아니라면 더 쉬워집니다.</L.SubText>
              <L.MainText>
                합격으로 가는 가장 빠른 길,
                <br /> 면접톡과 시작하세요!
              </L.MainText>
              <L.CTAButtonGroup>
                <L.PrimaryButton2 onClick={handleClickLoginButton}>
                  지금 바로 시작하기
                  <L.ArrowIcon>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3'>
                      <path
                        d='M5 12h14M12 5l7 7-7 7'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </L.ArrowIcon>
                </L.PrimaryButton2>
              </L.CTAButtonGroup>
            </L.CTAContent>
          </L.CTAContainer>
        </Wrapper>
      </PageContainer>
      <L.FloatingScrollButton onClick={handleScrollDown} aria-label='다음 섹션으로 이동'>
        <ChevronDownIcon width={30} height={30} />
      </L.FloatingScrollButton>
    </>
  );
}

const Wrapper = styled.div`
  min-width: 1148px;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlansIntroSection = styled.section`
  width: 100%;
  padding: 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent; /* 배경색 제거 */
`;

const PlansTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size[6]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[12]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const PlansRow = styled.div`
  width: 100%;
  max-width: 1000px; /* Hero보다 살짝 좁은 폭 */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space[6]};
`;

const PlanCard = styled.div`
  flex: 1 1 320px;
  max-width: 460px;
  background: #fff;
  border: 1px solid
    ${({ $plus, theme }) => ($plus ? theme.colors.primary[5] : theme.colors.gray[4])};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  ${({ $plus, theme }) =>
    $plus &&
    `
    border-color: ${theme.colors.primary[8]};
    background: linear-gradient(180deg, ${theme.colors.primary[1]}, #ffffff);
  `}
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.font.size[5]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[12]};
`;

const PlanDesc = styled.p`
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PlanList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
  line-height: 1.6;

  li {
    margin-bottom: 6px;
    display: flex;
    align-items: flex-start;
    gap: 6px;

    &::before {
      content: '•';
      color: ${({ theme }) => theme.colors.primary[9]};
      font-weight: bold;
    }
  }
`;

const PlanPrice = styled.div`
  margin-top: auto;
  font-size: ${({ theme }) => theme.font.size[4]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary[9]};
`;

const PlanButton = styled.button`
  margin-top: ${({ theme }) => theme.space[3]};
  align-self: stretch;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
`;
