import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

export function QASetCardSkeleton() {
  return (
    <SkeletonTheme baseColor='#f3f3f3' highlightColor='#e8e8e8' duration={1.4} enableAnimation>
      <SkeletonCard>
        {/* 상단 뱃지 영역 */}
        <SkeletonTopMetaRow>
          <SkeletonBadge width={64} />
          <SkeletonBadge width={52} />
          <SkeletonBadge width={72} />
        </SkeletonTopMetaRow>

        {/* 직무 칩 영역 */}
        <SkeletonJobChips>
          <SkeletonChip width={80} />
          <SkeletonChip width={90} />
          <SkeletonChip width={70} />
        </SkeletonJobChips>

        {/* 제목 + 설명 */}
        <SkeletonTitleBlock>
          <Skeleton height={22} width='80%' style={{ marginBottom: 6 }} />
          <Skeleton height={16} width='100%' />
          <Skeleton height={16} width='92%' />
        </SkeletonTitleBlock>

        {/* 하단 작성자 + 통계 */}
        <SkeletonBottomRow>
          <SkeletonAuthor>
            <Skeleton width={80} height={16} />
            <Skeleton width={60} height={14} />
          </SkeletonAuthor>
          <SkeletonStats>
            <Skeleton width={40} height={18} />
            <Skeleton width={40} height={18} />
          </SkeletonStats>
        </SkeletonBottomRow>
      </SkeletonCard>
    </SkeletonTheme>
  );
}

const SkeletonCard = styled.article`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const SkeletonTopMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SkeletonBadge = styled(Skeleton)`
  border-radius: 999px !important;
  height: 18px !important;
`;

const SkeletonJobChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SkeletonChip = styled(Skeleton)`
  border-radius: 999px !important;
  height: 20px !important;
`;

const SkeletonTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
`;

const SkeletonBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const SkeletonAuthor = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

const SkeletonStats = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
