import { bookmark, practice } from '@api/rankAPIS';
import { Footer } from '@components/layout/Footer';
// removed unused imports
import { Header } from '@components/layout/Header';
import { RankCardSkeleton } from '@components/qaset/SkeletonRankCard';
import RankingTable from '@components/rank/RankList';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 80vh;
`;
const Header1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => theme.space[4]};
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;
const SubHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
`;
const DateSelector = styled.select`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
`;
const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;
const TabButton = styled.button`
  all: unset;
  font-size: ${({ theme }) => theme.font.size[4]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.space[3]} 0;
  cursor: pointer;
  position: relative;

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary[9]};
      font-weight: ${theme.font.weight.bold};
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: ${theme.colors.primary[9]};
      }
    `}
`;
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  width: 95%;
  margin: 0 auto;
`;
// 탭 아래 회색 안내문 추가
const NoticeText = styled.p`
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[9]};
  text-align: right;
`;
const TABS = {
  WEEKPRACTICE: '주간 연습 횟수',
  MONTHPRACTICE: '월간 연습 횟수',
  BOOKMARKS: '스크랩 수',
};

const RankPage = () => {
  // 기본 탭을 주간 연습으로 설정
  const [activeTab, setActiveTab] = useState(TABS.WEEKPRACTICE);
  const [dateRange, setDateRange] = useState('thisweek');
  const [RankList, setRankList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let resp;
        if (activeTab === TABS.WEEKPRACTICE || activeTab === TABS.MONTHPRACTICE) {
          // 둘 다 practice API 사용, period 파라미터로 기간 전달
          resp = await practice({ period: dateRange });
        } else {
          resp = await bookmark();
        }
        let rankingData = [];
        if (Array.isArray(resp)) {
          rankingData = resp;
        } else if (resp && Array.isArray(resp.data)) {
          rankingData = resp.data;
        }
        // API 응답 데이터를 상위 10개만 잘라서 상태에 저장합니다.
        setRankList(rankingData.slice(0, 10));
      } catch (e) {
        console.error('API 호출 에러:', e);
        setRankList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, dateRange]);

  return (
    <>
      <Header />
      <Container>
        {/* 탭 */}
        <TabContainer>
          {Object.values(TABS).map((tabName) => (
            <TabButton
              key={tabName}
              $isActive={activeTab === tabName}
              onClick={() => {
                // 탭 유형에 따라 activeTab 설정
                setActiveTab(tabName);
                // 주간/월간 연습 탭이면 period도 함께 설정해서 백엔드로 전달
                if (tabName === TABS.WEEKPRACTICE) setDateRange('thisweek');
                else if (tabName === TABS.MONTHPRACTICE) setDateRange('thismonth');
              }}
            >
              {tabName}
            </TabButton>
          ))}
        </TabContainer>

        {/* 탭별 테이블 표시 */}
        {isLoading ? (
          <SkeletonGrid>
            {/* RankCardSkeleton already renders 6 skeleton rows to mimic the table */}
            <RankCardSkeleton />
          </SkeletonGrid>
        ) : (
          <>
            {activeTab === TABS.WEEKPRACTICE && (
              <RankingTable data={RankList} type='practice' value={dateRange} />
            )}
            {activeTab === TABS.MONTHPRACTICE && (
              <RankingTable data={RankList} type='practice' value={dateRange} />
            )}
            {activeTab === TABS.BOOKMARKS && <RankingTable data={RankList} type='bookmark' />}
          </>
        )}
        <NoticeText>※ 동일 순위의 경우 먼저 등록된 유저가 상위에 표시됩니다.</NoticeText>
      </Container>

      <Footer />
    </>
  );
};

export default RankPage;
