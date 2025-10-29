import Typography from '@components/common/Typography';
import styled from 'styled-components';

export const FieldCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #fff;
  padding: ${({ theme }) => theme.space[4]};
  display: grid;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const FieldLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
`;

export const FieldRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
`;

export const FieldLabel = (props) => (
  <Typography as='label' size={3} weight='semiBold' {...props} />
);

export const FieldValue = (props) => <Typography as='div' size={3} {...props} />;

export const FieldActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
`;
