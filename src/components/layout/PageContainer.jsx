import styled from 'styled-components';

import { Footer } from './Footer';
import { Header } from './Header';

export const PageContainer = ({ children, header, footer }) => {
  return (
    <PageContainerWrapper>
      {header && <Header />}
      <ChildrenWrapper> {children}</ChildrenWrapper>
      {footer && <Footer />}
    </PageContainerWrapper>
  );
};

const PageContainerWrapper = styled.div``;

const ChildrenWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
