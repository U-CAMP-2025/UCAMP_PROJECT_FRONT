import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import { myQaList } from '@pages/List/MyQaList';
import { PlusIcon } from '@radix-ui/react-icons';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

// 💡 추가하기 버튼용

// --- 페이지 스타일 정의 ---

// QAListPage의 MainContentWrapper 재사용
const MainContentWrapper = styled.div`
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]}; /* 상하 32px, 좌우 24px */
  min-height: 80vh;
`;

// 페이지 상단 헤더 (제목 + 추가하기 버튼)
const MyPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

const AddButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]}; /* 12px 16px */
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
`;

// 탭 네비게이션
const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[5]}; /* 20px */
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const TabButton = styled.button`
  all: unset;
  font-size: ${({ theme }) => theme.font.size[4]}; /* 18px */
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.space[3]} 0; /* 12px 0 */
  cursor: pointer;
  position: relative;

  /* 활성 탭 스타일 */
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary[9]};
      font-weight: ${theme.font.weight.bold};

      /* 하단 보라색 밑줄 */
      &::after {
        content: '';
        position: absolute;
        bottom: -1px; /* 부모의 border-bottom을 덮도록 */
        left: 0;
        right: 0;
        height: 3px;
        background-color: ${theme.colors.primary[9]};
      }
    `}
`;

// 탭 정의
const TABS = {
  ALL: '전체',
  MINE: '내가 만든 질문답변',
  BOOKMARKED: '가져온 질문답변',
};

export default function MyQAListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.ALL);

  // 💡 탭에 따라 목록 필터링
  const filteredList = useMemo(() => {
    switch (activeTab) {
      case TABS.MINE:
        // OTHER_WRITER가 null이거나 undefined인 경우 (내가 만든 글)
        return myQaList.filter((item) => !item.OTHER_WRITER);
      case TABS.BOOKMARKED:
        // OTHER_WRITER 값이 있는 경우 (가져온 글)
        return myQaList.filter((item) => !!item.OTHER_WRITER);
      case TABS.ALL:
      default:
        return myQaList;
    }
  }, [activeTab]); // activeTab이 변경될 때만 재계산

  const handleAddClick = () => {
    // 질문답변 생성 페이지로 이동 (경로 수정 필요)
    navigate('/qa/create');
  };

  return (
    <PageContainer header footer>
      {' '}
      <MainContentWrapper>
        {/* 1. 페이지 헤더 (제목 + 추가하기 버튼) */}
        <MyPageHeader>
          <Typography as='h1' size={7} weight='bold'>
            나의 질문답변 목록
          </Typography>
          <AddButton onClick={handleAddClick}>
            <PlusIcon width={20} height={20} />
            추가하기
          </AddButton>
        </MyPageHeader>
        {/* 2. 탭 네비게이션 */}
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
        {/* 3. 질문 답변 카드 목록 (필터링된 리스트 전달) */}
        <QASetList qaList={filteredList} />{' '}
      </MainContentWrapper>{' '}
    </PageContainer>
  );
}
