import { PageContainer } from '@components/layout/PageContainer';
import { Fail } from '@components/payment/Fail';

export default function PaymentFailPage() {
  return (
    <PageContainer header footer>
      <Fail />
    </PageContainer>
  );
}
