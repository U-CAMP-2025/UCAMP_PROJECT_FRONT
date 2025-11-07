// SimulationRecordPage.jsx
import { axiosInstance } from '@api/axios';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { CheckCircledIcon, CaretRightIcon } from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

export default function SimulationRecordPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClickButton = () => {
    navigate('/simulation');
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/simulation/records');
        console.log(res.data);
        setRecords(res.data?.data ?? []);
      } catch (e) {
        setError(e?.response?.data?.message ?? '기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderRecordItem = (record) => {
    const simId = record?.simulationId;
    const post = record?.post ?? {};
    const jobs = Array.isArray(post?.job) ? post.job : [];
    const title = post?.title || '(제목 없음)';
    const completedAt = record?.completedAt
      ? new Date(record.completedAt).toLocaleDateString()
      : '완료 기록 없음';
    const count = record?.count ?? 0;

    return (
      <RecordItemLink to={`/simulation/${simId}/result`} key={simId}>
        <RecordItemLeft>
          <TagGroup>
            {jobs.map((jobName, i) => (
              <JobChip key={`${simId}-job-${i}`}>{jobName}</JobChip>
            ))}
          </TagGroup>

          <Typography as='h3' size={4} weight='semiBold'>
            {title}
          </Typography>

          <InfoText size={3}>
            최근 완료: {completedAt} &nbsp;|&nbsp; 반복 횟수: <span>{count}</span>회
          </InfoText>
        </RecordItemLeft>

        <RecordItemRight>
          <ViewResultText>
            <CaretRightIcon width={48} height={48} />
          </ViewResultText>
        </RecordItemRight>
      </RecordItemLink>
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
            <StyledTabsTrigger value='/simulation'>면접 연습 시작</StyledTabsTrigger>
            <StyledTabsTrigger value='/simulation/record'>면접 연습 기록</StyledTabsTrigger>
          </StyledTabsList>
        </StyledTabsRoot>

        <RecordListContainer>
          {error && <div style={{ padding: 24, color: 'crimson' }}>{error}</div>}
          {!error &&
            !loading &&
            (records.length > 0 ? (
              records.map(renderRecordItem)
            ) : (
              <EmptyState>
                <Typography size={4} color={theme.colors.gray[10]} weight='semiBold'>
                  아직 면접 연습 기록이 없습니다.
                </Typography>
                <Button
                  style={{
                    margin: '30px 0',
                  }}
                  onClick={handleClickButton}
                >
                  연습하러 가기
                </Button>
              </EmptyState>
            ))}
        </RecordListContainer>
      </MainContentWrapper>
    </PageContainer>
  );
}

/* ---------------- 스타일 ---------------- */

const MainContentWrapper = styled.div`
  width: 90%;
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
const InfoText = styled(Typography).attrs({ size: 3 })`
  color: ${({ theme }) => theme.colors.gray[11]};
  font-weight: 500;
  margin-top: ${({ theme }) => theme.space[1]};
  span {
    color: ${({ theme }) => theme.colors.primary[10]};
  }
`;

const RecordItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const RecordListContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const RecordItemLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[2]};
  }
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

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
`;

const ViewResultText = styled(Typography).attrs({ size: 3, weight: 'semiBold' })`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.primary[9]};
`;
