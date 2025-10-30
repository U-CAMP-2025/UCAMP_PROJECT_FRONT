import { fetchGetAllUser, patchUserPass } from '@api/adminAPIS';
import CertificateDialog from '@components/admin/CertificateDialog';
import DataTable, { Pill } from '@components/common/DataTable';
import Typography from '@components/common/Typography';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
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
  const [rows, setRows] = useState([]);

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

  // 1️⃣ 데이터 요청
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGetAllUser();

        // 2️⃣ 데이터 매핑
        const mapped = data.map((user, index) => ({
          id: user.userId,
          userId: user.userId, // PATCH에 쓸 진짜 아이디
          nickName: user.nickname,
          email: user.email,
          job: user.jobName,
          passStatus: user.passStatus === 'PASS' ? '합격자' : '구직자',
          status: '활성', // 백엔드에 없다면 기본값 지정
          createdAt: user.createdAt?.slice(0, 10) || '-',
          role: user.role === 'ADMIN' ? 'Admin' : 'User',
          simulationStatus:
            user.simulationStatus === 'SUCCESS'
              ? '완료'
              : user.simulationStatus === 'INPROGRESS'
                ? '진행중'
                : '-',
          simulation: {
            completedAt: user.simulationCompletedAt
              ? user.simulationCompletedAt.replace('T', ' ').slice(0, 16)
              : null,
          },
          certficate: {
            certe_req_date: user.certReqDate?.slice(0, 10) || '-',
            certe_trmt_date: user.certTrmtDate?.slice(0, 10) || '-',
            certe_status: user.certStatus || null, // PENDING / APPROVED / REJECTED 등
          },
        }));

        setRows(mapped);
      } catch (e) {
        console.error('유저 데이터 로드 실패:', e);
      }
    };
    loadData();
  }, []);

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
        onConfirm={async (decision) => {
          if (!target) return;

          try {
            // 1️⃣ 백엔드로 PATCH 요청
            await patchUserPass({
              userId: target.userId, // target에 userId가 포함되어 있어야 함
              passStatus: decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
            });

            // 2️⃣ 프론트 상태 업데이트
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
          } catch (e) {
            console.error('합격 상태 변경 실패:', e);
            alert('합격 상태 변경 중 오류가 발생했습니다.');
          }
        }}
      />

      <DataTable columns={columns} rows={filteredRows} rowKey={(r) => r.id} />
    </div>
  );
};
