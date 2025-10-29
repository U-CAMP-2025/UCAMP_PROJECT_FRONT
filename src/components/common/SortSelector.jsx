import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import React from 'react';
// useEffect, useState 제거
import styled, { css } from 'styled-components';

import Typography from './Typography';

// --- 스타일 정의 생략 (이전과 동일하게 유지) ---
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

const DropdownItem = styled(DropdownMenu.Item)`
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
// --- 스타일 정의 끝 ---

const sortOptions = [
  { value: 'created_asc', label: '가져오기 순' },
  { value: 'review_desc', label: '리뷰 많은 순' },
  { value: 'latest_desc', label: '최신순' },
];

// 💡 내부 상태(internalSort, useEffect, useState)를 모두 제거하고 prop만 사용합니다.
export const SortSelector = ({ currentSort = 'latest_desc', onSortChange }) => {
  const handleSortChange = (newSort) => {
    // 1. 상위 컴포넌트로 값 전달 (이것이 QAListPage의 state를 변경합니다.)
    if (onSortChange) {
      onSortChange(newSort);
    }

    console.log('SortSelector [onValueChange]: Value passed UP:', newSort);
  };

  // 💡 prop인 currentSort를 사용하여 UI 표시
  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || '정렬';

  console.log('SortSelector [Render]: Displaying value (PROP):', currentSort);

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
          {/* 💡 DropdownMenu.RadioGroup의 value에 currentSort prop을 직접 연결 */}
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
