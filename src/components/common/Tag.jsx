import styled from 'styled-components';

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[11]};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const TagGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

export default Tag;
