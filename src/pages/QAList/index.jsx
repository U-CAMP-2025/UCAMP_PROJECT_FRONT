// 💡 새로운 컴포넌트 임포트
import { JobSelector } from '@components/common/JobSelector';
import { SortSelector } from '@components/common/SortSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

// --- 페이지 스타일 정의 ---

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

const qaList = [
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
  const [currentSort, setCurrentSort] = useState('bookcount_asc');

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    console.log('정렬 방식 변경:', newSort);
  };

  const sortedQAList = useMemo(() => {
    const sorted = [...qaList];

    switch (currentSort) {
      case 'bookcount_asc':
        return sorted.sort((a, b) => b.bookCount - a.bookCount);

      case 'review_desc':
        return sorted.sort((a, b) => b.review - a.review);

      case 'latest_desc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createAt.replace(/\./g, '-'));
          const dateB = new Date(b.createAt.replace(/\./g, '-'));
          return dateB - dateA;
        });

      default:
        return sorted;
    }
  }, [currentSort]); // currentSort가 바뀔 때만 재계산

  return (
    <PageContainer header footer>
      <MainContentWrapper>
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

        <QASetList qaList={sortedQAList} />
      </MainContentWrapper>

      <div style={{ textAlign: 'center', padding: '20px' }}></div>
    </PageContainer>
  );
}
