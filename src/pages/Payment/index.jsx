import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { Checkout } from '@components/payment/Checkout';
import styled from 'styled-components';

export default function PaymentPage() {
  return (
    <PageContainer header footer>
      <ContentWrapper>
        <PageHeader>
          <Typography as='h1' size={7} weight='bold'>
            면접톡 플러스
          </Typography>
        </PageHeader>
        <Checkout />
      </ContentWrapper>
    </PageContainer>
  );
}

const ContentWrapper = styled.div`
  width: 960px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
  padding-left: ${({ theme }) => theme.space[6]};
  padding-right: ${({ theme }) => theme.space[6]};
`;
