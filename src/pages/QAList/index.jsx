// 💡 새로운 컴포넌트 임포트
import { JobSelector } from '@components/common/JobSelector';
import { SortSelector } from '@components/common/SortSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import React, { useState } from 'react';
import styled from 'styled-components';

// Typography 컴포넌트 임포트 (추가됨)

// --- 페이지 스타일 정의 ---

// 💡 FilterAndSortBar는 이제 MainContentWrapper 내부에서 사용되므로,
// 좌우 패딩을 제거하고 너비 100%를 사용하도록 합니다.
const FilterAndSortBar = styled.div`
  /* 직무 선택과 정렬 드롭다운을 포함하는 상단 바 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* ⚠️ MainContentWrapper가 좌우 패딩을 가질 것이므로, 여기서는 좌우 패딩을 없앱니다. */
  padding: ${({ theme }) => theme.space[4]} 0; /* 상하 16px, 좌우 0 */
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 목록과 분리하기 위한 하단 여백 24px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  background-color: ${({ theme }) => theme.colors.gray[1]}; /* 배경색은 그대로 유지 */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[4]};
  }
`;

const FilterSection = styled.div`
  /* 직무 선택 컴포넌트만 포함 */
  display: flex;
  align-items: center;
  /* flex-grow: 1 제거 */
  min-width: 50%;
`;

const SortSection = styled.div`
  /* 정렬 드롭다운만 포함 */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.gray[11]};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

// 💡 MainContentWrapper에 좌우 패딩을 추가하여 중앙 정렬된 콘텐츠 영역을 정의합니다.
const MainContentWrapper = styled.div`
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 0 ${({ theme }) => theme.space[6]}; /* 상하 0, 좌우 여백 24px */
  min-height: 80vh;
`;

// --- Mock 데이터 (이전에 제공된 데이터 사용) ---
const qaList = [
  // ... (데이터는 동일)
  {
    postId: 1,
    nickname: '댄싱다람쥐',
    job: ['웹개발', '프론트엔드 개발', '백엔드 개발'],
    title: '신입 프론트엔드 면접 질문 모음',
    description: 'React, TypeScript, 상태 관리 관련 질문을 모았습니다.',
    bookCount: 20,
    review: 13,
    createAt: '2025.10.30',
  },
  {
    postId: 2,
    nickname: '개발자K',
    job: ['웹개발', '백엔드 개발'],
    title: 'Java Spring 핵심 질문 50선',
    description: '객체지향과 설계 패턴 위주로 정리했습니다.',
    bookCount: 55,
    review: 5,
    createAt: '2025.10.29',
  },
  {
    postId: 3,
    nickname: 'PM_Joy',
    job: ['데이터 분석'],
    title: '데이터 분석가 필수 역량 면접',
    description: 'SQL 및 통계 관련 면접 준비 자료입니다.',
    bookCount: 10,
    review: 22,
    createAt: '2025.10.28',
  },
];

export default function QAListPage() {
  // 상태 관리 (필터링 및 정렬)
  const [currentSort, setCurrentSort] = useState('latest_desc');

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    console.log('정렬 방식 변경:', newSort);
  };

  return (
    // PageContainer는 Header와 Footer를 포함한다고 가정합니다.
    <PageContainer header footer>
      {/* 💡 필터 바를 MainContentWrapper 안으로 이동하여 중앙 정렬되도록 합니다. */}
      <MainContentWrapper>
        {/* 1. 필터 및 정렬 바 */}
        <FilterAndSortBar>
          <FilterSection>
            <JobSelector />
          </FilterSection>

          <SortSection>
            <Typography size={3} style={{ fontWeight: 500, color: 'inherit' }}>
              정렬 방법
            </Typography>
            <SortSelector currentSort={currentSort} onSortChange={handleSortChange} />
          </SortSection>
        </FilterAndSortBar>

        {/* 2. 질문 답변 카드 목록 */}
        {/* QASetList는 내부에서 좌우 패딩을 가지므로, 여기서는 추가 패딩이 필요 없습니다. */}
        <QASetList qaList={qaList} />
      </MainContentWrapper>

      {/* 3. 무한 스크롤 로딩 표시 영역 (구현 시 필요) */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {/* <Text muted>로딩 중...</Text> */}
      </div>
    </PageContainer>
  );
}
