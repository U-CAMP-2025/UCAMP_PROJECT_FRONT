import { deleteUser } from '@api/authAPIS';
import Button from '@components/common/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import styled from 'styled-components';

export const WithdrawlDialog = ({ open, onOpenChange }) => {
  const { withdraw } = useAuthStore();
  const handleClickCancelButton = () => {
    onOpenChange(false);
  };

  const handleClickWithdrawButton = () => {
    deleteUser()
      .then(() => {
        withdraw();
      })
      .then(() => {
        window.location.href = '/';
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay>
          <Content>
            <Header>
              <Dialog.Title asChild>
                <Title>회원탈퇴</Title>
              </Dialog.Title>
              <Dialog.Close asChild>
                <CloseButton aria-label='닫기'>
                  <Cross2Icon />
                </CloseButton>
              </Dialog.Close>
            </Header>
            <Body>
              <ContentText>
                회원 탈퇴 시 보유 중인 정보가 삭제되어 복구가 불가합니다.
                <br />
                정말 탈퇴하시겠습니까?
              </ContentText>
              <ButtonContainer>
                <Button variant='ghost' onClick={handleClickCancelButton}>
                  아니오
                </Button>
                <Button onClick={handleClickWithdrawButton}>탈퇴하기</Button>
              </ButtonContainer>
            </Body>
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  width: 380px;
  height: 240px;
  max-width: 90vw;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 10000;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  all: unset;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentText = styled.div`
  margin-top: 10px;
  font-size: ${({ theme }) => theme.font.size[2]};
  text-align: center;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  column-gap: 10px;
`;
