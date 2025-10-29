import styled from 'styled-components';

const ReadonlyInput = styled.div`
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.gray[2]};
`;

export default ReadonlyInput;
