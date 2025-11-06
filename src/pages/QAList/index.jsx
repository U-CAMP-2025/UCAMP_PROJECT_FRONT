import { fetchJobList } from '@api/jobAPIS';
import { scrollQaSet } from '@api/postAPIS';
import { fetchUserMypage } from '@api/userAPIS';
import { fetchUserStatus, patchUserStaus } from '@api/userAPIS';
import { JobSelector } from '@components/common/JobSelector';
import { SortSelector } from '@components/common/SortSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import { QASetCardSkeleton } from '@components/qaset/SkeletonCard';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Joyride from 'react-joyride';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function QAListPage() {
  const { isLogin } = useAuthStore();
  const [currentSort, setCurrentSort] = useState('bookcount_desc');
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const navigate = useNavigate();

  // ========================== 면접노트 가이드투어 ============================
  const [runQAListTour, setRunQAListTour] = useState(false);

  const qaListTourSteps = [
    {
      target: '#tour-add-note-button',
      content: (
        <>
          <b style={{ fontSize: '20px' }}>신규 노트</b>
          <br />
          <br />
          이 버튼을 눌러 나만의 면접 노트를
          <br />
          만들 수 있습니다.
        </>
      ),
      placement: 'bottom-end',
      disableBeacon: true,
    },
  ];

  useEffect(() => {
    if (isLogin) {
      fetchUserMypage().then((res) => {
        setYourJob(res?.job?.jobId || null);
      });

      // 튜토리얼 진행 조건
      fetchUserStatus().then((res) => {
        // 상태 'NEW' && 헤더 튜토리얼 봤음
        if (res?.status === 'NEW' && localStorage.getItem('seenHeaderTour') === 'true') {
          // '신규 노트' 버튼이 렌더링될 시간
          setTimeout(() => {
            setRunQAListTour(true);
          }, 500);
        }
      });
    }
  }, [isLogin]);

  const handleQAListJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status) || action === 'close') {
      setRunQAListTour(false);

      patchUserStaus('ACTIVE')
        .then(() => {
          console.log("QAList 튜토리얼 완료: 유저 상태 'ACTIVE' 업데이트");
          localStorage.removeItem('seenHeaderTour');
        })
        .catch((err) => {
          console.error('유저 상태 업데이트 실패:', err);
        });
    }
  };

  // ========================== 가이드투어 끝 =============================

  // 무한 스크롤 상태
  const [displayList, setDisplayList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [yourJob, setYourJob] = useState(null);
  const ITEMS_PER_PAGE = 9;

  // 정렬 변경
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    setPage(1);
    setDisplayList([]);
    setHasMore(true);
    setIsInitialLoading(true);
  };

  // 직무 필터 변경
  const handleJobChange = (newJobIds) => {
    setSelectedJobIds(newJobIds);
    setPage(1);
    setDisplayList([]);
    setHasMore(true);
    setIsInitialLoading(true);
  };

  const handleAddClick = () => {
    navigate('/qa/create');
  };

  // 초기 직무 데이터 로드
  // useEffect(() => {
  //   if (isLogin) {
  //     fetchUserMypage().then((res) => {
  //       setYourJob(res?.job?.jobId || null);
  //     });
  //   }
  // }, []);

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
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
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
            면접 노트
          </Typography>
          {isLogin && (
            <AddButton onClick={handleAddClick} id='tour-add-note-button'>
              <PlusIcon width={20} height={20} />
              신규 노트
            </AddButton>
          )}
        </QaListHeader>
        <FilterAndSortBar>
          <FilterSection>
            <JobSelector value={selectedJobIds} onChange={handleJobChange} yourJobId={yourJob} />
          </FilterSection>
          <SortSection>
            <Typography size={3} style={{ fontWeight: 500, color: 'inherit' }}>
              정렬 방법
            </Typography>
            <SortSelector currentSort={currentSort} onSortChange={handleSortChange} />
          </SortSection>
        </FilterAndSortBar>
        {isInitialLoading ? (
          <SkeletonGrid>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <QASetCardSkeleton key={index} />
            ))}
          </SkeletonGrid>
        ) : (
          <InfiniteScroll
            dataLength={displayList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <SkeletonGrid>
                {Array.from({ length: 3 }).map((_, index) => (
                  <QASetCardSkeleton key={index} />
                ))}
              </SkeletonGrid>
            }
          >
            <QASetList qaList={displayList} />
          </InfiniteScroll>
        )}
      </MainContentWrapper>
      <Joyride
        steps={qaListTourSteps}
        run={runQAListTour}
        callback={handleQAListJoyrideCallback}
        continuous={true}
        showProgress={false}
        showSkipButton={false}
        locale={{
          next: '다음',
          back: '이전',
          skip: '건너뛰기',
          last: '확인',
        }}
        styles={{
          options: {
            primaryColor: theme.colors.primary[9],
            textColor: theme.colors.gray[12],
            backgroundColor: theme.colors.gray[1],
            arrowColor: theme.colors.gray[1],
          },
        }}
      />
    </PageContainer>
  );
}

// --- 페이지 스타일 정의 ---

const FilterAndSortBar = styled.div`
  width: 95%;
  margin: 0 auto;
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
  padding-left: ${({ theme }) => theme.space[6]};
  padding-right: ${({ theme }) => theme.space[6]};
`;

// 💡 MainContentWrapper에 좌우 패딩을 추가하여 중앙 정렬된 콘텐츠 영역을 정의합니다.
const MainContentWrapper = styled.div`
  width: 100%;
  min-width: 700px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
  min-height: 80vh;
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

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  width: 95%;
  margin: 0 auto;
`;
