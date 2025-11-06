import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import React from 'react';
import styled from 'styled-components';

import Typography from './Typography';

// --- 스타일 정의 ---
const SortTrigger = styled(DropdownMenu.Trigger)`
  all: unset;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[8]};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;

const DropdownContent = styled(DropdownMenu.Content)`
  background-color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: ${({ theme }) => theme.space[1]} 0;
  min-width: 150px;
  z-index: 100;
`;

// 💡💡💡 [핵심 수정] RadioItem으로 변경
const DropdownItem = styled(DropdownMenu.RadioItem)`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  padding-left: ${({ theme }) => theme.space[6]};
  position: relative;
  user-select: none;
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.primary[3]};
    color: ${({ theme }) => theme.colors.primary[12]};
  }

  &[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.primary[2]};
    color: ${({ theme }) => theme.colors.primary[12]};
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
  }
`;

const ItemIndicator = styled(DropdownMenu.ItemIndicator)`
  position: absolute;
  left: ${({ theme }) => theme.space[2]};
  width: ${({ theme }) => theme.space[3]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[9]};
`;

const CaretIconStyled = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[10]};
`;

const sortOptions = [
  { value: 'bookcount_desc', label: '스크랩 순' },
  // { value: 'review_desc', label: '리뷰 많은 순' },
  { value: 'latest_desc', label: '최신순' },
];

export const SortSelector = ({ currentSort = 'bookcount_desc', onSortChange }) => {
  const handleSortChange = (newSort) => {
    if (onSortChange) {
      onSortChange(newSort);
    }
    console.log('SortSelector [onValueChange]:', newSort);
  };

  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || '정렬';

  console.log('SortSelector [Render]:', currentSort);

  return (
    <DropdownMenu.Root>
      <SortTrigger>
        <Typography size={3} style={{ fontWeight: '600' }}>
          {currentLabel}
        </Typography>
        <CaretIconStyled width={16} height={16} />
      </SortTrigger>

      <DropdownMenu.Portal>
        <DropdownContent sideOffset={5} align='end'>
          <DropdownMenu.RadioGroup value={currentSort} onValueChange={handleSortChange}>
            {sortOptions.map((option) => (
              <DropdownItem key={option.value} value={option.value}>
                <ItemIndicator>
                  <CheckIcon width={16} height={16} />
                </ItemIndicator>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
