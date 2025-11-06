// ConfirmModal.jsx
import Button from '@components/common/Button';
import * as Dialog from '@radix-ui/react-dialog';
import {
  CheckCircledIcon,
  Cross2Icon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import styled from 'styled-components';

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
`;
const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  max-width: 90vw;
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
`;

const CloseButton = styled.button`
  all: unset;
  position: absolute;
  right: ${({ theme }) => theme.space[5]};
  top: ${({ theme }) => theme.space[5]};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  &:hover {
    background: ${({ theme }) => theme.colors.gray[3]};
  }
`;

export default function CertConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  status,
}) {
  let icon;
  if (status === 'success') {
    icon = <CheckCircledIcon style={{ width: 64, height: 64, color: '#22c55e' }} />;
  } else if (status === 'warning') {
    icon = <ExclamationTriangleIcon style={{ width: 64, height: 64, color: '#facc15' }} />;
  } else {
    icon = <CrossCircledIcon style={{ width: 64, height: 64, color: '#ef4444' }} />;
  }

  // 승인 성공일 경우: 취소 버튼 숨기기 + 닫기 버튼 표시
  const isSuccessApprove = status === 'success' && title.includes('승인');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          {/* 닫기 아이콘 (승인 성공일 때만 표시) */}
          {isSuccessApprove && (
            <Dialog.Close asChild>
              <CloseButton aria-label='닫기'>
                <Cross2Icon />
              </CloseButton>
            </Dialog.Close>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            {/* 아이콘 */}
            <Dialog.Title>{title}</Dialog.Title>
            {icon}

            <Dialog.Description>{message}</Dialog.Description>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
              }}
            >
              {/* ✅ 성공 + 승인일 때는 취소 버튼 생략 */}
              {!isSuccessApprove && (
                <Button
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  style={{ minWidth: '100px' }}
                >
                  취소
                </Button>
              )}
              <Button onClick={onConfirm} style={{ minWidth: '100px' }}>
                확인
              </Button>
            </div>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
