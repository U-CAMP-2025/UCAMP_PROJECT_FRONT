// ConfirmModal.jsx
import Button from '@components/common/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
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
              <Button
                variant='outline'
                onClick={() => onOpenChange(false)}
                style={{ minWidth: '100px' }}
              >
                취소
              </Button>
              <Button onClick={onConfirm} style={{ minWidth: '100px' }}>
                {title.substr(0, 2)}
              </Button>
            </div>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
