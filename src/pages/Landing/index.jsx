import { fetchUserStatus } from '@api/userAPIS';
import * as L from '@components/common/LandingStyles';
import { Header } from '@components/layout/Header';
import { PageContainer } from '@components/layout/PageContainer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import { useAuthStore } from '@store/auth/useAuthStore';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { isLogin } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  const maxIndex = Math.max(0, L.cardData.length - cardsPerView);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useNavigate();

  const currentData = L.mockData[activeTab];
  // 1등(index 0), 2등(index 1), 3등(index 2) 순으로 정렬
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
      <Header />
      <PageContainer footer>
        {/* Hero Section */}
        <L.HeroContainer>
          <L.BackgroundBlur />
          <L.ContentWrapper>
            <L.MainHeading>
              면접의 광장,
              <L.MainHeading2>면접톡!</L.MainHeading2>
            </L.MainHeading>
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
            <L.Card as={L.Card1}>
              <L.CardIcon>📝</L.CardIcon>
              <L.CardTitle>AI 면접 분석</L.CardTitle>
              <L.CardDescription>
                내 답변을 분석하고 <br />
                완벽한 피드백까지!
              </L.CardDescription>
            </L.Card>
            <L.Card as={L.Card2}>
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
        <L.SectionContainer>
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

        <L.SectionTitle>면접톡과 함께 준비해보세요!</L.SectionTitle>
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
        <L.SectionContainer $bgColor='#f8f9fd'>
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
          {/* 메인 타이틀을 컨테이너 밖으로 배치 */}
          <L.CompetitionTitle>다른 유저들과 선의의 경쟁을 펼쳐보세요 🏆</L.CompetitionTitle>
          <L.RankingContainer>
            <L.RankingHeader>
              <L.RankingSubTitle>이번 주 명예의 전당</L.RankingSubTitle>
              <L.Tabs>
                <L.Tab active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                  🔥 활동순
                </L.Tab>
                <L.Tab active={activeTab === 'world'} onClick={() => setActiveTab('world')}>
                  📚 북마크순
                </L.Tab>
              </L.Tabs>
            </L.RankingHeader>

            <L.PodiumContainer>
              {podiumOrder.map((user, index) => {
                const actualRank = user.rank;
                // 포디움 높이: 2등(index 0), 1등(index 1), 3등(index 2)
                const pedestalHeights = [100, 140, 70];
                const delay = [0.2, 0, 0.4]; // 1등이 가장 먼저 등장하도록 조정 가능

                return (
                  <L.PodiumItem key={user.id} style={{ animationDelay: `${delay[index]}s` }}>
                    {actualRank === 1 && <L.Crown>👑</L.Crown>}
                    <L.AvatarWrapper rank={actualRank}>
                      <L.Avatar>{user.avatar}</L.Avatar>
                      <L.RankBadge rank={actualRank}>{actualRank}</L.RankBadge>
                    </L.AvatarWrapper>
                    <L.Username>{user.username}</L.Username>
                    <L.Score>{user.score.toLocaleString()} P</L.Score>
                    <L.Pedestal height={pedestalHeights[index]} rank={actualRank} />
                  </L.PodiumItem>
                );
              })}
            </L.PodiumContainer>
          </L.RankingContainer>
        </L.SectionContainer>

        {/* CTA Section */}
        <L.CTAContainer>
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
                    <path d='M5 12h14M12 5l7 7-7 7' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </L.ArrowIcon>
              </L.PrimaryButton2>
            </L.CTAButtonGroup>
          </L.CTAContent>
        </L.CTAContainer>
      </PageContainer>
    </>
  );
}
