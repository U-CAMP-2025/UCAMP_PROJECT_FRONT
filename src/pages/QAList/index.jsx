// 💡 새로운 컴포넌트 임포트
import { JobSelector } from '@components/common/JobSelector';
import { SortSelector } from '@components/common/SortSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import { ALL_JOBS_MAP } from '@pages/List/AllJobsMap';
import { qaList } from '@pages/List/qaList';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

// --- 페이지 스타일 정의 ---

const FilterAndSortBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[4]} 0;
  margin-bottom: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  background-color: ${({ theme }) => theme.colors.gray[1]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[4]};
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 50%;
`;

const SortSection = styled.div`
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

export default function QAListPage() {
  const [currentSort, setCurrentSort] = useState('bookcount_asc');

  const [selectedJobIds, setSelectedJobIds] = useState([]);

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    console.log('정렬 방식 변경:', newSort);
  };

  // 💡 2. 필터링과 정렬을 모두 처리하는 useMemo
  const filteredAndSortedList = useMemo(() => {
    // --- 1. 필터링 ---
    let filteredList = [...qaList];
    if (selectedJobIds.length > 0) {
      // 선택된 ID를 직무 이름(string)으로 변환
      const selectedJobNames = selectedJobIds.map((id) => ALL_JOBS_MAP.get(id));

      filteredList = qaList.filter((item) => {
        // item.job 배열에 선택된 직무 이름이 하나라도 포함되어 있는지 확인
        return selectedJobNames.every((jobName) => item.job.includes(jobName));
      });
    }

    // --- 2. 정렬 (필터링된 리스트 기준) ---
    const sorted = [...filteredList];
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
    // 💡 3. currentSort 또는 selectedJobIds가 변경될 때마다 재계산
  }, [currentSort, selectedJobIds]);

  return (
    <PageContainer header footer>
      {' '}
      <MainContentWrapper>
        {' '}
        <FilterAndSortBar>
          {' '}
          <FilterSection>
            <JobSelector value={selectedJobIds} onChange={setSelectedJobIds} />{' '}
          </FilterSection>{' '}
          <SortSection>
            {' '}
            <Typography size={3} style={{ fontWeight: 500, color: 'inherit' }}>
              정렬 방법{' '}
            </Typography>
            <SortSelector currentSort={currentSort} onSortChange={handleSortChange} />{' '}
          </SortSection>{' '}
        </FilterAndSortBar>
        <QASetList qaList={filteredAndSortedList} />{' '}
      </MainContentWrapper>
      <div style={{ textAlign: 'center', padding: '20px' }}></div>{' '}
    </PageContainer>
  );
}
