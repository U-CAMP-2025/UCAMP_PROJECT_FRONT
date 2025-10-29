import * as Label from '@radix-ui/react-label';
import styled from 'styled-components';

import Text from './Text';

export const FieldRoot = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const FieldLabel = styled(Label.Root)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['invalid'].includes(prop),
})`
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme, invalid }) => (invalid ? '#d64545' : theme.colors.gray[6])};
  background: white;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[9]};
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.2);
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[9]};
  }
`;

export const FieldHint = styled(Text).attrs({ size: 2, muted: true })``;

//
/*
<FieldRoot>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" placeholder="you@company.com" />
  <FieldHint>We'll never share your email.</FieldHint>
</FieldRoot>
*/
