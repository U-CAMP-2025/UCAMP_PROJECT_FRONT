import { fetchJobList } from '@api/jobAPIS';
import { Cross1Icon, CaretSortIcon, CheckIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
// 💡 useTheme을 styled-components에서 직접 임포트
import * as Select from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react';
import styled, { css, keyframes, useTheme } from 'styled-components';

import Typography from './Typography';

// ===========================================
// 1. COMPONENT LOGIC
// ===========================================

export const JobSelector = ({ value = [], onChange = () => {} }) => {
  const theme = useTheme();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobList().then((resp) => {
      setJobs(resp);
    });
  }, []);

  const getJobNameById = (jobId) => {
    const job = jobs.find((j) => j.jobId === jobId);
    return job ? job.jobName : '로딩 중...';
  };

  const selectedJobs = value;
  const MAX_SELECTIONS = 3;
  const isMaxSelected = selectedJobs.length >= MAX_SELECTIONS;

  // --- 이벤트 핸들러 ---
  const handleSelectChange = (jobId) => {
    if (!selectedJobs.includes(jobId)) {
      if (selectedJobs.length < MAX_SELECTIONS) {
        onChange([...selectedJobs, jobId]);
      }
    }
    setSearchTerm('');
  };

  const handleRemoveJob = (jobId) => {
    onChange(selectedJobs.filter((id) => id !== jobId));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const availableJobs = jobs.filter((job) => !selectedJobs.includes(job.jobId));
  const filteredJobs = availableJobs.filter((job) =>
    job.jobName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 현재 선택되지 않은 직무 목록 (드롭다운에 표시될 항목)
  // const availableJobs = jobs.filter((job) => !selectedJobs.includes(job.jobId));

  return (
    <SelectorWrapper>
      <Typography
        size={3}
        weight='semiBold'
        style={{ whiteSpace: 'nowrap', color: theme.colors.gray[12] }}
      >
        직무
      </Typography>

      {/* 1. 선택된 칩 목록 (value prop 사용) */}
      <ChipGroupAndTrigger>
        {selectedJobs.length > 0 ? (
          <ChipGroup>
            {selectedJobs.map((jobId) => (
              <JobChip key={jobId}>
                {getJobNameById(jobId)}
                <RemoveButton
                  onClick={() => handleRemoveJob(jobId)}
                  title={`Remove ${getJobNameById(jobId)}`}
                >
                  <Cross1Icon width={12} height={12} />
                </RemoveButton>
              </JobChip>
            ))}
          </ChipGroup>
        ) : (
          <PlaceholderText>직무를 선택해주세요. (최대 3개)</PlaceholderText>
        )}

        {/* 2. 직무 선택 드롭다운 (Radix Select) */}
        <Select.Root onValueChange={handleSelectChange} value=''>
          <SelectTrigger disabled={isMaxSelected} aria-label='직무 추가'>
            <CaretSortIcon width={16} height={16} />
          </SelectTrigger>

          <Select.Portal>
            <SelectContent position='popper' sideOffset={8}>
              <SearchBarWrapper>
                <MagnifyingGlassIcon width={16} height={16} />
                <SearchBarInput
                  type='text'
                  placeholder='직무 검색...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  // 드롭다운이 닫히지 않도록 이벤트 전파 중단
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </SearchBarWrapper>
              <SelectViewport>
                {isMaxSelected ? (
                  <SelectItem value='max-reached' disabled>
                    <SelectItemText>최대 {MAX_SELECTIONS}개까지 선택 가능합니다.</SelectItemText>
                  </SelectItem>
                ) : (
                  <Select.Group>
                    {filteredJobs.map((job) => (
                      <SelectItem key={job.jobId} value={job.jobId}>
                        <SelectItemText>{job.jobName}</SelectItemText>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                      </SelectItem>
                    ))}
                    {filteredJobs.length === 0 && !isMaxSelected && (
                      <SelectItem value='no-result' disabled>
                        <SelectItemText>검색 결과가 없습니다.</SelectItemText>
                      </SelectItem>
                    )}
                  </Select.Group>
                )}
              </SelectViewport>
            </SelectContent>
          </Select.Portal>
        </Select.Root>
      </ChipGroupAndTrigger>
    </SelectorWrapper>
  );
};

// ===========================================
// 2. STYLES DEFINITION
// ===========================================

const SelectorWrapper = styled.div`
  /* 전체 직무 선택 영역 (레이블 + 칩 목록 + 드롭다운 토글) */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
  width: 100%;
`;

const SearchBarInput = styled.input`
  all: unset;
  width: 100%;
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[12]};
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[8]};
  }
`;

const ChipGroupAndTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const ChipGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const JobChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.primary[5]};
  color: ${({ theme }) => theme.colors.primary[12]};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  line-height: 1;
`;

const RemoveButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[10]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[12]};
  }
`;

// --- Radix Select 스타일 ---

const SelectTrigger = styled(Select.Trigger)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.gray[3]};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[4]};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[7]};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray[3]};
      }
    `}
`;

const slideUpAndFade = keyframes`
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
`;
const slideDownAndFade = keyframes`
    from { opacity: 0; transform: translateY(-2px); }
    to { opacity: 1; transform: translateY(0); }
`;

const SelectContent = styled(Select.Content)`
  overflow: hidden;
  background-color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: 101;

  &[data-state='open'] {
    animation: ${slideDownAndFade} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-state='closed'] {
    animation: ${slideUpAndFade} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const SelectViewport = styled(Select.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
  max-height: 190px;
  overflow-y: auto;
`;

const SelectItem = styled(Select.Item)`
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[1]};
  padding-left: ${({ theme }) => theme.space[6]};
  position: relative;
  user-select: none;
  cursor: pointer;

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.primary[4]};
    color: ${({ theme }) => theme.colors.primary[12]};
    outline: none;
  }
`;

const SelectItemText = styled(Select.ItemText)``;

const SelectItemIndicator = styled(Select.ItemIndicator)`
  /* 선택된 항목 옆의 체크 표시 */
  position: absolute;
  left: 0;
  width: ${({ theme }) => theme.space[6]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SelectSeparator = styled(Select.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[4]};
  margin: ${({ theme }) => theme.space[2]} 0;
`;

const PlaceholderText = styled(Typography).attrs({
  size: 3,
  weight: 'regular',
})`
  color: ${({ theme }) => theme.colors.gray[9]};
  font-style: italic;
  align-self: center;
  line-height: 1;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  height: 28px;
  display: flex;
  align-items: center;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.colors.gray[9]};
`;
