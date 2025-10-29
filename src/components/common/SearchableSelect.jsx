import * as Popover from '@radix-ui/react-popover';
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import Typography from './Typography';

const Trigger = styled.button`
  height: 40px;
  min-width: 160px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  background: #fff;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space[3]};
  gap: ${({ theme }) => theme.space[2]};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[8]};
  }
`;

const Content = styled(Popover.Content)`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  width: 280px;
  overflow: hidden;
`;

const SearchBox = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[9]};
  }
`;

const List = styled.div`
  max-height: 260px;
  overflow: auto;
  padding: ${({ theme }) => theme.space[1]};
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  cursor: pointer;
  border: 0;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px ${({ theme }) => theme.space[3]};
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.gray[3]};
    outline: none;
  }
`;

export default function SearchableSelect({
  value, // number (jobId)
  onChange,
  options, // [{ jobId, name }]
  placeholder = '선택하세요',
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!q) return options;
    const s = q.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(s));
  }, [options, q]);

  const currentLabel = options.find((o) => o.jobId === value)?.name;

  return (
    <Popover.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setTimeout(() => inputRef.current?.focus(), 0);
      }}
    >
      <Popover.Trigger asChild>
        <Trigger aria-haspopup='listbox' aria-expanded={open}>
          <Typography as='span' size={3}>
            {currentLabel || placeholder}
          </Typography>
          <span>▾</span>
        </Trigger>
      </Popover.Trigger>
      <Popover.Portal>
        <Content align='start' sideOffset={8}>
          <SearchBox
            ref={inputRef}
            placeholder='검색…'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <List role='listbox'>
            {filtered.length === 0 && (
              <Typography as='div' size={2} muted style={{ padding: 12 }}>
                검색 결과가 없어요
              </Typography>
            )}
            {filtered.map((opt) => (
              <Item
                key={opt.jobId}
                role='option'
                aria-selected={opt.jobId === value}
                onClick={() => {
                  onChange(opt.jobId);
                  setOpen(false);
                  setQ('');
                }}
              >
                <Typography as='span' size={3}>
                  {opt.name}
                </Typography>
              </Item>
            ))}
          </List>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
