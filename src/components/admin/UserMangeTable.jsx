import Button from '@components/common/Button';
import DataTable, { Pill } from '@components/common/DataTable';
import Typography from '@components/common/Typography';

const data = [
  {
    id: 'u1',
    nickName: '홍길동',
    email: 'abc@kakao.com',
    job: '프론트엔드',
    passStatus: '합격자', // or '미합격'
    status: '활성', // or '비활성'
    createdAt: '2025-10-25',
    role: 'User',
    simulationStatus: '완료', // or '진행중'
    certficate: {
      certe_req_date: '2025-10-27',
      certe_trmt_date: '2025-10-28',
      certe_status: '승인완료', // or '거부완료', '확인필요'
    },
    simulation: {
      completedAt: '2025-10-26 14:00',
    },
  },
  {
    id: 'u2',
    nickName: '김길동',
    email: 'def@kakao.com',
    job: '백엔드',
    passStatus: '미합격',
    status: '비활성',
    createdAt: '2025-10-20',
    role: 'Admin',
    simulationStatus: '진행중',
    certficate: {
      certe_req_date: '2025-10-21',
      certe_trmt_date: '',
      certe_status: '확인필요',
    },
    simulation: {
      completedAt: '',
    },
  },
];

export const UserManageTable = () => {
  const renderCertStatus = (certe_status) => {
    switch (certe_status) {
      case '승인완료':
        return <Typography size={3}>승인완료</Typography>;
      case '거부완료':
        return <Typography size={3}>거부완료</Typography>;
      default:
        return <Pill $variant='primary'>확인하기</Pill>;
    }
  };

  const columns = [
    { header: '이메일', key: 'email', width: '200px' },
    { header: '닉네임', key: 'nickName', width: '140px' },
    { header: '직무', key: 'job', width: '120px' },
    {
      header: '시뮬레이션 상태',
      render: (row) => <Typography size={3}>{row.simulationStatus || '-'}</Typography>,
      width: '140px',
      align: 'center',
    },
    {
      header: '합격 여부',
      render: (row) => (
        <Pill $variant={row.passStatus === '합격자' ? 'success' : 'neutral'}>
          {row.passStatus || '-'}
        </Pill>
      ),
      width: '120px',
      align: 'center',
    },
    {
      header: '인증 상태',
      render: (row) => renderCertStatus(row.certficate?.certe_status),
      width: '140px',
      align: 'center',
    },
    {
      header: '가입일',
      key: 'createdAt',
      width: '120px',
      align: 'center',
    },
    {
      header: '계정 상태',
      key: 'status',
      width: '100px',
      align: 'center',
    },
  ];

  const onSelectionChange = (ids) => {
    console.log('선택된 사용자 ID:', ids);
  };

  return (
    <div style={{ paddingTop: 12, paddingBottom: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Button variant='outline'>선택 승인</Button>
        <Button variant='outline'>선택 거부</Button>
        <Button variant='outline'>엑셀 내보내기</Button>
      </div>

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(r) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};
