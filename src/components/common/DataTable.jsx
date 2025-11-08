import * as Checkbox from '@radix-ui/react-checkbox';
import styled, { css } from 'styled-components';

import Typography from './Typography';

// ===== styled =====
const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  background: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[11]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[6]};
  white-space: nowrap;

  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
`;

const Td = styled.td`
  font-size: ${({ theme }) => theme.font.size[2]};
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  color: ${({ theme }) => theme.colors.gray[12]};
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}

  ${({ width }) =>
    width &&
    css`
      max-width: ${width};
    `}
`;

const Tr = styled.tr`
  &:hover td {
    background: ${({ theme }) => theme.colors.gray[2]};
  }
`;

const CheckboxRoot = styled(Checkbox.Root)`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &[data-state='checked'] {
    background: ${({ theme }) => theme.colors.primary[9]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
`;
const CheckboxIndicator = styled(Checkbox.Indicator)`
  color: #fff;
  font-size: 14px;
`;

// 작은 Pill 버튼/상태
export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  ${({ theme, $variant = 'neutral' }) => {
    const v = {
      neutral: { bg: theme.colors.gray[3], fg: theme.colors.gray[11] },
      primary: { bg: theme.colors.primary[3], fg: theme.colors.primary[11] },
      success: { bg: '#E7F8ED', fg: '#18794E' },
      danger: { bg: '#FDEBEC', fg: '#B31B1B' },
    }[$variant];
    return css`
      background: ${v.bg};
      color: ${v.fg};
    `;
  }}
`;
// ✅ 스켈레톤 바 정의
const SkeletonBar = styled.div`
  height: 14px;
  width: ${({ width }) => width || '80%'};
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[3]} 25%,
    ${({ theme }) => theme.colors.gray[4]} 50%,
    ${({ theme }) => theme.colors.gray[3]} 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: -400px 0;
    }
    100% {
      background-position: 400px 0;
    }
  }
`;
// ===== 타입 =====
// columns: [{ key?: string, header: string | ReactNode, width?:string, align?:'left'|'center'|'right', render?: (row) => ReactNode }]
// rowKey: (row)=>string|number  (필수)
// selectable?: boolean  체크박스 사용 여부
// onSelectionChange?: (selectedIds: (string|number)[]) => void

export default function DataTable({
  columns = [],
  rows = [],
  rowKey,
  selectable = false,
  onSelectionChange,
  className,
  loading = false,
}) {
  const allSelected = selectable && rows.length > 0 && rows.every((r) => r.__selected);
  const toggleAll = (checked) => {
    rows.forEach((r) => (r.__selected = checked));
    onSelectionChange?.(checked ? rows.map(rowKey) : []);
  };
  const toggleOne = (row, checked) => {
    row.__selected = checked;
    const selected = rows?.filter((r) => r.__selected).map(rowKey);
    onSelectionChange?.(selected);
  };

  return (
    <TableWrap className={className}>
      <Table>
        <thead>
          <tr>
            {selectable && (
              <Th width='48px' align='center'>
                <CheckboxRoot
                  checked={allSelected}
                  onCheckedChange={(v) => toggleAll(!!v)}
                  aria-label='전체 선택'
                >
                  <CheckboxIndicator>✓</CheckboxIndicator>
                </CheckboxRoot>
              </Th>
            )}
            {columns.map((c, idx) => (
              <Th key={idx} width={c.width} align={c.align}>
                {typeof c.header === 'string' ? (
                  <Typography as='span' size={3} weight='semiBold'>
                    {c.header}
                  </Typography>
                ) : (
                  c.header
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // ✅ 스켈레톤 로딩 행
            Array.from({ length: 5 }).map((_, rIdx) => (
              <Tr key={`skeleton-${rIdx}`}>
                {selectable && (
                  <Td align='center'>
                    <SkeletonBar width='18px' />
                  </Td>
                )}
                {columns.map((c, cIdx) => (
                  <Td key={cIdx} align={c.align}>
                    <SkeletonBar width={`${60 + Math.random() * 30}%`} />
                  </Td>
                ))}
              </Tr>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <Tr key={rowKey(row)}>
                {selectable && (
                  <Td align='center'>
                    <CheckboxRoot
                      checked={!!row.__selected}
                      onCheckedChange={(v) => toggleOne(row, !!v)}
                      aria-label='선택'
                    >
                      <CheckboxIndicator>✓</CheckboxIndicator>
                    </CheckboxRoot>
                  </Td>
                )}
                {columns.map((c, cIdx) => (
                  <Td key={cIdx} align={c.align}>
                    {c.render ? c.render(row) : c.key ? row[c.key] : null}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td align='center' colSpan={columns.length + (selectable ? 1 : 0)}>
                <Typography size={2} color='gray'>
                  데이터가 없습니다.
                </Typography>
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>
    </TableWrap>
  );
}
