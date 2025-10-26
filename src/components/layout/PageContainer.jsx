import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';

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
