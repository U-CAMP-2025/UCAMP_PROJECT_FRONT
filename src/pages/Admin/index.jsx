import AppTabs from '@components/common/Tabs';
import { PageContainer } from '@components/layout/PageContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AdminTranscriptionPage from './Transcription';
import AdminUserPage from './User';

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.includes('transcription') ? 'transcription' : 'user';

  const handleChangeTab = (tab) => {
    navigate(`/admin/${tab}`);
  };

  const items = [
    {
      value: 'user',
      label: '회원 관리',
      content: <AdminUserPage />,
    },
    {
      value: 'transcription',
      label: '답변 변환 현황',
      content: <AdminTranscriptionPage />,
    },
  ];

  return (
    <PageContainer header footer>
      <ContentWrapper>
        <AppTabs items={items} value={currentTab} onValueChange={handleChangeTab} />
      </ContentWrapper>
    </PageContainer>
  );
}

const ContentWrapper = styled.div`
  min-width: 800px;
  max-width: 1024px;
`;
