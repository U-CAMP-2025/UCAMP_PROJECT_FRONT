import { PageContainer } from '@components/layout/PageContainer';
import React from 'react';

import CreatePage from './CreatePage';

const RegistPage = () => {
  return (
    <PageContainer header footer>
      <CreatePage />
    </PageContainer>
  );
};

export default RegistPage;
