import { fetchUserPayment } from '@api/paymentAPIS';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { PageHeader } from '@components/layout/PageHeader';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export const PaymentInfo = () => {
  const { user } = useAuthStore();
  const [isPlusActive] = useState(user.isPlus);
  const [isLoading, setIsLoading] = useState(true);
  const [expiredAt, setExpiredAt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPaymentInfo = async () => {
      if (!user?.isPlus) {
        // 플러스가 아니면 그냥 로딩만 종료
        setIsLoading(false);
        return;
      }

      fetchUserPayment()
        .then((response) => {
          console.log(response);
          setExpiredAt(response.expiredAt);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    // 플러스 유저일 때만 실행
    loadPaymentInfo();
  }, [user]);

  const handleGoPayment = () => {
    navigate('/payment');
  };

  const formattedExpireDate =
    expiredAt instanceof Date
      ? expiredAt.toLocaleDateString('ko-KR')
      : expiredAt
        ? new Date(expiredAt).toLocaleDateString('ko-KR')
        : null;

  return (
    <PaymentInfoContainer>
      <PageHeader>
        <Typography as='h1' size={6} weight='bold'>
          면접톡{' '}
          <Typography as='span' color={theme.colors.primary[9]} weight='bold'>
            플러스
          </Typography>
        </Typography>
      </PageHeader>

      <Card $active={!isLoading && isPlusActive}>
        <HeaderRow>
          <Typography as='h2' size={4} weight='semiBold'>
            이용권 상태
          </Typography>
          {isLoading ? (
            <SkeletonLine width='64px' />
          ) : isPlusActive ? (
            <StatusBadge $active>사용중</StatusBadge>
          ) : (
            <StatusBadge>미사용</StatusBadge>
          )}
        </HeaderRow>

        <Body>
          {isLoading ? (
            <>
              <SkeletonLine width='70%' />
              <SkeletonLine width='45%' />
            </>
          ) : isPlusActive ? (
            <>
              <Typography size={3} weight='medium'>
                현재{' '}
                <Typography as='span' color={theme.colors.primary[9]} weight='bold'>
                  면접톡 플러스
                </Typography>
                를 사용중입니다.
              </Typography>
              <Typography size={2} style={{ color: theme.colors.primary[10] }}>
                {formattedExpireDate
                  ? `만료일: ${formattedExpireDate}`
                  : '만료일 정보를 불러오는 중입니다.'}
              </Typography>
            </>
          ) : (
            <>
              <Typography size={3} weight='medium'>
                아직 <b>면접톡 플러스</b>를 이용하고 있지 않습니다.
              </Typography>
              <BenefitList>
                <BenefitItem>
                  <span>면접 노트 개수 상향</span> (최대 21개)
                </BenefitItem>
                <BenefitItem>
                  <span>면접 연습 무제한</span>
                </BenefitItem>
                <BenefitItem>AI 피드백 제공</BenefitItem>
                <BenefitItem>스크랩한 노트는 원저자 보호를 위해 직접 수정할 수 없어요.</BenefitItem>
              </BenefitList>
            </>
          )}
        </Body>

        <FooterRow>
          {isLoading ? (
            <SkeletonButton />
          ) : (
            <Button
              variant={isPlusActive ? 'outline' : 'primary'}
              size='md'
              onClick={handleGoPayment}
            >
              {isPlusActive ? '이용권 관리하기' : '플러스 이용권 결제하기'}
            </Button>
          )}
        </FooterRow>
      </Card>
    </PaymentInfoContainer>
  );
};

const PaymentInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  gap: ${({ theme }) => theme.space[5]};
  margin-bottom: 40px;
`;

const Card = styled.div`
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary[8] : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadow.md : theme.shadow.sm)};
  background: ${({ theme, $active }) =>
    $active ? `linear-gradient(135deg, ${theme.colors.primary[2]}, #ffffff)` : '#fff'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary[11] : theme.colors.gray[10])};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[3] : theme.colors.gray[3]};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary[8] : 'transparent')};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.space[1]} 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BenefitItem = styled.li`
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[11]};
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '•';
    color: ${({ theme }) => theme.colors.primary[9]};
    font-size: 10px;
  }

  span {
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.space[2]};
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const SkeletonLine = styled.div`
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[3]} 25%,
    ${({ theme }) => theme.colors.gray[4]} 50%,
    ${({ theme }) => theme.colors.gray[3]} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const SkeletonButton = styled(SkeletonLine)`
  width: 160px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
`;
