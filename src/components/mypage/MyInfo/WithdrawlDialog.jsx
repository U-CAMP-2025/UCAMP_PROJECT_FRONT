import { deleteUser } from '@api/authAPIS';
import Button from '@components/common/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useState } from 'react';
import styled from 'styled-components';

export const WithdrawlDialog = ({ open, onOpenChange }) => {
  const { withdraw } = useAuthStore();
  const [confirmText, setConfirmText] = useState(''); // 입력 상태
  const [isValid, setIsValid] = useState(false);
  const handleClickCancelButton = () => {
    onOpenChange(false);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setConfirmText(value);
    setIsValid(value === '회원탈퇴');
  };
  const handleClickWithdrawButton = () => {
    if (!isValid) return;
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
                <Title>알림</Title>
              </Dialog.Title>
              {/* <Dialog.Close asChild>
                <CloseButton aria-label='닫기'>
                  <Cross2Icon />
                </CloseButton>
              </Dialog.Close> */}
            </Header>
            <Body>
              <ContentText>
                {`정말 탈퇴하시겠습니까? \n 개인정보 이외의 데이터는 삭제되지 않습니다.`}
              </ContentText>
              {/* 입력 영역 */}
              <InputLabel>
                탈퇴를 진행하려면 <b>회원탈퇴</b>를 입력해주세요.
              </InputLabel>
              <ConfirmInput type='text' value={confirmText} onChange={handleInputChange} />
              <ButtonContainer>
                <Button variant='ghost' onClick={handleClickCancelButton}>
                  취소
                </Button>
                <Button
                  onClick={handleClickWithdrawButton}
                  disabled={!isValid} // 조건: 정확히 입력 시만 활성
                  style={{
                    opacity: isValid ? 1 : 0.5,
                    cursor: isValid ? 'pointer' : 'not-allowed',
                  }}
                >
                  탈퇴
                </Button>
              </ButtonContainer>
            </Body>
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const InputLabel = styled.div`
  margin-top: 4px;
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  text-align: center;
`;

const ConfirmInput = styled.input`
  margin: 5px 0;
  width: 150px;
  height: 30px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary[10]};
  }
`;

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
  height: 280px;
  max-width: 90vw;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 18px;
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentText = styled.div`
  white-space: pre-line;
  font-size: ${({ theme }) => theme.font.size[3]};
  text-align: center;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  column-gap: 10px;
`;
