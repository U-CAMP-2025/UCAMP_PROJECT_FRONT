// SimulationRecordPage.jsx
import { axiosInstance } from '@api/axios';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { CheckCircledIcon, UpdateIcon } from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

export default function SimulationRecordPage() {
  const navigate = useNavigate();
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/simulation/records');
        setRecords(res.data?.data ?? []);
      } catch (e) {
        setError(e?.response?.data?.message ?? '기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderRecordItem = (record) => {
    const isClickable = record.simulationStatus === 'COMPLETED';
    const targetUrl = `/simulation/${record.simulationId}/result`;
    const WrapperComponent = isClickable ? Link : 'div';
    const wrapperProps = { to: isClickable ? targetUrl : undefined, $isClickable: isClickable };

    return (
      <RecordItemBase as={WrapperComponent} {...wrapperProps} key={record.simulationId}>
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
          {isClickable ? (
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
        <StyledTabsRoot
          defaultValue='/simulation/record'
          onValueChange={(value) => navigate(value)}
        >
          <StyledTabsList>
            <StyledTabsTrigger value='/simulation'>면접 시뮬레이션</StyledTabsTrigger>
            <StyledTabsTrigger value='/simulation/record'>면접 연습기록</StyledTabsTrigger>
          </StyledTabsList>
        </StyledTabsRoot>

        <RecordListContainer>
          {loading && <div style={{ padding: 24 }}>불러오는 중…</div>}
          {error && <div style={{ padding: 24, color: 'crimson' }}>{error}</div>}
          {!loading &&
            !error &&
            (records.length > 0 ? (
              records.map(renderRecordItem)
            ) : (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <Typography size={4} muted>
                  아직 연습 기록이 없습니다.
                </Typography>
              </div>
            ))}
        </RecordListContainer>
      </MainContentWrapper>
    </PageContainer>
  );
}

/* 스타일 그대로 */
const MainContentWrapper = styled.div`
  width: 90%;
  //   max-width: 1200px;
  //   margin: 0 auto;
  // padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;
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
  }
  &[data-state='active']::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary[9]};
  }
`;
const RecordListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const RecordItemBase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;
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
const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;
const StatusIndicator = styled(Typography).attrs({ size: 3, weight: 'semiBold' })`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  ${({ $status }) =>
    $status === 'COMPLETED' &&
    css`
      color: #1e9654;
      svg {
        color: #1e9654;
      }
    `}
  ${({ $status }) =>
    $status === 'INPROGRESS' &&
    css`
      color: #d93025;
      svg {
        color: #d93025;
        animation: ${spin} 1.5s linear infinite;
      }
    `}
`;
