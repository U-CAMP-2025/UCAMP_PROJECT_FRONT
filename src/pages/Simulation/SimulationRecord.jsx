import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { CheckCircledIcon, UpdateIcon } from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

// --- [Mock 데이터] ---
// Simulation 엔티티와 Post 엔티티 정보를 조합
const mockSimulationRecords = [
  {
    simulationId: 1,
    simulationStatus: 'COMPLETED', // 변환 완료
    post: {
      postId: 1,
      title: '신입 프론트엔드 면접 질문 모음',
      job: ['웹개발', '프론트엔드 개발'],
    },
  },
  {
    simulationId: 2,
    simulationStatus: 'INPROGRESS', // 변환 진행 중
    post: {
      postId: 2,
      title: 'Java Spring 핵심 질문 50선',
      job: ['웹개발', '백엔드 개발'],
    },
  },
  {
    simulationId: 3,
    simulationStatus: 'COMPLETED',
    post: {
      postId: 3,
      title: '데이터 분석가 필수 역량 면접',
      job: ['데이터 분석'],
    },
  },
];

// --- [컴포넌트 로직] ---

export default function SimulationRecordPage() {
  const navigate = useNavigate();

  // TODO: 실제 API를 통해 사용자 ID에 맞는 시뮬레이션 기록을 가져와야 합니다.
  const records = mockSimulationRecords;

  /**
   * 상태에 따라 적절한 컴포넌트(Link 또는 div)와 내용을 반환
   */
  const renderRecordItem = (record) => {
    const isClickable = record.simulationStatus === 'COMPLETED';
    const targetUrl = `/simulation/${record.simulationId}/result`;

    const WrapperComponent = isClickable ? Link : 'div';
    const wrapperProps = {
      to: isClickable ? targetUrl : undefined,
      $isClickable: isClickable, // styled-component prop
    };

    return (
      <RecordItemBase as={WrapperComponent} {...wrapperProps}>
        <RecordItemLeft>
          <TagGroup>
            {record.post.job.map((jobName) => (
              <JobChip key={jobName}>{jobName}</JobChip>
            ))}
          </TagGroup>
          <Typography as='h3' size={4} weight='semiBold'>
            {record.post.title}
          </Typography>
        </RecordItemLeft>

        <RecordItemRight>
          {record.simulationStatus === 'COMPLETED' ? (
            <StatusIndicator $status='COMPLETED'>
              <CheckCircledIcon width={18} height={18} />
              변환 완료
            </StatusIndicator>
          ) : (
            <StatusIndicator $status='INPROGRESS'>
              <UpdateIcon width={18} height={18} />
              변환 진행 중
            </StatusIndicator>
          )}
        </RecordItemRight>
      </RecordItemBase>
    );
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        {/* 상단 프리셋/기록 섹션 */}
        <StyledTabsRoot
          defaultValue='/simulation/record'
          onValueChange={(value) => navigate(value)}
        >
          <StyledTabsList>
            <StyledTabsTrigger value='/simulation'>면접 시뮬레이션</StyledTabsTrigger>
            <StyledTabsTrigger value='/simulation/record'>면접 연습기록</StyledTabsTrigger>
          </StyledTabsList>
        </StyledTabsRoot>

        {/* 기록 목록 */}
        <RecordListContainer>
          {records.length > 0 ? (
            records.map((record) => (
              <React.Fragment key={record.simulationId}>{renderRecordItem(record)}</React.Fragment>
            ))
          ) : (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Typography size={4} muted>
                아직 연습 기록이 없습니다.
              </Typography>
            </div>
          )}
        </RecordListContainer>
      </MainContentWrapper>
    </PageContainer>
  );
}

// --- [스타일 정의] ---

// 1. 페이지 레이아웃 (기존 페이지와 동일)
const MainContentWrapper = styled.div`
  width: 80%;
  //   max-width: 1200px;
  //   margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

// 2. SimulationPresetPage와 동일
const StyledTabsRoot = styled(Tabs.Root)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const StyledTabsList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const StyledTabsTrigger = styled(Tabs.Trigger)`
  all: unset;
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[6]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  position: relative;

  &[data-state='active'] {
    color: ${({ theme }) => theme.colors.primary[9]};
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background-color: ${({ theme }) => theme.colors.primary[9]};
    }
  }
`;

// 3. 기록 목록

const RecordListContainer = styled.div`
  display: flex;
  flex-direction: column;
  //   border-top: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

// Link 또는 div로 사용될 기본 아이템 스타일
const RecordItemBase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]}; /* 20px 16px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;

  /* 변환 완료된 항목만 호버 효과 */
  ${({ $isClickable }) =>
    $isClickable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray[2]};
      }
    `}
`;

const RecordItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const TagGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

// JobSelector의 JobChip과 유사한 태그 스타일
const JobChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[12]};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const RecordItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

// 스피너 애니메이션
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 변환 상태 표시 (아이콘 + 텍스트)
const StatusIndicator = styled(Typography).attrs({ size: 3, weight: 'semiBold' })`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};

  /* 1. 변환 완료 (초록색) */
  ${({ $status }) =>
    $status === 'COMPLETED' &&
    css`
      color: #1e9654;

      svg {
        color: #1e9654;
      }
    `}

  /* 2. 변환 진행 중 (빨간색 - 와이어프레임 기준) */
  ${({ $status }) =>
    $status === 'INPROGRESS' &&
    css`
      color: #d93025;

      svg {
        color: #d93025;
        animation: ${spin} 1.5s linear infinite; /* 스피너 애니메이션 */
      }
    `}
`;
