import { countPost, myPostAll } from '@api/postAPIS';
import { Overlay, Content, Title } from '@components/common/Dialog';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';
import { QASetCardSkeleton } from '@components/qaset/SkeletonCard';
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

// 탭 정의
const TABS = {
  ALL: '전체',
  MINE: '내가 만든 노트',
  BOOKMARKED: '스크랩한 노트',
};

export default function MyQAListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [myQaList, setMyQaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    myPostAll()
      .then((resp) => {
        setMyQaList(resp?.data ?? null);
        setActiveTab(TABS.ALL);
      })
      .catch(setMyQaList([]))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 💡 탭에 따라 목록 필터링
  const filteredList = useMemo(() => {
    switch (activeTab) {
      case TABS.MINE:
        // OTHER_WRITER가 null이거나 undefined인 경우 (내가 만든 글)
        return myQaList?.filter((item) => !item.otherWriter);
      case TABS.BOOKMARKED:
        // OTHER_WRITER 값이 있는 경우 (가져온 글)
        return myQaList?.filter((item) => !!item.otherWriter);
      case TABS.ALL:
      default:
        return myQaList;
    }
  }, [activeTab]); // activeTab이 변경될 때만 재계산

  const handleAddClick = () => {
    countPost()
      .then((response) => {
        const { count, payments } = response?.data || {};
        const isPaidUser = payments;
        const maxNoteCount = isPaidUser ? 21 : 9;

        if (count >= maxNoteCount) {
          const userType = isPaidUser ? '플러스' : '일반';
          setModalContent(
            <>
              <Typography
                size={3}
                color='gray.11'
                style={{ marginBottom: '24px', lineHeight: 1.5 }}
              >
                {`${userType} 회원은 면접 노트를 최대 ${maxNoteCount}개까지 작성할 수 있습니다.`}
                <br />
                {`(현재 ${count}개 보유 중)`}
              </Typography>
              {!isPaidUser && (
                <PaymentButton onClick={() => navigate('/payment')}>
                  플러스 회원이 되어보세요! ✨
                </PaymentButton>
              )}
            </>,
          );
          setIsModalOpen(true);
        } else {
          navigate('/qa/create');
        }
      })
      .catch((error) => {
        console.error('노트 개수 확인 실패: ', error);
      });
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        {/* 1. 페이지 헤더 (제목 + 추가하기 버튼) */}
        <MyPageHeader>
          <Typography as='h1' size={7} weight='bold'>
            나의 면접 노트 목록
          </Typography>
          <AddButton onClick={handleAddClick}>
            <PlusIcon width={20} height={20} />
            신규 노트
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
        {isLoading ? (
          <SkeletonGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <QASetCardSkeleton key={index} />
            ))}
          </SkeletonGrid>
        ) : (
          <QASetList qaList={filteredList} />
        )}
      </MainContentWrapper>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Overlay />
          <Content>
            <Title>알림</Title>
            {modalContent}
            <ModalCloseButton onClick={() => setIsModalOpen(false)}>확인</ModalCloseButton>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PageContainer>
  );
}

// --- 페이지 스타일 정의 ---

const MainContentWrapper = styled.div`
  width: 100%;
  min-width: 700px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[5]};
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
  padding-left: ${({ theme }) => theme.space[6]};
  padding-right: ${({ theme }) => theme.space[6]};
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
  width: 95%;
  margin: 0 auto;
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

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary[9]};
      font-weight: ${theme.font.weight.bold};

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
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  width: 95%;
  margin: 0 auto;
`;
const ModalCloseButton = styled.button`
  all: unset;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[6]};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
`;

const PaymentButton = styled.button`
  all: unset;
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[3]} 0;
  background-color: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[11]};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[4]};
  }
`;
