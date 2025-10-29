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

const ALL_JOBS_MAP = new Map([
  ['web', '웹개발'],
  ['fe', '프론트엔드 개발'],
  ['be', '백엔드 개발'],
  ['data', '데이터 분석'],
  ['ml', '머신러닝'],
  ['qa', 'QA 엔지니어'],
  ['devops', 'DevOps'],
]);

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
