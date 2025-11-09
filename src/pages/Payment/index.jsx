import { fetchAllUserPayment } from '@api/paymentAPIS';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { PageHeader } from '@components/layout/PageHeader';
import { Checkout } from '@components/payment/Checkout';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

export default function PaymentPage() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState([]); // PaymentDTO[]
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [plusExpiredAt, setPlusExpiredAt] = useState(null);

  useEffect(() => {
    const load = async () => {
      // 로그인 정보 없으면 바로 종료
      if (!user) {
        setIsLoading(false);
        setIsPlusActive(false);
        setPayments([]);
        setPlusExpiredAt(null);
        return;
      }

      try {
        const res = await fetchAllUserPayment();
        const data = res?.data ?? res;

        if (!Array.isArray(data) || data.length === 0) {
          // 결제 내역이 전혀 없는 경우
          setPayments([]);
          setIsPlusActive(false);
          setPlusExpiredAt(null);
          return;
        }

        // approvedAt 기준 내림차순 정렬 (최신 결제가 맨 위로)
        const sorted = [...data].sort((a, b) => {
          const aTime = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
          const bTime = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
          return bTime - aTime;
        });

        setPayments(sorted);

        const latest = sorted[0];

        if (!latest || !latest.expiredAt) {
          setIsPlusActive(false);
          setPlusExpiredAt(null);
          return;
        }

        setPlusExpiredAt(latest.expiredAt);

        const now = new Date();
        const expiredAtDate = new Date(latest.expiredAt);
        const isActiveByStatus = latest.paymentStatus === 'ACTIVE';

        // 상태값 + 만료일 기준으로 이용중 여부 계산
        const active = isActiveByStatus && expiredAtDate > now;
        setIsPlusActive(active);
      } catch (error) {
        console.error('결제 정보 조회 실패:', error);
        setPayments([]);
        setIsPlusActive(false);
        setPlusExpiredAt(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user]);

  const formattedPlusExpireDate =
    plusExpiredAt && new Date(plusExpiredAt).toLocaleDateString('ko-KR');

  const latestPayment = payments.length > 0 ? payments[0] : null;

  const lastExpiredDate =
    latestPayment?.expiredAt && new Date(latestPayment.expiredAt).toLocaleDateString('ko-KR');

  const handleOpenCheckout = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <PageContainer header footer>
      <ContentWrapper>
        <PageHeader>
          <Typography as='h1' size={6} weight='bold'>
            면접톡{' '}
            <Typography as='span' color={theme.colors.primary[9]} weight='bold'>
              플러스
            </Typography>
          </Typography>
        </PageHeader>

        {/* 플러스 이용권 정보 (일반 vs 플러스 비교) */}
        <PlansRow>
          {/* 일반 회원 플랜 */}
          <PlanCard>
            <PlanHeader>
              <div>
                <Typography as='h2' size={4} weight='semiBold'>
                  일반 회원
                </Typography>
                <Typography size={2} style={{ whiteSpace: 'nowrap' }}>
                  가입만 해도 제공되는 기본 플랜입니다.
                </Typography>
              </div>
              <PriceBlock>
                <Typography size={6} weight='bold'>
                  무료
                </Typography>
              </PriceBlock>
            </PlanHeader>

            <BenefitList>
              <BenefitItem>
                면접 노트 최대 <span>9개</span>
              </BenefitItem>
              <BenefitItem>
                면접 연습 일 <span>3회</span>
              </BenefitItem>
              <BenefitItem>
                스크랩한 노트는 <span>조회만 가능</span> (수정 불가)
              </BenefitItem>
              <BenefitItem>AI 피드백 제공</BenefitItem>
            </BenefitList>

            <StatusRow>
              <StatusBadge $active>기본 제공</StatusBadge>
              <Typography size={2}>모든 유저에게 자동 적용되는 무료 이용권입니다.</Typography>
            </StatusRow>
          </PlanCard>

          {/* 플러스 플랜 */}
          <PlanCard $plus $active={isPlusActive}>
            <PlanHeader>
              <div>
                <Typography as='h2' size={4} weight='semiBold'>
                  플러스 회원
                </Typography>
                <Typography size={2}>
                  더 많은 노트와 연습으로 실전 감각을 끌어올려보세요.
                </Typography>
              </div>
              <PriceBlock>
                <Typography size={6} weight='bold' color={theme.colors.primary[9]}>
                  5,900원
                </Typography>
                <Typography size={2}>/ 월</Typography>
              </PriceBlock>
            </PlanHeader>

            <BenefitList>
              <BenefitItem>
                면접 노트 최대<span>21개</span>
              </BenefitItem>
              <BenefitItem>
                면접 연습 <span>무제한</span>
              </BenefitItem>
              <BenefitItem>
                스크랩한 노트 원하는대로 <span>수정 가능</span>
              </BenefitItem>
              <BenefitItem>AI 피드백 제공</BenefitItem>
            </BenefitList>

            <StatusRow>
              {isLoading ? (
                <SkeletonLine width='120px' />
              ) : isPlusActive ? (
                <>
                  <StatusBadge $active>이용중</StatusBadge>
                  {formattedPlusExpireDate && (
                    <Typography size={2} style={{ color: theme.colors.primary[10] }}>
                      만료일: {formattedPlusExpireDate}
                    </Typography>
                  )}
                </>
              ) : latestPayment ? (
                <>
                  <StatusBadge>만료</StatusBadge>
                  {lastExpiredDate && (
                    <Typography size={2} muted>
                      마지막 이용권 만료일: {lastExpiredDate}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <StatusBadge>미이용</StatusBadge>
                  <Typography size={2}>플러스 이용권 결제 시 혜택이 활성화됩니다.</Typography>
                </>
              )}
            </StatusRow>

            <CTARow>
              {isLoading ? (
                <SkeletonButton />
              ) : (
                <Button
                  variant={isPlusActive ? 'outline' : 'primary'}
                  size='md'
                  onClick={handleOpenCheckout}
                >
                  {isPlusActive ? '이용권 연장하기' : '플러스 이용권 결제하기'}
                </Button>
              )}
            </CTARow>
          </PlanCard>
        </PlansRow>

        {/* 결제 내역 */}
        <HistorySection>
          <Typography as='h3' size={3} weight='semiBold'>
            결제 내역
          </Typography>
          {isLoading ? (
            <HistorySkeleton>
              <SkeletonLine width='100%' />
              <SkeletonLine width='90%' />
              <SkeletonLine width='80%' />
            </HistorySkeleton>
          ) : payments.length === 0 ? (
            <EmptyHistory>아직 플러스 이용권 결제 내역이 없습니다.</EmptyHistory>
          ) : (
            <HistoryTable>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>결제 금액</th>
                  <th>결제 상태</th>
                  <th>결제일</th>
                  <th>만료일</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.orderId}>
                    <td>{p.orderId}</td>
                    <td>{p.totalAmount?.toLocaleString() ?? '-'}원</td>
                    <td>
                      <HistoryStatus $status={p.paymentStatus}>
                        {p.paymentStatus === 'ACTIVE' ? '이용가능' : '만료'}
                      </HistoryStatus>
                    </td>
                    <td>
                      {p.approvedAt ? new Date(p.approvedAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td>{p.expiredAt ? new Date(p.expiredAt).toLocaleDateString('ko-KR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </HistoryTable>
          )}
        </HistorySection>
      </ContentWrapper>

      {/* Checkout 오버레이: 버튼 클릭 시 새로운 창처럼 덮어서 결제 */}
      {showCheckout && (
        <CheckoutOverlay>
          <CheckoutBackdrop onClick={handleCloseCheckout} />
          <CheckoutPanel>
            <CheckoutHeader>
              <Typography as='h2' size={4} weight='semiBold'>
                면접톡 플러스 결제
              </Typography>
              <CloseButton onClick={handleCloseCheckout}>×</CloseButton>
            </CheckoutHeader>
            <CheckoutBody>
              <Checkout />
            </CheckoutBody>
          </CheckoutPanel>
        </CheckoutOverlay>
      )}
    </PageContainer>
  );
}

/* ---------- styled ---------- */

const PlansRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const ContentWrapper = styled.div`
  width: 70%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const PlanCard = styled.div`
  flex: 1;
  min-width: 300px;
  border: 1px solid
    ${({ theme, $plus, $active }) =>
      $plus ? ($active ? theme.colors.primary[8] : theme.colors.primary[5]) : theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme, $plus, $active }) =>
    $plus && $active ? theme.shadow.md : theme.shadow.sm};
  background: ${({ theme, $plus, $active }) =>
    $plus
      ? $active
        ? `linear-gradient(135deg, ${theme.colors.primary[2]}, #ffffff)`
        : theme.colors.primary[1]
      : '#ffffff'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  transition: all 0.18s ease;

  ${({ $plus, theme }) =>
    $plus &&
    `
    position: relative;
    &::after {
      content: '추천';
      position: absolute;
      top: 14px;
      right: 16px;
      padding: 2px 8px;
      font-size: ${theme.font.size[1]};
      border-radius: 999px;
      background-color: ${theme.colors.primary[2]};
      color: ${theme.colors.primary[11]};
      font-weight: ${theme.font.weight.medium};
    }
  `}
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  height: 80px;
  padding-top: 20px;
  color: ${({ theme }) => theme.colors.gray[12]};
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.gray[12]};
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
  font-size: ${({ theme }) => theme.font.size[3]};
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
  white-space: nowrap;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
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
  white-space: nowrap;
`;

const CTARow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[2]};
`;

const HistorySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const HistorySkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyHistory = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  font-size: ${({ theme }) => theme.font.size[2]};
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[12]};

  th,
  td {
    padding: 10px 8px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
    white-space: nowrap;
  }

  th {
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
    background-color: ${({ theme }) => theme.colors.gray[2]};
  }
`;

const HistoryStatus = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background-color: ${({ theme, $status }) =>
    $status === 'ACTIVE' ? theme.colors.primary[2] : theme.colors.gray[3]};
  color: ${({ theme, $status }) =>
    $status === 'ACTIVE' ? theme.colors.primary[10] : theme.colors.gray[10]};
`;

/* Skeleton */

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
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
  width: 180px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

/* Checkout Overlay */

const CheckoutOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckoutBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
`;

const CheckoutPanel = styled.div`
  position: relative;
  z-index: 81;
  width: 480px;
  max-width: 90%;
  max-height: 90vh;
  background-color: #fff;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.space[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const CheckoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.gray[10]};
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
`;

const CheckoutBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.space[2]};
`;
