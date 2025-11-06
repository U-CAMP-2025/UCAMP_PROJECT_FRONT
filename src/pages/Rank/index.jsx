import { bookmark, practice } from '@api/rankAPIS';
import Typography from '@components/common/Typography';
import { Header } from '@components/layout/Header';
import RankingTable from '@components/rank/RankList';
import { date } from '@elevenlabs/elevenlabs-js/core/schemas';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
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
  margin-bottom: ${({ theme }) => theme.space[12]};
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
  WEEKPRACTICE: '주간연습횟수',
  MONTHPRACTICE: '월간연습횟수',
  BOOKMARKS: '북마크수',
};

const MonthlyRanking = () => {
  // 기본 탭을 주간 연습으로 설정
  const [activeTab, setActiveTab] = useState(TABS.WEEKPRACTICE);
  const [dateRange, setDateRange] = useState('thisweek');
  const [RankList, setRankList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, [activeTab, dateRange]);

  return (
    <>
      <Header />
      <Container>
        {/* <Header1>
          <SubHeader>
            {activeTab === TABS.PRACTICE && (
              <>
                <Typography size={3} style={{ fontWeight: 500 }}>
                  정렬 방법
                </Typography>
                <DateSelector value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value='thisweek'>이번주</option>
                  <option value='lastweek'>저번주</option>
                </DateSelector>
              </>
            )}
          </SubHeader>
        </Header1> */}

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
        {activeTab === TABS.WEEKPRACTICE && (
          <RankingTable data={RankList} type='practice' value={dateRange} />
        )}
        {activeTab === TABS.MONTHPRACTICE && (
          <RankingTable data={RankList} type='practice' value={dateRange} />
        )}
        {activeTab === TABS.BOOKMARKS && <RankingTable data={RankList} type='bookmark' />}
      </Container>
    </>
  );
};

export default MonthlyRanking;
