import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useEffect, useState } from 'react';
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
const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  width: 300px;
`;
const Value = styled(Typography).attrs({ as: 'div', size: 4 })``;
const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[4]};
`;
const RGRoot = styled(RadioGroup.Root)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
`;
const RGItem = styled(RadioGroup.Item)`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  background: ${({ theme }) => theme.colors.gray[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  &[data-state='checked'] {
    background: ${({ theme }) => theme.colors.primary[3]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
`;
const RGLabel = styled(Typography).attrs({ as: 'span', size: 3, weight: 'bold' })``;
const RGBlock = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

/**
 * CertificateDialog
 * Props:
 *  - open: boolean
 *  - onOpenChange: (open:boolean) => void
 *  - user: { nickName?: string, certficate?: { fileName?: string } }
 *  - onConfirm: (decision: 'APPROVED'|'REJECTED') => void
 */
export default function CertificateDialog({ open, onOpenChange, user, onConfirm }) {
  const [decision, setDecision] = useState('');

  useEffect(() => {
    // reset decision when user or dialog changes
    setDecision('');
  }, [user, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Typography as='h3' size={5} weight='bold'>
            합격 신청
          </Typography>
          <Row>
            <Typography size={4} weight='semiBold'>
              유저명
            </Typography>
            <Value>{user?.nickName ?? '-'}</Value>
          </Row>
          <Row>
            <Typography size={4} weight='semiBold'>
              첨부파일
            </Typography>
            <Value>{user?.certficate?.fileName ?? '-'}</Value>
          </Row>

          <RGRoot value={decision} onValueChange={setDecision}>
            <RGBlock>
              <RGItem value='APPROVED' aria-label='승인'>
                <RadioGroup.Indicator>
                  <CheckIcon width={18} height={18} />
                </RadioGroup.Indicator>
              </RGItem>
              <RGLabel>승인</RGLabel>
            </RGBlock>
            <RGBlock>
              <RGItem value='REJECTED' aria-label='거부'>
                <RadioGroup.Indicator>
                  <CheckIcon width={20} height={20} />
                </RadioGroup.Indicator>
              </RGItem>
              <RGLabel>거부</RGLabel>
            </RGBlock>
          </RGRoot>

          <Actions>
            <Button
              onClick={() => {
                if (!decision) return;
                onConfirm?.(decision);
              }}
            >
              확인
            </Button>
          </Actions>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
