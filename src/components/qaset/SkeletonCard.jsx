import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

export function QASetCardSkeleton() {
  return (
    <SkeletonTheme
      baseColor='#f0f0f0'
      highlightColor='#e0e0e0'
      duration={1.5}
      enableAnimation={true}
    >
      <SkeletonCard>
        <SkeletonHeader>
          <Skeleton width={80} height={24} count={2} inline style={{ marginRight: 8 }} />
        </SkeletonHeader>

        <SkeletonContent>
          <Skeleton width={60} height={20} style={{ marginBottom: 8 }} />
          <Skeleton height={24} style={{ marginTop: 8 }} />

          <div style={{ marginTop: 16 }}>
            <Skeleton width={60} height={20} style={{ marginBottom: 6 }} />
            <Skeleton count={2} height={18} />
          </div>

          <div style={{ marginTop: 16, flexGrow: 1 }}>
            <Skeleton width={60} height={20} style={{ marginBottom: 6 }} />
            <Skeleton width={100} height={16} />
          </div>
        </SkeletonContent>

        <SkeletonDivider />

        <SkeletonFooter>
          <Skeleton width={50} height={20} />
          <Skeleton width={50} height={20} />
        </SkeletonFooter>
      </SkeletonCard>
    </SkeletonTheme>
  );
}

const SkeletonCard = styled.article`
  border: 1px solid #e8e5d9;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 400px;
  overflow: hidden;
`;

const SkeletonHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary[5]};
  border-radius: ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl} 0 0;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  height: 90px;
  display: flex;
  align-items: center;
`;

const SkeletonContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[5]};
  background: #ffffff;
`;

const SkeletonDivider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  margin: 0 ${({ theme }) => theme.space[5]};
`;

const SkeletonFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[6]};
  background: #ffffff;
  border-radius: 0 0 ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl};
`;
