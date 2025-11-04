import { fetchJobList } from '@api/jobAPIS';
import { Cross1Icon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
// 💡 useTheme을 styled-components에서 직접 임포트
import * as Select from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react';
import styled, { css, keyframes, useTheme } from 'styled-components';

import Typography from './Typography';

// ===========================================
// 1. STYLES DEFINITION
// ===========================================

// 💡 수정됨: flex-grow 제거 및 중앙 정렬 유지
const SelectorWrapper = styled.div`
  /* 전체 직무 선택 영역 (레이블 + 칩 목록 + 드롭다운 토글) */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
  width: 100%;
`;

// 💡 추가됨: 칩과 드롭다운을 묶는 컨테이너
const ChipGroupAndTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}; /* 칩과 버튼 사이 간격 8px */
  flex-wrap: wrap;
`;

const ChipGroup = styled.div`
  /* 선택된 칩들을 묶는 컨테이너 */
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

const JobChip = styled.div`
  /* 개별 직무 칩 스타일 */
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
  /* 칩 내부의 X 버튼 스타일 */
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
  /* 드롭다운 메뉴 컨테이너 */
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
`;

const SelectItem = styled(Select.Item)`
  /* 드롭다운 내부 개별 항목 */
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

// 💡 수정됨: Select.ItemText 원본 컴포넌트를 styled-components에 전달합니다.
const SelectItemText = styled(Select.ItemText)``;

// 💡 수정됨: Select.ItemIndicator 원본 컴포넌트를 styled-components에 전달합니다.
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

// ===========================================
// 2. COMPONENT LOGIC
// ===========================================

// 💡💡💡 [핵심 수정 1] 💡💡💡
// qaList의 'job' 배열 문자열과 name이 일치하도록 수정

/**
 * 직무를 선택하고 칩 형태로 표시하는 컴포넌트
 * @param {object} props
 * @param {string[]} props.value - 선택된 직무 ID 배열 (예: ['fe', 'be'])
 * @param {function} props.onChange - 직무 ID 배열이 변경될 때 호출되는 함수
 */
export const JobSelector = ({ value = [], onChange = () => {} }) => {
  // 💡 theme 객체는 useTheme()으로 가져옵니다.
  const theme = useTheme();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobList().then((resp) => {
      setJobs(resp);
    });
  }, []);

  // 💡 직무 ID로 이름을 찾는 헬퍼 함수
  const getJobNameById = (jobId) => {
    const job = jobs.find((j) => j.jobId === jobId);
    return job ? job.jobName : '알 수 없음';
  };

  // 💡 useState() 제거. value prop을 selectedJobs로 사용합니다.
  const selectedJobs = value;
  const MAX_SELECTIONS = 3;
  const isMaxSelected = selectedJobs.length >= MAX_SELECTIONS;

  // --- 이벤트 핸들러 ---

  const handleSelectChange = (jobId) => {
    if (!selectedJobs.includes(jobId)) {
      if (selectedJobs.length < MAX_SELECTIONS) {
        // 💡 2. setSelectedJobs 대신 onChange 호출
        onChange([...selectedJobs, jobId]);
      }
    }
  };

  const handleRemoveJob = (jobId) => {
    // 💡 3. setSelectedJobs 대신 onChange 호출
    onChange(selectedJobs.filter((id) => id !== jobId));
  };

  // 현재 선택되지 않은 직무 목록 (드롭다운에 표시될 항목)
  const availableJobs = jobs.filter((job) => !selectedJobs.includes(job.jobId));

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

        {/* 2. 직무 선택 드롭다운 (Radix Select) */}
        <Select.Root onValueChange={handleSelectChange} value=''>
          <SelectTrigger disabled={isMaxSelected} aria-label='직무 추가'>
            <CaretSortIcon width={16} height={16} />
          </SelectTrigger>

          <Select.Portal>
            <SelectContent position='popper' sideOffset={8}>
              <SelectViewport>
                {isMaxSelected ? (
                  <SelectItem value='max-reached' disabled>
                    <SelectItemText>최대 {MAX_SELECTIONS}개까지 선택 가능합니다.</SelectItemText>
                  </SelectItem>
                ) : (
                  <Select.Group>
                    {availableJobs.map((job) => (
                      <SelectItem key={job.jobId} value={job.jobId}>
                        <SelectItemText>{job.jobName}</SelectItemText>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                      </SelectItem>
                    ))}
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
