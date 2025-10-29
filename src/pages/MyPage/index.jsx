import { PageContainer } from '@components/layout/PageContainer';
import MyInfo from '@components/mypage/MyInfo';

export default function MyPage() {
  return (
    <PageContainer header footer>
      <MyInfo />
    </PageContainer>
  );
}
