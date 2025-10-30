import CertificateDialog from '@components/admin/CertificateDialog';
import DataTable, { Pill } from '@components/common/DataTable';
import Typography from '@components/common/Typography';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import styled from 'styled-components';

const Segmented = styled(ToggleGroup.Root)`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.gray[3]};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 4px;
  gap: 4px;
`;
const SegmentItem = styled(ToggleGroup.Item)`
  border: 0;
  background: transparent;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.gray[11]};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  &[data-state='on'] {
    background: #fff;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    color: ${({ theme }) => theme.colors.primary[11]};
  }
`;

// TODO: 합격 상태 변경 시 API 호출
export const UserManageTable = () => {
  const [rows, setRows] = useState([
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
        certe_status: null, // or '거부완료', '확인필요'
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
        certe_status: 'PENDING',
      },
      simulation: {
        completedAt: '',
      },
    },
    {
      id: 'u3',
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
        certe_status: 'REJECTED',
      },
      simulation: {
        completedAt: '',
      },
    },
    {
      id: 'u4',
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
        certe_status: 'APPROVED',
      },
      simulation: {
        completedAt: '',
      },
    },
  ]);

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'others'
  const pendingCount = rows.filter((r) => r.certficate?.certe_status === 'PENDING').length;
  const othersCount = rows.length - pendingCount;
  const filteredRows = rows.filter((r) => {
    if (filter === 'pending') return r.certficate?.certe_status === 'PENDING';
    if (filter === 'others') return r.certficate?.certe_status !== 'PENDING';
    return true; // all
  });

  const renderCertStatus = (certe_status, row) => {
    if (!certe_status) return '-';
    if (certe_status === 'APPROVED') return <Typography size={2}>승인완료</Typography>;
    if (certe_status === 'REJECTED') return <Typography size={2}>거부완료</Typography>;
    if (certe_status === 'PENDING') {
      return (
        <Pill
          as='button'
          type='button'
          $variant='primary'
          onClick={(e) => {
            e.stopPropagation();
            setTarget(row);
            setOpen(true);
          }}
          style={{ cursor: 'pointer', border: 'none' }}
        >
          확인하기
        </Pill>
      );
    }
    return '-';
  };

  const columns = [
    { header: '이메일', key: 'email', width: '200px' },
    { header: '닉네임', key: 'nickName', width: '140px' },
    { header: '직무', key: 'job', width: '120px' },
    {
      header: '시뮬레이션 상태',
      render: (row) => <Typography size={2}>{row.simulationStatus || '-'}</Typography>,
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
      render: (row) => renderCertStatus(row.certficate?.certe_status, row),
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

  return (
    <div style={{ paddingTop: 12, paddingBottom: 24 }}>
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Segmented
          type='single'
          value={filter}
          onValueChange={(v) => v && setFilter(v)}
          aria-label='인증 상태 필터'
        >
          <SegmentItem value='all'>전체 ({rows.length})</SegmentItem>
          <SegmentItem value='pending'>확인 필요 ({pendingCount})</SegmentItem>
          <SegmentItem value='others'>기타 ({othersCount})</SegmentItem>
        </Segmented>
      </div>

      <CertificateDialog
        open={open}
        onOpenChange={setOpen}
        user={target}
        onConfirm={(decision) => {
          if (!target) return;
          setRows((prev) =>
            prev.map((r) =>
              r.id === target.id
                ? {
                    ...r,
                    certficate: {
                      ...r.certficate,
                      certe_status: decision,
                      certe_trmt_date: new Date().toISOString().slice(0, 10),
                    },
                  }
                : r,
            ),
          );
          setOpen(false);
          setTarget(null);
        }}
      />

      <DataTable columns={columns} rows={filteredRows} rowKey={(r) => r.id} />
    </div>
  );
};
