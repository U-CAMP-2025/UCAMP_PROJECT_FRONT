import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import Typography from './Typography';

// --- 스타일 정의 ---

const SortTrigger = styled(DropdownMenu.Trigger)`
  /* 정렬 방식을 표시하는 버튼 */
  all: unset;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]}; /* 8px 12px */
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: white;
  cursor: pointer;

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

const DropdownItem = styled(DropdownMenu.Item)`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  padding-left: ${({ theme }) => theme.space[6]}; /* 체크 아이콘 공간 확보 */
  position: relative;
  user-select: none;
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.primary[3]};
    color: ${({ theme }) => theme.colors.primary[12]};
  }
`;

const ItemIndicator = styled(DropdownMenu.ItemIndicator)`
  position: absolute;
  left: ${({ theme }) => theme.space[2]};
  width: ${({ theme }) => theme.space[3]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[9]}; /* Primary 색상 체크 아이콘 */
`;

const CaretIconStyled = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[10]};
`;

// --- 컴포넌트 로직 ---

const sortOptions = [
  { value: 'created_asc', label: '가져오기 순' },
  { value: 'review_desc', label: '리뷰 많은 순' },
  { value: 'latest_desc', label: '최신순' },
];

export const SortSelector = ({ currentSort = 'latest_desc', onSortChange }) => {
  const [sort, setSort] = useState(currentSort);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  const currentLabel = sortOptions.find((opt) => opt.value === sort)?.label || '정렬';

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
          <DropdownMenu.RadioGroup value={sort} onValueChange={handleSortChange}>
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
