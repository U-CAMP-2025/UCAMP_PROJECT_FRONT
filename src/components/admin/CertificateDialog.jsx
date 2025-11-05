import { axiosInstance } from '@api/axios';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import CertConfirmDialog from './CertConfirmDialog';

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
  const [verifyResult, setVerifyResult] = useState(null); // 검증 결과 저장
  const [loading, setLoading] = useState(false); // 로딩 보여주기용
  const [confirmOpen, setConfirmOpen] = useState(false); // '승인할래?' 모달 열기/닫기
  const [confirmMessage, setConfirmMessage] = useState(''); // '승인할래? 메시지
  const [previewOpen, setPreviewOpen] = useState(false); // 이미지 크게보기 모달
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    // 모달이 열리면 OCR 검증 수행
    if (open && user?.certficate?.certe_file_url) {
      const fileUrl = `${import.meta.env.VITE_API_URL}${user.certficate.certe_file_url}`;
      handleVerifying(fileUrl);
    }
    // 모달 닫힐 때 초기화
    if (!open) {
      setDecision('');
      setVerifyResult(null);
      setConfirmOpen(false);
    }
  }, [user, open]);

  // OCR 이벤트
  const handleVerifying = async (fileUrl) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/ocr', { imageUrl: fileUrl });
      const data = res.data;

      const bizStatus = data?.verfRes?.data?.[0]?.b_stt || null;
      const taxType = data?.verfRes?.data?.[0]?.tax_type || '';

      // "계속사업자"이면서 "일반과세자"류면 성공(= 등록되지 않은~ 이 포함되어 있지 않으면)
      const isValid = bizStatus === '계속사업자' && taxType && !taxType.includes('등록되지 않은');

      setVerifyResult({
        status: isValid ? 'success' : 'fail',
        detail: { bizStatus, taxType, bizNum: data.bizNum },
      });
    } catch (e) {
      console.error('OCR 요청 실패:', e);
      setVerifyResult({ status: 'fail', detail: null });
    } finally {
      setLoading(false);
    }
  };

  // 승인 클릭 로직
  // const handleConfirm = () => {
  //   if (!decision) return;

  //   if (decision === 'APPROVED') {
  //     if (verifyResult?.status === 'fail') {
  //       setConfirmMessage('사업자 번호가 검증되지 않았습니다. 그래도 승인하시겠습니까?');
  //     } else {
  //       setConfirmMessage('(검증 성공) 승인하시겠습니까?');
  //     }
  //     setConfirmOpen(true);
  //   } else if (decision === 'REJECTED') {
  //     // ✅ 거부 시에도 동일한 모달 사용
  //     setConfirmMessage('반려하시겠습니까?');
  //     setConfirmOpen(true);
  //   }
  // };
  const handleDecision = (type) => {
    setDecision(type);

    if (type === 'APPROVED') {
      if (verifyResult?.status === 'fail') {
        setConfirmMessage('사업자 번호가 검증되지 않았습니다. 그래도 승인하시겠습니까?');
      } else {
        setConfirmMessage('(검증 성공) 합격자 신청을 승인하시겠습니까?');
      }
    } else if (type === 'REJECTED') {
      setConfirmMessage('합격자 신청을 반려하시겠습니까?');
    }

    setConfirmOpen(true);
  };

  // 승인 확인 모달
  const handleConfirmAction = () => {
    setConfirmOpen(false);
    onConfirm?.(decision);
  };

  const handleImageClick = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Overlay />
          <Content>
            <Typography as='h3' size={5} weight='bold'>
              합격자 등록 신청
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
              {user?.certficate?.certe_file_url ? (
                <>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.certficate.certe_file_url}`}
                    alt='합격 인증 이미지'
                    style={{
                      maxWidth: '240px',
                      maxHeight: '160px',
                      objectFit: 'contain',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={() =>
                      handleImageClick(
                        `${import.meta.env.VITE_API_URL}${user.certficate.certe_file_url}`,
                      )
                    }
                  />
                </>
              ) : (
                <Value>-</Value>
              )}
            </Row>

            {/* 검증 상태 표시 */}
            {loading ? (
              <Typography size={3}>사업자등록정보 검증 중...</Typography>
            ) : verifyResult ? (
              verifyResult.status === 'success' ? (
                <Typography size={3} style={{ color: 'green' }}>
                  검증 성공되었습니다.
                </Typography>
              ) : (
                <Typography size={3} style={{ color: 'red' }}>
                  사업자등록정보를 검증할 수 없습니다.
                </Typography>
              )
            ) : null}

            {/* <RGRoot value={decision} onValueChange={setDecision}>
              <RGBlock>
                <RGItem value='REJECTED' aria-label='반려'>
                  <RadioGroup.Indicator>
                    <CheckIcon width={20} height={20} />
                  </RadioGroup.Indicator>
                </RGItem>
                <RGLabel>반려</RGLabel>
              </RGBlock>
              <RGBlock>
                <RGItem value='APPROVED' aria-label='승인'>
                  <RadioGroup.Indicator>
                    <CheckIcon width={18} height={18} />
                  </RadioGroup.Indicator>
                </RGItem>
                <RGLabel>승인</RGLabel>
              </RGBlock>
            </RGRoot> */}

            {/* ✅ 승인/반려 버튼만 표시 */}
            <Actions style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button
                onClick={() => handleDecision('REJECTED')}
                style={{
                  background: '#E6E6E6', // neutral bg
                  color: '#555', // neutral fg
                  borderRadius: '8px',
                  fontWeight: 600,
                  padding: '10px 20px',
                }}
              >
                반려
              </Button>
              <Button
                onClick={() => handleDecision('APPROVED')}
                style={{
                  background: '#E7F8ED', // success bg
                  color: '#18794E', // success fg
                  borderRadius: '8px',
                  fontWeight: 600,
                  padding: '10px 20px',
                }}
              >
                승인
              </Button>
            </Actions>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* ✅ 커스텀 확인 모달 */}
      <CertConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={decision === 'REJECTED' ? '반려 확인' : '승인 확인'}
        message={confirmMessage}
        onConfirm={handleConfirmAction}
        status={
          decision === 'REJECTED'
            ? 'warning' // 거부 상태용 (예: 노란색)
            : verifyResult?.status === 'success'
              ? 'success'
              : 'fail'
        }
      />
      {/* ✅ 이미지 크게보기 모달 */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Overlay />
          <Dialog.Content
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <img
              src={previewSrc}
              alt='이미지 미리보기'
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
