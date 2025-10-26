import styled from 'styled-components';

import { Footer } from './Footer';
import { Header } from './Header';

export const PageContainer = ({ children, header, footer }) => {
  return (
    <PageContainerWrapper>
      {header && <Header />}
      {children}
      {footer && <Footer />}
    </PageContainerWrapper>
  );
};

const PageContainerWrapper = styled.div``;
