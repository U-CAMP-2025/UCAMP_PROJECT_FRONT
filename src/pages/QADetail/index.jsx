import { PageContainer } from '@components/layout/PageContainer';
import { QADetail } from '@components/qaset/QADetail';
import { QAReviews } from '@components/qaset/QAReviews';
import styled from 'styled-components';

export default function QADetailPage() {
  return (
    <PageContainer header footer>
      <Wrapper>
        <QADetail />
        <QAReviews />
      </Wrapper>
    </PageContainer>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[8]};
  width: 60%;
  min-width: 700px;
  max-width: 900px;
`;
