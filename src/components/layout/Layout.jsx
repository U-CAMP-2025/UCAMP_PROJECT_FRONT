import styled from 'styled-components';

const Contianer = styled.div`
  max-width: ${({ theme }) => theme.container}px;
  margin: 0 auto;
`;

export default function Layout({ children }) {
  return <Contianer>{children}</Contianer>;
}
