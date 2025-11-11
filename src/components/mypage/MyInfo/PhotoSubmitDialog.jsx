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
  const [error, setError] = useState('');

  const handleFile = (f) => {
    if (!f) return;
    const maxSize = 1 * 1024 * 1024; // 1MB 제한

    if (f.size > maxSize) {
      setError('1MB 이하 이미지를 업로드해주세요.');
      setFile(null);
      return;
    }

    setError('');
    setFile(f);
    onFilePick?.(f);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Typography as='h3' size={5} weight='semiBold'>
            합격자 증명 신청
          </Typography>
          <Typography size={3}>
            합격을 증명할 수 있는 사진(재직증명서 등)을 첨부해주세요.
          </Typography>

          <input
            type='file'
            accept='image/*'
            ref={inputRef}
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <Drop onClick={() => inputRef.current?.click()}>
            <Typography size={3}>클릭하여 파일 업로드</Typography>
            {file && (
              <Typography as='div' size={3} style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt='업로드한 이미지 미리보기'
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '8px',
                    marginTop: '8px',
                    objectFit: 'cover',
                  }}
                />
              </Typography>
            )}
          </Drop>
          {error && (
            <Typography size={2} color='red' style={{ marginTop: 4 }}>
              {error}
            </Typography>
          )}
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
