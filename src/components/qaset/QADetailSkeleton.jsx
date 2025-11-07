import { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

export const QADetailSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#f0f0f0' highlightColor='#e0e0e0' duration={1.5}>
      <Wrap>
        {/* 1. 헤더 영역 */}
        <HeaderRow>
          <div style={{ width: '100%' }}>
            {/* 제목 */}
            <Skeleton height={40} width='60%' style={{ marginBottom: 12, maxWidth: '400px' }} />

            {/* 메타 정보 (작성자, 날짜, 뱃지 등) */}
            <Meta>
              <Skeleton width={60} height={20} />
              <Skeleton width={80} height={20} />
              <Dot>•</Dot>
              <Skeleton width={60} height={20} />
              <Skeleton width={100} height={20} />
              {/* 뱃지 */}
              <Skeleton width={60} height={26} borderRadius={999} style={{ marginLeft: 12 }} />
            </Meta>
          </div>

          {/* 우측 아이콘 버튼들 */}
          <div style={{ display: 'flex' }}>
            <Skeleton width={40} height={40} borderRadius={8} style={{ marginRight: 10 }} />
            <Skeleton width={40} height={40} borderRadius={8} />
          </div>
        </HeaderRow>

        {/* 2. 직무 태그 영역 */}
        <FieldBox>
          <FieldLabel>
            {/* 텍스트 너비만큼 스켈레톤 처리 */}
            <Skeleton width={60} />
          </FieldLabel>
          <TagGroup>
            <Skeleton width={80} height={28} borderRadius={16} style={{ marginRight: 8 }} />
            <Skeleton width={100} height={28} borderRadius={16} />
          </TagGroup>
        </FieldBox>

        {/* 3. 설명 영역 */}
        <TextAreaBox>
          <Placeholder>
            <Skeleton width={30} />
          </Placeholder>
          <div style={{ marginTop: 12 }}>
            <Skeleton count={3} style={{ marginBottom: 6 }} />
          </div>
        </TextAreaBox>

        {/* 4. QA 리스트 영역 (예시로 2개 보여줌) */}
        {[1, 2].map((i) => (
          <QABox key={i}>
            <Placeholder>
              <Skeleton width={40} />
            </Placeholder>
            <Skeleton count={2} style={{ marginBottom: 6 }} />
            <Divider />
            <Placeholder>
              <Skeleton width={40} />
            </Placeholder>
            <Skeleton count={3} style={{ marginBottom: 6 }} />
          </QABox>
        ))}
      </Wrap>
    </SkeletonTheme>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[6]};
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.gray[9]};
`;

const FieldBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  background: #fff;
  display: flex;
  align-items: center;
`;

const FieldLabel = styled(Typography).attrs({ as: 'div', size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-right: ${({ theme }) => theme.space[4]};
`;

const TextAreaBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #fff;
  padding: ${({ theme }) => theme.space[4]};
`;

const QABox = styled(TextAreaBox)`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[6]};
  margin: ${({ theme }) => theme.space[2]} 0;
`;

const Placeholder = styled(Typography).attrs({
  as: 'div',
  size: 2, // 👈 폰트 크기 2
  color: theme.colors.gray[11], // 👈 텍스트 색상
  weight: 'semiBold',
})`
  background-color: ${({ theme }) => theme.colors.gray[3]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.sm};

  display: inline-block;
  width: fit-content;
`;
