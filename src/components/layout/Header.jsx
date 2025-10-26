import styled from 'styled-components';

export const Header = () => {
  return <HeaderContainer>Header</HeaderContainer>;
};

const HeaderContainer = styled.div`
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;
