import { PageContainer } from '@components/layout/PageContainer';
import MyInfo from '@components/mypage/MyInfo';
import { PaymentInfo } from '@components/mypage/PaymentInfo';

export default function MyPage() {
  return (
    <PageContainer header footer>
      <PaymentInfo />
      <MyInfo />
    </PageContainer>
  );
}
