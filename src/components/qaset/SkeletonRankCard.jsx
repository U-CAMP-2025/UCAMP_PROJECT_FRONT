import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

export function RankCardSkeleton() {
  return (
    <SkeletonTheme baseColor='#f4f3ff' highlightColor='#ebe8ff' duration={1.2}>
      <SkeletonTable>
        {[...Array(7)].map((_, i) => (
          <SkeletonRow key={i}>
            <RankCell>
              <Skeleton circle width={28} height={28} />
            </RankCell>
            <ProfileCell>
              <Skeleton circle width={36} height={36} />
              <Skeleton width={80} height={16} style={{ marginLeft: 8 }} />
            </ProfileCell>
            <JobCell>
              <Skeleton width={120} height={16} />
            </JobCell>
            <CountCell>
              <Skeleton width={24} height={16} />
            </CountCell>
            <StatusCell>
              <Skeleton width={60} height={24} borderRadius={20} />
            </StatusCell>
          </SkeletonRow>
        ))}
      </SkeletonTable>
    </SkeletonTheme>
  );
}

const SkeletonTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  width: 900px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  background: #fff;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1.5fr 1fr 0.6fr 0.8fr;
  align-items: center;
  padding: 12px 24px 12px 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const RankCell = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileCell = styled.div`
  display: flex;
  align-items: center;
  margin-left: 26px;
`;

const JobCell = styled.div``;
const CountCell = styled.div`
  text-align: center;
`;
const StatusCell = styled.div`
  display: flex;
  justify-content: flex-end;
`;
