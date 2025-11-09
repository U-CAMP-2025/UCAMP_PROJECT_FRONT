import { postPaymentConfirm } from '@api/paymentAPIS';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const confirmCalledRef = useRef(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const paymentKey = searchParams.get('paymentKey');

  useEffect(() => {
    // 필수 파라미터 없으면 바로 에러 처리
    if (!orderId || !amount || !paymentKey) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (confirmCalledRef.current) return;
    confirmCalledRef.current = true;

    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    async function confirm() {
      try {
        await postPaymentConfirm(requestData);

        // 결제 승인 성공 시: 최신 user 기준으로 isPlus 활성화
        const current = useAuthStore.getState().user;
        useAuthStore.setState({
          user: {
            ...current,
            isPlus: true,
          },
        });

        setIsError(false);
      } catch (error) {
        console.error('결제 승인 실패:', error);

        const code = error?.response?.data?.code;
        const message = error?.response?.data?.message || error?.message || '';

        // ✅ 이미 처리된 결제는 성공으로 간주 (ALREADY_PROCESSED_PAYMENT)
        if (code === 'ALREADY_PROCESSED_PAYMENT' || message.includes('ALREADY_PROCESSED_PAYMENT')) {
          const current = useAuthStore.getState().user;
          useAuthStore.setState({
            user: {
              ...current,
              isPlus: true,
            },
          });
          setIsError(false);
        } else {
          setIsError(true);
        }
      } finally {
        setIsLoading(false);
      }
    }

    confirm();
  }, [orderId, amount, paymentKey]);

  const handleGoMyPage = () => {
    navigate('/mypage');
  };

  const handleGoPayment = () => {
    navigate('/payment');
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Card>
          <Spinner />
          <Typography as='h2' size={5} weight='bold'>
            결제를 확인하는 중입니다...
          </Typography>
          <Typography size={2}>잠시만 기다려 주세요. 이용권 정보를 적용하고 있습니다.</Typography>
        </Card>
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <Card>
          <IconArea $error>!</IconArea>
          <Typography as='h2' size={5} weight='bold' style={{ color: theme.colors.gray[12] }}>
            결제 승인에 실패했어요
          </Typography>
          <Typography size={2} style={{ color: theme.colors.gray[11] }}>
            결제 처리 중 문제가 발생했습니다. 다시 시도하시거나 결제 내역을 확인해주세요.
          </Typography>
          <ButtonRow>
            <Button variant='outline' size='md' onClick={handleGoPayment}>
              플러스 이용권 다시 결제하기
            </Button>
          </ButtonRow>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card>
        <IconArea>✓</IconArea>
        <Typography as='h2' size={5} weight='bold' style={{ color: theme.colors.gray[12] }}>
          결제가 완료되었습니다
        </Typography>

        <Typography size={2} style={{ color: theme.colors.gray[11] }}>
          면접톡 플러스 이용권이 정상적으로 적용되었어요.
        </Typography>

        <InfoBox>
          <Typography size={2} weight='medium' style={{ color: theme.colors.gray[11] }}>
            주문번호: <span>{orderId}</span>
          </Typography>
          <Typography size={2} style={{ color: theme.colors.gray[11] }}>
            결제 금액: <span>{Number(amount).toLocaleString()}원</span>
          </Typography>
          <Typography size={1} muted>
            paymentKey: {paymentKey}
          </Typography>
        </InfoBox>

        <ButtonRow>
          <Button variant='primary' size='md' onClick={handleGoMyPage}>
            마이페이지에서 이용권 확인하기
          </Button>
          <Button variant='outline' size='md' onClick={handleGoPayment}>
            결제 페이지로 돌아가기
          </Button>
        </ButtonRow>

        <Typography size={1} style={{ color: theme.colors.gray[9], marginTop: theme.space[2] }}>
          결제 내역은 마이페이지 &gt; 결제 정보에서 다시 확인하실 수 있습니다.
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
  color: ${({ $error, theme }) => ($error ? theme.colors.gray[12] : theme.colors.primary[10])};
`;

const InfoBox = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.md};
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.gray[4]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[9]};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;
