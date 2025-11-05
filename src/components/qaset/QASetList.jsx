import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import styled from 'styled-components';

import QASetCard from './QASetCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[6]};

  /* 반응형 대응: 화면 좁을 때 2~1열로 줄이기 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default function QASetList({ qaList = [] }) {
  if (!qaList.length) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Typography size={4}>아직 등록된 면접 노트가 없습니다.</Typography>
      </div>
    );
  }

  return (
    <Grid>
      {qaList.map((item) => (
        <QASetCard key={item.postId} item={item} />
      ))}
    </Grid>
  );
}
