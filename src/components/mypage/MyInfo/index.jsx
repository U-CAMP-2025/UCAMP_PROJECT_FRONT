import { fetchJobList } from '@api/jobAPIS';
import { fetchUserMypage } from '@api/userAPIS';
import Button from '@components/common/Button';
import ReadonlyInput from '@components/common/ReadOnlyInput';
import SearchableSelect from '@components/common/SearchableSelect';
import Typography from '@components/common/Typography';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FieldCard, FieldLeft, FieldLabel, FieldValue, FieldActions } from './FieldRow';
import PhotoSubmitDialog from './PhotoSubmitDialog';

const initialUserState = {
  nickName: '유저 닉네임',
  email: 'user@email.com',
  job: '',
  passStatus: false,
  userProfileImageUrl: '',
};
const MyInfo = () => {
  const [user, setUser] = useState(initialUserState);
  const [jobs, setJobs] = useState([
    {
      jobId: 1,
      name: '프론트엔드 개발자',
    },
    {
      jobId: 2,
      name: '백엔드 개발자',
    },
  ]);
  const [selectedJobId, setSelectedJobId] = useState(1);

  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [fileName, setFileName] = useState('');

  const handlePhotoSubmit = async () => {
    setOpenPhotoModal(false);
  };

  useEffect(() => {
    // fetchUserMypage()
    //   .then((response) => setUser(response?.data || initialUserState))
    //   .catch(() => setUser(initialUserState));
    // fetchJobList()
    //   .then((response) => setJobs(response?.data || []))
    //   .catch(() => setJobs([]));
  }, []);

  const handleFilePick = (file) => {
    setFileName(file.name);
  };

  return (
    <Container>
      <Typography as='h1' size={7} weight='bold'>
        내 정보
      </Typography>
      <Row>
        {/* 닉네임 (수정 불가) */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='nick'>닉네임</FieldLabel>
            <ReadonlyInput id='nick' style={{ width: '85%' }}>
              {user?.nickName}
            </ReadonlyInput>
          </FieldLeft>
        </FieldCard>
        {/* 이메일 (수정 불가) */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel htmlFor='email'>이메일</FieldLabel>
            <ReadonlyInput id='email' style={{ width: '85%' }}>
              {user?.email}
            </ReadonlyInput>
          </FieldLeft>
        </FieldCard>
        {/* 관심 직무 */}
        <FieldCard>
          <FieldLeft>
            <FieldLabel>관심직무</FieldLabel>
            {editingJob ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'left' }}>
                <SearchableSelect
                  value={selectedJobId}
                  onChange={(id) => setSelectedJobId(id)}
                  options={jobs}
                  placeholder='직무 선택'
                />
                <Button variant='outline' onClick={() => setEditingJob(false)}>
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
                <FieldValue>합격자입니다</FieldValue>
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
                <FieldValue />
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
        <Button>수정 완료</Button>
        <Button variant='outline'>회원 탈퇴</Button>
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
  borderRadius: '999px',
  background: 'rgba(170,153,236,0.3)',
  padding: '0 12px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  border: '0',
};

export default MyInfo;
