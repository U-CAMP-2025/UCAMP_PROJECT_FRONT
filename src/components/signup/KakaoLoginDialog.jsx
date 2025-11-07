import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import theme from '@styles/theme';
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
            <div>
              <Typography size={3} weight='medium'>
                카카오 계정으로 간편하게 시작하기
              </Typography>
              <Typography size={2} color={theme.colors.gray[9]}>
                면접 연습 기록과 면접 노트를 관리할 수 있어요.
              </Typography>
            </div>
          </Body>
          <KakaoButton
            type='button'
            onClick={() => {
              window.location.href = import.meta.env.VITE_API_KAKAO_LOGIN;
            }}
          >
            <img src='/images/kakao_login.png' alt='카카오 로그인' />
          </KakaoButton>
        </Content>
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
  border-radius: 16px;
  width: 360px;
  max-width: 90vw;
  padding: 24px 24px 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22);
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 10000;
  height: 250px;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 4px;
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
  align-items: stretch;
  gap: 14px;
  margin: 10px 0;
  text-align: center;
`;

const KakaoButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  background: #fee500;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  img {
    width: 140px;
    height: auto;
    display: block;
  }
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;
