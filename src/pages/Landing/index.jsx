import { PageContainer } from '@components/layout/PageContainer';
import { LoginExample } from '@components/LoginExample';

export default function LandingPage() {
  return (
    <PageContainer header footer>
      <div>랜딩 페이지</div>
      <LoginExample />
    </PageContainer>
  );
}
