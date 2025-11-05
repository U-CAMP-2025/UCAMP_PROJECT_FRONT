import { bookmark, practice } from '@api/rankAPIS';
import Typography from '@components/common/Typography';
import { Header } from '@components/layout/Header';
import RankingTable from '@components/rank/RankList';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
  margin-bottom: ${({ theme }) => theme.space[6]};
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

const TABS = {
  PRACTICE: '연습횟수',
  BOOKMARKS: '북마크수',
};

const MonthlyRanking = () => {
  // ✅ 기본값을 "연습횟수"로 설정
  const [activeTab, setActiveTab] = useState(TABS.PRACTICE);
  const [myQaList, setMyQaList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🛑 수정 완료: 함수 이름만 참조로 할당합니다.
        const apiFunction = activeTab === TABS.BOOKMARKS ? bookmark : practice; // 이제 apiFunction은 함수이므로, await apiFunction()으로 실행할 수 있습니다.
        const resp = await apiFunction(); // 데이터 추출 로직도 이전 답변에서 안내한 안전한 방식으로 유지합니다.
        let rankingData = [];
        if (Array.isArray(resp)) {
          rankingData = resp;
        } else if (resp && Array.isArray(resp.data)) {
          rankingData = resp.data;
        }
        setMyQaList(rankingData);
      } catch (e) {
        console.error('API 호출 에러:', e);
        setMyQaList([]);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <>
      <Header />
      <Container>
        <Header1>
          <Title>주간 랭킹</Title>
          <SubHeader>
            <Typography size={3} style={{ fontWeight: 500 }}>
              정렬 방법
            </Typography>
            <DateSelector defaultValue='thisweek'>
              <option value='thisweek'>이번주</option>
              <option value='lastweek'>저번주</option>
            </DateSelector>
          </SubHeader>
        </Header1>

        {/* 탭 */}
        <TabContainer>
          {Object.values(TABS).map((tabName) => (
            <TabButton
              key={tabName}
              $isActive={activeTab === tabName}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName}
            </TabButton>
          ))}
        </TabContainer>

        {/* 탭별 테이블 표시 */}
        {activeTab === TABS.PRACTICE && <RankingTable data={myQaList} type='practice' />}
        {activeTab === TABS.BOOKMARKS && <RankingTable data={myQaList} type='bookmark' />}
      </Container>
    </>
  );
};

export default MonthlyRanking;
