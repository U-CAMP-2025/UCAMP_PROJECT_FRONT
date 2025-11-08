import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useSSE } from './useSSE';

/**
 * NotificationDrawer (Right-side panel)
 * props:
 *  - open: boolean
 *  - onOpenChange: (open:boolean)=>void
 *  - items: Array<{ notiId:number|string, content:string, type:'TRANSCRIPTION'|'REVIEW'|'CERTIFICATE'|string, read:boolean, createdAt:string }>
 *  - onItemClick?: (item) => void
 *  - onMarkAllRead?: () => void1
 */

export default function NotificationDrawer({
  open,
  trigger,
  onOpenChange,
  items = [],
  onItemClick,
  onMarkAllRead,
}) {
  const unreadCount = items.filter((i) => !i.read).length;
  const sortedItems = [...items].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    const at = new Date(a.createdAt).getTime();
    const bt = new Date(b.createdAt).getTime();
    return bt - at;
  });

  useSSE(trigger);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Panel>
          <Header>
            <div>
              <Dialog.Title asChild>
                <Typography as='h3' size={4} weight='bold'>
                  알림
                </Typography>
              </Dialog.Title>
              <Typography size={1} weight='semiBold' color='gray.10'>
                읽지 않은 알림 {unreadCount}개
              </Typography>
            </div>
            <Actions>
              <MarkAll type='button' onClick={onMarkAllRead}>
                전체 읽음
              </MarkAll>
              <Close asChild>
                <IconButton aria-label='닫기'>
                  <Cross2Icon />
                </IconButton>
              </Close>
            </Actions>
          </Header>

          <List>
            {sortedItems.length === 0 ? (
              <Empty>
                <Typography size={4} muted>
                  알림이 없습니다.
                </Typography>
              </Empty>
            ) : (
              sortedItems.map((it) => (
                <Item key={it.notiId} $unread={!it.read} onClick={() => onItemClick?.(it)}>
                  <Leading>
                    <Dot $unread={!it.read} />
                  </Leading>
                  <Body>
                    <Row>
                      <Badge $type={it.type}>{labelOf(it.type)}</Badge>
                      <Time>{formatYMD(it.createdAt)}</Time>
                    </Row>
                    <Typography as='p' size={2} style={{ whiteSpace: 'pre-wrap' }}>
                      {it.type === 'REVIEW' ? (
                        <StyledLink to={`/qa/${it.content.split(':::')[1]}`}>
                          {'"' + it.content.split(':::')[0] + '" '}
                          <Message> 면접노트에 리뷰가 달렸습니다.</Message>
                        </StyledLink>
                      ) : it.type === 'SCRAP' ? (
                        <StyledLink to={`/qa/${it.content.split(':::')[1]}`}>
                          {'"' + it.content.split(':::')[0] + '" '}
                          <Message>가 스크랩되었습니다.</Message>
                        </StyledLink>
                      ) : (
                        <Message>{it.content}</Message>
                      )}
                    </Typography>
                  </Body>
                </Item>
              ))
            )}
          </List>
        </Panel>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function labelOf(type) {
  if (type === 'TRANSCRIPT') return '답변 변환';
  if (type === 'REVIEW') return '리뷰';
  if (type === 'CERT') return '합격자 인증';
  return type || '알림';
}

function formatYMD(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return iso;
  }
}

// ===== styled =====
const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
`;

const Panel = styled(Dialog.Content)`
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 90vw);
  height: 100vh;
  background: #fff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0;
  overflow: hidden; /* ensure inner content scrolls */
  z-index: 9999;
`;

const Header = styled.div`
  height: 80px;
  padding: ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const MarkAll = styled.button`
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.primary[10]};
  height: 32px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[10]};
  background: ${({ theme }) => theme.colors.primary[3]};
  cursor: pointer;
  &:hover {
    filter: brightness(0.98);
  }
`;

const Close = styled(Dialog.Close)``;

const IconButton = styled.button`
  all: unset;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.gray[3]};
  }
`;

const List = styled.div`
  overflow: auto;
  min-height: 0;
  padding: ${({ theme }) => theme.space[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const Empty = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.gray[10]};
`;

const Item = styled.button`
  width: 100%;
  height: fit-content;
  text-align: left;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fff;
  padding: ${({ theme }) => theme.space[4]};
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  &:hover {
    background: ${({ theme }) => theme.colors.gray[2]};
  }
`;

const Leading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  background: ${({ $unread, theme }) => ($unread ? theme.colors.primary[9] : theme.colors.gray[7])};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.space[2]};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 ${({ theme }) => theme.space[2]};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  ${({ $type, theme }) => {
    const map = {
      SCRAP: { bg: theme.colors.primary[3], fg: theme.colors.primary[11] },
      REVIEW: { bg: '#E7F8ED', fg: '#18794E' },
      CERT: { bg: '#ffedd5', fg: '#fb923c' },
    };
    const v = map[$type] || { bg: theme.colors.gray[3], fg: theme.colors.gray[11] };
    return `background:${v.bg}; color:${v.fg};`;
  }}
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.gray[10]};
  font-size: ${({ theme }) => theme.font.size[2]};
`;
const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[8]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  transition: color 0.2s ease;
  font-size: ${({ theme }) => theme.font.size[3]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[11]};
  }
`;

const Message = styled.span`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  font-size: ${({ theme }) => theme.font.size[2]};
`;
