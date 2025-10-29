import * as Tabs from '@radix-ui/react-tabs';
import styled from 'styled-components';

// 컨테이너
export const TabsRoot = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

// 탭 리스트(상단)
export const TabsList = styled(Tabs.List)`
  display: flex;
  gap: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[7]};
  padding-bottom: ${({ theme }) => theme.space[2]};
  overflow-x: auto;
`;

// 트리거(각 탭 버튼)
export const TabsTrigger = styled(Tabs.Trigger)`
  position: relative;
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;

  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[6]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[11]};
  padding: 0 0 ${({ theme }) => theme.space[2]};

  /* 선택 상태 */
  &[data-state='active'] {
    color: ${({ theme }) => theme.colors.primary[9]};
  }

  /* 하단 보더 인디케이터 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 3px;
    background: transparent;
    border-radius: 999px;
    transition: background 0.2s ease;
  }
  &[data-state='active']::after {
    background: ${({ theme }) => theme.colors.primary[9]};
  }

  /* 접근성 포커스 */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.25); /* primary[9] 기반 */
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

export const TabsContent = styled(Tabs.Content)`
  /* 필요 시 페이지 간격/레이아웃 정의 */
`;

export default function AppTabs({ items = [], defaultValue, value, onValueChange, className }) {
  const first = items[0]?.value;

  return (
    <TabsRoot
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue ?? first}
      className={className}
    >
      <TabsList aria-label='탭 내비게이션'>
        {items.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
