// src/components/common/ConfirmModal.jsx
import * as Dialog from '@radix-ui/react-dialog';
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
  width: 400px;
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: 28px;
  text-align: center;
`;

const Title = styled(Dialog.Title)`
  font-size: 18px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  margin-bottom: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled(Dialog.Description)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  font-size: 14px;
`;

const ConfirmButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary[9]};
  color: white;
`;

const CancelButton = styled(Button)`
  background: ${({ theme }) => theme.colors.gray[4]};
  color: ${({ theme }) => theme.colors.gray[12]};
`;

export default function CofirmDialog({ open, onOpenChange, title, message, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Overlay />
      <Content>
        <Title>{title}</Title>
        <Description>{message}</Description>
        <ButtonGroup>
          <CancelButton onClick={() => onOpenChange(false)}>취소</CancelButton>
          <ConfirmButton
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            확인
          </ConfirmButton>
        </ButtonGroup>
      </Content>
    </Dialog.Root>
  );
}
