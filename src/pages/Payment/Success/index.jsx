import { PageContainer } from '@components/layout/PageContainer';
import { Success } from '@components/payment/Success';

export default function PaymentSuccessPage() {
  return (
    <PageContainer header footer>
      <Success />
    </PageContainer>
  );
}
