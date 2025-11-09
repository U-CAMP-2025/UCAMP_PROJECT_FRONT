import styled from 'styled-components';

export const PageHeader = ({ children }) => {
  return <PageHeaderContainer>{children}</PageHeaderContainer>;
};

const PageHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
  padding-left: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.gray[12]};
`;
