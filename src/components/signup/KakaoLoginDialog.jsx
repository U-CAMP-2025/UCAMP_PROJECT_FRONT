import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styled from 'styled-components';

export const KakaoLoginDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Dialog.Title asChild>
              <Title>로그인</Title>
            </Dialog.Title>
            <Dialog.Close asChild>
              <CloseButton aria-label='닫기'>
                <Cross2Icon />
              </CloseButton>
            </Dialog.Close>
          </Header>

          <Body>
            <KakaoButton
              type='button'
              onClick={() => {
                window.location.href = import.meta.env.VITE_API_BASE_URL
                  ? `${import.meta.env.VITE_API_BASE_URL}/auth/kakao/login`
                  : 'http://localhost:8080/auth/kakao/login';
              }}
            >
              <img src='/images/kakao_login.png' alt='카카오 로그인' />
            </KakaoButton>
          </Body>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  width: 300px;
  height: 180px;
  max-width: 90vw;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  justify-content: center;
`;

const KakaoButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  img {
    width: 150px;
    height: auto;
  }
`;
