import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';

// ===== styled =====
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
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  overflow-y: auto;
`;

const TextBlock = styled.pre`
  white-space: pre-wrap;
  color: ${({ theme }) => theme.colors.gray[12]};
  font-size: ${({ theme }) => theme.font.size[3]};
  line-height: 1.6;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[4]};
`;

/**
 * OcrTextDialog
 * @param {boolean} open - 모달 열림 여부
 * @param {function} onOpenChange - 모달 열림 상태 변경 함수
 * @param {string} text - OCR 인식 결과 텍스트
 */
export default function OcrResultDialog({ open, onOpenChange, text }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Typography as='h3' size={5} weight='bold'>
            OCR 추출 텍스트
          </Typography>
          <TextBlock>{text || '(인식된 텍스트가 없습니다)'}</TextBlock>
          <Footer>
            <Button onClick={() => onOpenChange(false)}>닫기</Button>
          </Footer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
