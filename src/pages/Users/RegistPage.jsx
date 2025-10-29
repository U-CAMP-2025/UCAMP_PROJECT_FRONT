import { JobSelector } from '@components/common/JobSelector';
import { PageContainer } from '@components/layout/PageContainer';
import React from 'react';

import RegistForm from './RegistForm';

const RegistPage = () => {
  return (
    <PageContainer header footer>
      <RegistForm />
    </PageContainer>
  );
};

export default RegistPage;
