import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export function Fail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const handleGoPayment = () => {
    navigate('/payment');
  };

  return (
    <Wrapper>
      <Card>
        <IconArea>!</IconArea>
        <Typography as='h2' size={5} weight='bold' style={{ color: theme.colors.gray[12] }}>
          결제가 완료되지 않았어요
        </Typography>

        <Typography size={2} style={{ color: theme.colors.gray[11] }}>
          결제가 정상적으로 처리되지 않았습니다. 아래 사유를 확인하신 후 다시 시도해주세요.
        </Typography>

        <ErrorBox>
          {errorCode && (
            <Typography size={2} weight='medium' style={{ color: theme.colors.gray[11] }}>
              에러 코드: <span>{errorCode}</span>
            </Typography>
          )}
          {errorMessage && (
            <Typography size={2} style={{ color: theme.colors.gray[10] }}>
              실패 사유: <span>{errorMessage}</span>
            </Typography>
          )}
          {!errorCode && !errorMessage && (
            <Typography size={2} style={{ color: theme.colors.gray[10] }}>
              일시적인 오류로 인해 결제가 실패했습니다. 다시 시도해 주세요.
            </Typography>
          )}
        </ErrorBox>

        <ButtonRow>
          <Button variant='outline' size='md' onClick={() => window.history.back()}>
            이전 페이지로 돌아가기
          </Button>
          <Button variant='primary' size='md' onClick={handleGoPayment}>
            플러스 이용권 다시 결제하기
          </Button>
        </ButtonRow>

        <Typography size={1} style={{ color: theme.colors.gray[9], marginTop: theme.space[2] }}>
          문제가 반복되면 결제 내역을 확인한 후 고객센터로 문의해주세요.
        </Typography>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]};
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  text-align: center;
`;

const IconArea = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  margin: 0 auto ${({ theme }) => theme.space[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-size: ${({ theme }) => theme.font.size[4]};
  color: ${({ theme }) => theme.colors.primary[10]};
  background-color: ${({ theme }) => theme.colors.primary[2]};
`;

const ErrorBox = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-weight: ${({ theme }) => theme.font.weight.medium};
    color: ${({ theme }) => theme.colors.gray[12]};
  }
`;

const ButtonRow = styled.div`
  margin-top: ${({ theme }) => theme.space[3]};
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;
