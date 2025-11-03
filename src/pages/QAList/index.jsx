// 💡 새로운 컴포넌트 임포트
import { fetchJobList } from '@api/jobAPIS';
import { scrollQaSet } from '@api/postAPIS';
import { fetchUserMypage } from '@api/userAPIS';
import { JobSelector } from '@components/common/JobSelector';
import { SortSelector } from '@components/common/SortSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import { ALL_JOBS_MAP } from '@pages/List/AllJobsMap';
import { qaList } from '@pages/List/qaList';
import { useAuthStore } from '@store/auth/useAuthStore';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

export default function QAListPage() {
  const { isLogin } = useAuthStore();
  const [currentSort, setCurrentSort] = useState('bookcount_desc');
  const [selectedJobIds, setSelectedJobIds] = useState([99]);

  // 무한 스크롤 상태
  const [displayList, setDisplayList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 9;

  // 정렬 변경
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    setPage(1);
    setDisplayList([]);
    setHasMore(true);
  };

  // 직무 필터 변경
  const handleJobChange = (newJobIds) => {
    setSelectedJobIds(newJobIds);
    setPage(1);
    setDisplayList([]);
    setHasMore(true);
  };

  // 초기 직무 데이터 로드
  useEffect(() => {
    if (isLogin) {
      fetchUserMypage().then((res) => {
        setSelectedJobIds([res?.job?.jobId]);
      });
    }
  }, []);

  // API 호출
  const fetchQAList = async (pageNum = 1) => {
    const params = {
      page: pageNum,
      limit: ITEMS_PER_PAGE,
      sort: currentSort,
      jobs: selectedJobIds,
    };

    console.log(params);

    scrollQaSet(params)
      .then((response) => {
        console.log(response);
        const items = response?.data.content ?? [];

        if (pageNum === 1) {
          setDisplayList(items);
        } else {
          setDisplayList((prev) => [...prev, ...items]);
        }

        if (items.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      })
      .catch();
  };

  // 페이지 변경 시 데이터 호출
  useEffect(() => {
    fetchQAList(page);
  }, [page, currentSort, selectedJobIds]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <QaListHeader>
          <Typography as='h1' size={7} weight='bold'>
            질문답변 둘러보기
          </Typography>
        </QaListHeader>
        <FilterAndSortBar>
          <FilterSection>
            <JobSelector value={selectedJobIds} onChange={handleJobChange} />
          </FilterSection>
          <SortSection>
            <Typography size={3} style={{ fontWeight: 500, color: 'inherit' }}>
              정렬 방법
            </Typography>
            <SortSelector currentSort={currentSort} onSortChange={handleSortChange} />
          </SortSection>
        </FilterAndSortBar>

        <InfiniteScroll
          dataLength={displayList.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
        >
          <QASetList qaList={displayList} />
        </InfiniteScroll>
      </MainContentWrapper>
    </PageContainer>
  );
}

// --- 페이지 스타일 정의 ---

const FilterAndSortBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[4]} 0;
  margin-bottom: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  // background-color: ${({ theme }) => theme.colors.gray[1]};

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

// 페이지 상단 헤더
const QaListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

// 💡 MainContentWrapper에 좌우 패딩을 추가하여 중앙 정렬된 콘텐츠 영역을 정의합니다.
const MainContentWrapper = styled.div`
  width: 100%;
  min-width: 700px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  min-height: 80vh;
`;
