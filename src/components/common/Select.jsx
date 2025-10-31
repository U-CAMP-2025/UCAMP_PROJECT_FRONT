import * as Select from '@radix-ui/react-select';
import styled from 'styled-components';

export const SelectTrigger = styled(Select.Trigger)`
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  background: white;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 160px;
  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[8]};
  }
  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.gray[9]};
  }
`;

export const SelectContent = styled(Select.Content)`
  overflow: hidden;
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

export const SelectViewport = styled(Select.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
`;

export const SelectItem = styled(Select.Item)`
  font-size: ${({ theme }) => theme.font.size[3]};
  line-height: 32px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.gray[3]};
  }
`;

export const SelectItemText = styled(Select.ItemText)``;

/*
<Select.Root>
  <SelectTrigger aria-label="Role">
    <Select.Value placeholder="Select role" />
    <Select.Icon>▾</Select.Icon>
  </SelectTrigger>
  <Select.Portal>
    <SelectContent>
      <SelectViewport>
        <SelectItem value="frontend"><SelectItemText>Frontend</SelectItemText></SelectItem>
        <SelectItem value="backend"><SelectItemText>Backend</SelectItemText></SelectItem>
      </SelectViewport>
    </SelectContent>
  </Select.Portal>
</Select.Root>
*/
