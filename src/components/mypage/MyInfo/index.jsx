import { fetchJobList } from '@api/jobAPIS';
import {
  fetchUserMypage,
  patchUserJob,
  postUserPathPass,
  uploadCertificateImage,
} from '@api/userAPIS';
import Button from '@components/common/Button';
import ReadonlyInput from '@components/common/ReadOnlyInput';
import SearchableSelect from '@components/common/SearchableSelect';
import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FieldCard, FieldLeft, FieldLabel, FieldValue, FieldActions } from './FieldRow';
import PhotoSubmitDialog from './PhotoSubmitDialog';
import { WithdrawlDialog } from './WithdrawlDialog';

const MyInfo = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(1);

  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [fileName, setFileName] = useState('');

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const handlePhotoSubmit = async (file) => {
    try {
      // 이미지 업로드
      const { fileName } = await uploadCertificateImage(file);

      // 합격자 신청 (JWT로 user 식별)
      await postUserPathPass(fileName);

      alert('합격자 인증이 신청되었습니다.');
      setOpenPhotoModal(false);
    } catch (err) {
      console.error(err);
      alert('신청 중 오류가 발생했습니다.');
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
          jobName: data.job.jobName,
          passStatus: data.passStatus,
          status: data.status,
          userProfileImageUrl: '',
        });
        setSelectedJobId(data.job.jobId);
        console.log('유저 정보', user);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
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
      alert('관심 직무가 수정되었습니다.');
    } catch (err) {
      console.error('직무 수정 실패:', err);
      alert('직무 수정 중 오류가 발생했습니다.');
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
      <Row>
        {/* 닉네임 (수정 불가) */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='nick'>닉네임</FieldLabel>
            <ReadonlyInput
              id='nick'
              style={{
                width: '300px',
                marginLeft: 'auto',
                justifyContent: 'flex-start',
              }}
            >
              {user?.nickname}
            </ReadonlyInput>
          </FieldLeft>
        </FieldCard>
        {/* 이메일 (수정 불가) */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='email'>이메일</FieldLabel>
            <ReadonlyInput
              id='nick'
              style={{
                width: '300px',
                marginLeft: 'auto',
                justifyContent: 'flex-start',
              }}
            >
              {user?.email}
            </ReadonlyInput>
          </FieldLeft>
        </FieldCard>
        {/* 관심 직무 */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel>관심직무</FieldLabel>
            {editingJob ? (
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
                  style={{
                    fontSize: theme.font.size[2],
                  }}
                >
                  완료
                </Button>
              </div>
            ) : (
              <>
                <FieldValue style={{ flex: '1', textAlign: 'right' }}>
                  {jobs.find((j) => j.jobId === selectedJobId)?.name}
                </FieldValue>
                <FieldActions>
                  <button style={pillStyle} onClick={() => setEditingJob(true)}>
                    <Typography as='span' size={2} weight='semiBold'>
                      수정
                    </Typography>
                  </button>
                </FieldActions>
              </>
            )}
          </FieldLeft>
        </FieldCard>
        {/* 합격 여부 (합격자면 문구 노출, 신청 버튼 -> 사진 첨부 모달) */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel>합격 여부</FieldLabel>
            {user?.passStatus ? (
              <>
                <FieldValue style={{ flex: 1, textAlign: 'right' }}>합격자입니다</FieldValue>
                <FieldActions>
                  <button style={pillStyle} onClick={() => setOpenPhotoModal(true)}>
                    <Typography as='span' size={2} weight='semiBold'>
                      신청
                    </Typography>
                  </button>
                </FieldActions>
              </>
            ) : (
              <>
                <FieldValue style={{ flex: 1, textAlign: 'right' }} />
                <FieldActions>
                  {fileName && (
                    <Typography as='div' size={3}>
                      {fileName}
                    </Typography>
                  )}
                  <button style={pillStyle} onClick={() => setOpenPhotoModal(true)}>
                    <Typography as='span' size={2} weight='semiBold'>
                      신청
                    </Typography>
                  </button>
                </FieldActions>
              </>
            )}
          </FieldLeft>
        </FieldCard>
      </Row>
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
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

const pillStyle = {
  borderRadius: '10px',
  background: 'rgba(170,153,236,0.3)',
  padding: '0 12px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  border: '0',
};

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

export default MyInfo;
