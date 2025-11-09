import { fetchJobList } from '@api/jobAPIS';
import {
  fetchUserMypage,
  patchUserJob,
  postUserPathPass,
  uploadCertificateImage,
} from '@api/userAPIS';
import Button from '@components/common/Button';
import ErrorDialog from '@components/common/ErrorDialog';
import SearchableSelect from '@components/common/SearchableSelect';
import SuccessDialog from '@components/common/SuccessDialog';
import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FieldCard, FieldLeft, FieldLabel, FieldValue, FieldActions } from './FieldRow';
import PhotoSubmitDialog from './PhotoSubmitDialog';
import { WithdrawlDialog } from './WithdrawlDialog';

const UnifiedCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const MyInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(1);

  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [, setFileName] = useState('');

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const handlePhotoSubmit = async (file) => {
    try {
      // 이미지 업로드
      const { fileName } = await uploadCertificateImage(file);

      // 합격자 신청 (JWT로 user 식별)
      await postUserPathPass(fileName);

      // 서버 반영 후 프론트 상태도 즉시 갱신
      setUser((prev) => ({ ...prev, certStatus: 'PENDING' }));

      // alert('합격자 인증이 신청되었습니다.');
      setSuccessMsg('합격자 인증이 신청되었습니다.');
      setSuccessOpen(true);
      setOpenPhotoModal(false);
    } catch (err) {
      console.error(err);
      // alert('신청 중 오류가 발생했습니다.');
      setErrorMsg('합격자 인증 신청 중 오류가 발생했습니다.');
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const data = await fetchUserMypage();
        setUser({
          userId: data.userId,
          nickname: data.nickname,
          email: data.email,
          jobName: data.job?.jobName, // job이 null일 수 있으니 optional chaining
          passStatus: data.passStatus,
          status: data.status,
          userProfileImageUrl: '',
          certStatus: data.certStatus,
        });
        setSelectedJobId(data.job.jobId);
        console.log('유저 정보', user);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false); // ✅ 로딩 끝
      }
    };

    const loadData = async () => {
      try {
        const data = await fetchJobList(); // 백엔드 요청
        // 백엔드 → 프론트 구조로 변환
        const mapped = data.map((item) => ({
          jobId: item.jobId,
          name: item.jobName,
        }));
        setJobs(mapped);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };
    loadData();
    loadInfo();
  }, []);

  const handleFilePick = (file) => {
    setFileName(file.name);
  };

  const handleJobUpdate = async () => {
    try {
      await patchUserJob(user.userId, selectedJobId); // 서버 PATCH 요청
      setEditingJob(false); // 수정 모드 종료
      setUser((prev) => ({ ...prev, jobId: selectedJobId })); // 로컬 상태 갱신
      setSuccessMsg('관심 직무가 수정되었습니다.');
      setSuccessOpen(true);
    } catch (err) {
      console.error('직무 수정 실패:', err);
      setErrorMsg('직무 수정 중 오류가 발생했습니다.');
      setErrorOpen(true);
    }
  };

  // 회원탈퇴 클릭
  const handleUserDelete = () => {
    setWithdrawDialogOpen(true);
  };
  return (
    <Container>
      <MyPageHeader>
        <Typography as='h1' size={7} weight='bold'>
          마이 페이지
        </Typography>
      </MyPageHeader>

      <UnifiedCard>
        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='nick'>닉네임</FieldLabel>
            <FieldValue>{isLoading ? <SkeletonText width='80px' /> : user?.nickname}</FieldValue>
          </FieldLeft>
        </FieldCard>

        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='email'>이메일</FieldLabel>
            <FieldValue>{isLoading ? <SkeletonText width='140px' /> : user?.email}</FieldValue>
          </FieldLeft>
        </FieldCard>

        <FieldCard>
          {/* 관심직무 */}
          <FieldLeft>
            <FieldLabel>관심 직무</FieldLabel>
            {isLoading ? (
              <FieldValue style={{ flex: 1, textAlign: 'right' }}>
                <SkeletonText width='100px' />
              </FieldValue>
            ) : editingJob ? (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <SearchableSelect
                  value={selectedJobId}
                  onChange={(id) => setSelectedJobId(id)}
                  options={jobs}
                  placeholder='직무 선택'
                />
                <Button
                  variant='outline'
                  onClick={handleJobUpdate}
                  style={{ fontSize: theme.font.size[2] }}
                >
                  완료
                </Button>
              </div>
            ) : (
              <>
                <FieldValue style={{ flex: 1, textAlign: 'right' }}>
                  {jobs.find((j) => j.jobId === selectedJobId)?.name}
                </FieldValue>
                <FieldActions>
                  <Button variant='primary' size='sm' onClick={() => setEditingJob(true)}>
                    <Typography as='span' size={2} weight='semiBold' color='white'>
                      수정
                    </Typography>
                  </Button>
                </FieldActions>
              </>
            )}
          </FieldLeft>
        </FieldCard>

        <FieldCard>
          {/* 합격 여부 */}
          <FieldLeft>
            <FieldLabel>합격여부</FieldLabel>
            {isLoading ? (
              <FieldValue style={{ flex: 1, textAlign: 'right' }}>
                <SkeletonText width='150px' />
              </FieldValue>
            ) : user?.passStatus === 'Y' ? (
              <>
                <FieldValue style={{ flex: 1, textAlign: 'right' }}>합격자입니다.</FieldValue>
                <FieldActions>
                  <Button variant='outline' size='sm' disabled style={{ opacity: 0.6 }}>
                    <Typography
                      as='span'
                      size={2}
                      weight='semiBold'
                      color={theme.colors.primary[7]}
                    >
                      신청
                    </Typography>
                  </Button>
                </FieldActions>
              </>
            ) : (
              <>
                <FieldValue style={{ flex: 1, textAlign: 'right' }}>
                  {user?.certStatus === 'PENDING' ? (
                    <Typography as='span' size={2} color={theme.colors.primary[8]}>
                      (신청 중입니다)
                    </Typography>
                  ) : user?.certStatus === 'REJECTED' ? (
                    <Typography as='span' size={2} color={theme.colors.error?.[9] ?? 'red'}>
                      (신청이 거부되었습니다)
                    </Typography>
                  ) : (
                    <Typography as='span' size={2} color={theme.colors.gray[10]}>
                      (합격자 증명 신청이 가능합니다)
                    </Typography>
                  )}
                </FieldValue>
                <FieldActions>
                  <Button variant='primary' size='sm' onClick={() => setOpenPhotoModal(true)}>
                    <Typography as='span' size={2} weight='semiBold' color='white'>
                      신청
                    </Typography>
                  </Button>
                </FieldActions>
              </>
            )}
          </FieldLeft>
        </FieldCard>
      </UnifiedCard>

      <Footer>
        <Button variant='outline' onClick={handleUserDelete}>
          회원 탈퇴
        </Button>
        <WithdrawlDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen} />
      </Footer>
      <PhotoSubmitDialog
        open={openPhotoModal}
        onOpenChange={setOpenPhotoModal}
        onSubmit={handlePhotoSubmit}
        onFilePick={handleFilePick}
      />
      <ErrorDialog open={errorOpen} onOpenChange={setErrorOpen} message={errorMsg} />
      <SuccessDialog open={successOpen} onOpenChange={setSuccessOpen} message={successMsg} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;

const Row = styled.div`
  margin-top: ${({ theme }) => theme.space[6]};
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Footer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[8]};
`;

// 페이지 상단 헤더
const MyPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
  padding-left: ${({ theme }) => theme.space[4]};
`;

const SkeletonText = styled.div`
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[3]} 25%,
    ${({ theme }) => theme.colors.gray[4]} 50%,
    ${({ theme }) => theme.colors.gray[3]} 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.3s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: -400px 0;
    }
    100% {
      background-position: 400px 0;
    }
  }
`;

export default MyInfo;
