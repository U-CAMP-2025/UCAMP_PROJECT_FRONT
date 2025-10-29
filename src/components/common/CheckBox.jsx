import * as Checkbox from '@radix-ui/react-checkbox';
import styled from 'styled-components';

export const CheckboxRoot = styled(Checkbox.Root)`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[9]};
  }
  &[data-state='checked'] {
    background: ${({ theme }) => theme.colors.primary[9]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
`;

export const CheckboxIndicator = styled(Checkbox.Indicator)`
  color: white;
`;

//
/*
<label style={{display:'inline-flex',alignItems:'center',gap:8}}>
  <CheckboxRoot id="agree">
    <CheckboxIndicator>✓</CheckboxIndicator>
  </CheckboxRoot>
  <Text as="span" size={2}>I agree to the terms</Text>
</label>
*/
