import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
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
  width: 480px;
  max-width: 90vw;
  background: #fff;
  color: ${({ theme }) => theme.colors.gray[10]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Drop = styled.label`
  border: 1.5px dashed ${({ theme }) => theme.colors.gray[7]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  text-align: center;
  background: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.colors.gray[8]};
  cursor: pointer;
`;

export default function PhotoSubmitDialog({ open, onOpenChange, onSubmit, onFilePick }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    onFilePick?.(f);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Typography as='h3' size={5} weight='semiBold'>
            합격 인증 제출
          </Typography>
          <Typography size={3}>합격을 증명할 수 있는 사진(캡처)을 첨부해주세요.</Typography>

          <input
            type='file'
            accept='image/*'
            ref={inputRef}
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <Drop onClick={() => inputRef.current?.click()}>
            <Typography size={3}>클릭하여 파일 선택 또는 드래그 앤 드롭</Typography>
            {file && (
              <Typography as='div' size={3} style={{ marginTop: 8 }}>
                {file.name}
              </Typography>
            )}
          </Drop>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Dialog.Close asChild>
              <Button variant='outline'>취소</Button>
            </Dialog.Close>
            <Button
              onClick={() => {
                if (file) onSubmit?.(file);
              }}
              disabled={!file}
            >
              제출
            </Button>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
