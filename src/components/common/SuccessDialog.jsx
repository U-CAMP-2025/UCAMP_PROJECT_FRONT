// src/components/common/SuccessModal.jsx
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
  width: 360px;
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: 24px;
  text-align: center;
`;

const Title = styled(Dialog.Title)`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary[9]};
  margin-bottom: 12px;
`;

const Description = styled(Dialog.Description)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-bottom: 24px;
`;

const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 16px;
  cursor: pointer;
`;

export default function SuccessDialog({ open, onOpenChange, message }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Overlay />
      <Content>
        <Title>완료</Title>
        <Description>{message}</Description>
        <CloseButton onClick={() => onOpenChange(false)}>확인</CloseButton>
      </Content>
    </Dialog.Root>
  );
}
