import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';

import Typography from './Typography';

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 380px;
  max-width: 90vw;
  background: white;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  text-align: center;
`;

export const Title = styled(Typography).attrs({ as: 'h3', size: 5, weight: 'semiBold' })`
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

export const Description = styled(Typography).attrs({ size: 3, muted: true })`
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

/*
<Dialog.Root>
  <Dialog.Trigger asChild><Button>Open modal</Button></Dialog.Trigger>
  <Dialog.Portal>
    <Overlay />
    <Content>
      <Title>Invite member</Title>
      <Description>Send an invitation to join your workspace.</Description>
      <Button>Send</Button>
    </Content>
  </Dialog.Portal>
</Dialog.Root>
*/
