import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useSSE } from './useSSE';

function withPostposition(word, particles) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return word + particles[1]; // 한글이 아닐 경우 기본값 사용

  const jong = code % 28; // 받침 여부 (0이면 없음)
  return word + (jong === 0 ? particles[1] : particles[0]);
}

/**
 * NotificationDrawer (Right-side panel)
 * props:
 *  - open: boolean
 *  - onOpenChange: (open:boolean)=>void
 *  - items: Array<{ notiId:number|string, content:string, type:'TRANSCRIPTION'|'REVIEW'|'CERTIFICATE'|string, read:boolean, createdAt:string }>
 *  - onItemClick?: (item) => void
 *  - onMarkAllRead?: () => void
 *  - onDeleteAll?: () => void
 *
 */

export default function NotificationDrawer({
  open,
  trigger,
  onOpenChange,
  items = [],
  onItemClick,
  onMarkAllRead,
  onDeleteAll,
}) {
  const unreadCount = items?.filter((i) => !i.read).length;
  const sortedItems = [...items].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    const at = new Date(a.createdAt).getTime();
    const bt = new Date(b.createdAt).getTime();
    return bt - at;
  });

  useSSE(trigger);

  const navigate = useNavigate();

  const handleNavigate = (url) => {
    onOpenChange(false);
    navigate(url);
  };

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
              <Typography size={1} weight='semiBold' color='gray.11'>
                읽지 않은 알림{' '}
                <Typography as='span' size={1} weight='semiBold' color='primary.9'>
                  {unreadCount}
                </Typography>
                개
              </Typography>
            </div>
            <Actions>
              {sortedItems.length > 0 &&
                (unreadCount > 0 ? (
                  <MarkAll type='button' onClick={onMarkAllRead}>
                    전체 읽음
                  </MarkAll>
                ) : (
                  onDeleteAll && (
                    <DeleteAll type='button' onClick={onDeleteAll}>
                      전체 삭제
                    </DeleteAll>
                  )
                ))}
              <Close asChild>
                <IconButton aria-label='닫기'>
                  <Cross2Icon />
                </IconButton>
              </Close>
            </Actions>
          </Header>

          <List>
            {sortedItems.length === 0 ? (
              <Empty>알림이 존재하지 않습니다.</Empty>
            ) : (
              sortedItems.map((it) => (
                <Item key={it.notiId} $unread={!it.read} onClick={() => onItemClick?.(it)}>
                  <Leading>
                    <Dot $unread={!it.read} />
                  </Leading>
                  <Body>
                    <Row>
                      <Badge $type={it.type}>{labelOf(it.type)}</Badge>
                      <Hint>{it.read ? '삭제' : ''}</Hint>
                    </Row>
                    <Typography as='p' size={2} style={{ whiteSpace: 'pre-wrap' }}>
                      {it.type === 'REVIEW' ? (
                        <StyledSpan
                          onClick={() => handleNavigate(`/qa/${it.content.split(':::')[1]}`)}
                        >
                          {it.content.split(':::')[0]}
                          <Message> 면접노트에 리뷰가 달렸습니다.</Message>
                        </StyledSpan>
                      ) : it.type === 'SCRAP' ? (
                        <StyledSpan
                          onClick={() => handleNavigate(`/qa/${it.content.split(':::')[1]}`)}
                        >
                          {withPostposition(it.content.split(':::')[0], ['이', '가'])}
                          <Message> 스크랩되었습니다.</Message>
                        </StyledSpan>
                      ) : it.type === 'PAY_EXPIRY' ? (
                        <StyledSpan onClick={() => navigate('/payment')}>
                          <Message style={{ fontSize: '14px' }}>{it.content}</Message>
                        </StyledSpan>
                      ) : (
                        <Message>{it.content}</Message>
                      )}
                    </Typography>
                    <Time>{formatYMD(it.createdAt)}</Time>
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
  if (type === 'SCRAP') return '스크랩';
  if (type === 'REVIEW') return '리뷰';
  if (type === 'CERT') return '합격자 인증';
  if (type === 'PAY_EXPIRY') return '플러스 이용권 만료';
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
  z-index: 10000;
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
  z-index: 10001;
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

const DeleteAll = styled.button`
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[12]};
  height: 32px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[11]};
  background: ${({ theme }) => theme.colors.gray[1]};
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
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[11]};
`;

const Item = styled.button`
  width: 100%;
  height: fit-content;
  text-align: left;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  border: 1px solid
    ${({ $unread, theme }) => ($unread ? theme.colors.primary[8] : theme.colors.gray[6])};
  background: ${({ $unread, theme }) => ($unread ? '#ffffff' : theme.colors.gray[1])};
  opacity: ${({ $unread }) => ($unread ? 1 : 0.85)};
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease,
    transform 0.08s ease;
  &:hover {
    background: ${({ $unread, theme }) =>
      $unread ? theme.colors.primary[1] : theme.colors.gray[2]};
    transform: translateY(-1px);
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
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  ${({ $type, theme }) => {
    const map = {
      SCRAP: { bg: theme.colors.primary[3], fg: theme.colors.primary[11] },
      REVIEW: { bg: '#E7F8ED', fg: '#18794E' },
      CERT: { bg: '#ffedd5', fg: '#fb923c' },
      PAY_EXPIRY: { bg: '#ffe5e5', fg: '#d14a4a' },
    };
    const v = map[$type] || { bg: theme.colors.gray[3], fg: theme.colors.gray[11] };
    return `background:${v.bg}; color:${v.fg};`;
  }}
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.gray[11]};
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.colors.gray[12]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  transition: color 0.2s ease;
  font-size: ${({ theme }) => theme.font.size[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[9]};
  }
`;

const Message = styled.span`
  color: ${({ theme }) => theme.colors.gray[12]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.font.weight.regular};
  font-size: ${({ theme }) => theme.font.size[2]};
`;

const Hint = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.size[0]};
  color: ${({ theme }) => theme.colors.gray[9]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;
