import { fetchGetAllUser, patchUserPass } from '@api/adminAPIS';
import CertificateDialog from '@components/admin/CertificateDialog';
import DataTable, { Pill } from '@components/common/DataTable';
import ErrorDialog from '@components/common/ErrorDialog';
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
// Pagination Bar
const PaginationBar = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;

  button {
    border: 1px solid ${({ theme }) => theme.colors.gray[6]};
    background: #fff;
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 6px 10px;
    cursor: pointer;
  }
  span {
    color: ${({ theme }) => theme.colors.gray[11]};
  }
`;

// TODO: 합격 상태 변경 시 API 호출
export const UserManageTable = () => {
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort] = useState('createdAt,desc');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [number, setNumber] = useState(0);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const data = await fetchGetAllUser({ page, size, sort });
        const mapped = (data.content ?? []).map((user, index) => ({
          id: `p${data.number}-${index}`,
          userId: user.userId,
          nickName: user.nickname,
          email: user.email,
          job: user.jobName,
          passStatus: user.passStatus === 'Y' ? '합격자' : '구직자',
          status: '활성',
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
            certe_file_url: user.certFileUrl,
            certe_status: user.certStatus || null,
          },
        }));

        setRows(mapped);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
        setNumber(data.number ?? 0);
      } catch (e) {
        console.error('유저 데이터 로드 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, size, sort]);

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
    // {
    //   header: '연습 상태',
    //   render: (row) => <Typography size={2}>{row.simulationStatus || '-'}</Typography>,
    //   width: '140px',
    //   align: 'center',
    // },
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
                      passStatus: decision === 'APPROVED' ? '합격자' : '구직자',
                    }
                  : r,
              ),
            );

            setOpen(false);
            setTarget(null);
          } catch (e) {
            console.error('합격 상태 변경 실패:', e);
            setErrorMsg('합격 상태 변경 중 오류가 발생했습니다.');
            setErrorOpen(true);
          }
        }}
      />

      <DataTable loading={loading} columns={columns} rows={filteredRows} rowKey={(r) => r.id} />
      <PaginationBar>
        <span>{`전체: ${totalElements}개`}</span>
        <button disabled={number <= 0 || loading} onClick={() => setPage(0)}>
          ≪ 처음
        </button>
        <button
          disabled={number <= 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          ‹ 이전
        </button>
        <span>{`${number + 1} / ${Math.max(totalPages, 1)}`}</span>
        <button
          disabled={number >= totalPages - 1 || loading}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          다음 ›
        </button>
        <button
          disabled={number >= totalPages - 1 || loading}
          onClick={() => setPage(totalPages - 1)}
        >
          마지막 ≫
        </button>
      </PaginationBar>
      <ErrorDialog open={errorOpen} onOpenChange={setErrorOpen} message={errorMsg} />
    </div>
  );
};
