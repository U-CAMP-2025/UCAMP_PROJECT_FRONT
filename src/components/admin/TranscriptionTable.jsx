import { fetchTranscriptions } from '@api/adminAPIS';
import DataTable, { Pill } from '@components/common/DataTable';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

// Segmented control (same look & feel as UserMangeTable)
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
/**
 * TranscriptionTable
 * 공통 테이블 (닉네임, 이메일, 연습완료 시간, 변환 현황)
 * rows 형태 예시:
 * [{
 *   id: 'u1',
 *   nickName: '홍길동',
 *   email: 'abc@kakao.com',
 *   simulation: { completedAt: '2025-10-26 14:00' },
 *   status: '진행 중' | '완료' | 'PROCESSING' | 'COMPLETED'
 * }]
 */
export default function TranscriptionTable() {
  const [filter, setFilter] = useState('all');
  // const [rows, setRows] = useState([]);

  // 페이지 상태
  const [page, setPage] = useState(0); // 0-base
  const [size, setSize] = useState(20);
  const [sort] = useState('simulation_completed_at,desc');

  // 서버 응답
  const [content, setContent] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [number, setNumber] = useState(0); // 현재 페이지(0-base)
  const [loading, setLoading] = useState(false);

  // 1️⃣ 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      // try {
      //   const data = await fetchTranscriptions(); // 백엔드 요청
      //   // 백엔드 → 프론트 구조로 변환
      //   const mapped = data.map((item, index) => ({
      //     id: `u${index + 1}`,
      //     nickName: item.nickname,
      //     email: item.email,
      //     simulation: { completedAt: item.completedAt },
      //     status: item.status, // SUCCESS / INPROGRESS
      //   }));
      //   setRows(mapped);
      // } catch (err) {
      //   console.error('데이터 로드 실패:', err);
      // }
      setLoading(true);
      try {
        const data = await fetchTranscriptions({ page, size, sort });
        // data.content 를 테이블 행으로 매핑
        const mapped = (Array.isArray(data) ? data : (data.content ?? [])).map((item, index) => ({
          id: `p${page}-${index}`,
          nickName: item.nickname,
          email: item.email,
          simulation: { completedAt: item.completedAt },
          status: item.status,
        }));
        setContent(mapped);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
        setNumber(data.number ?? 0);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, size, sort]);

  // 상태 노멀라이즈 ('진행 중'/'완료' 한글 또는 영문 코드 모두 허용)
  const normalizeStatus = (s) => {
    if (!s) return 'unknown';
    if (s === '완료' || s === 'COMPLETED' || s === 'SUCCESS') return 'done';
    if (s === '진행 중' || s === 'PROCESSING' || s === 'IN_PROGRESS' || s === 'INPROGRESS')
      return 'inprogress';
    return 'unknown';
  };

  const inProgressCount = useMemo(
    () => content.filter((r) => normalizeStatus(r.status) === 'inprogress').length,
    [content],
  );
  const doneCount = useMemo(
    () => content.filter((r) => normalizeStatus(r.status) === 'done').length,
    [content],
  );

  const filteredRows = useMemo(() => {
    if (filter === 'inprogress')
      return content.filter((r) => normalizeStatus(r.status) === 'inprogress');
    if (filter === 'done') return content.filter((r) => normalizeStatus(r.status) === 'done');
    return content;
  }, [content, filter]);

  const statusPill = (s) => {
    const kind = normalizeStatus(s);
    if (kind === 'done') return <Pill $variant='success'>완료</Pill>;
    if (kind === 'inprogress') return <Pill $variant='primary'>진행 중</Pill>;
    return <Pill>알 수 없음</Pill>;
  };

  // 컬럼 정의 (재사용 DataTable)
  const columns = [
    { header: '닉네임', key: 'nickName', width: '160px' },
    { header: '이메일', key: 'email', width: '220px' },
    {
      header: '연습완료 시간',
      render: (row) => row?.simulation?.completedAt || row?.completedAt || '-',
      width: '200px',
      align: 'center',
    },
    {
      header: '변환 현황',
      render: (row) => statusPill(row.status),
      width: '140px',
      align: 'center',
    },
  ];

  return (
    <div>
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
          aria-label='변환 현황 필터'
        >
          <SegmentItem value='all'>전체 ({content.length})</SegmentItem>
          <SegmentItem value='inprogress'>진행 중 ({inProgressCount})</SegmentItem>
          <SegmentItem value='done'>완료 ({doneCount})</SegmentItem>
        </Segmented>

        {/* 페이지 크기 선택 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, opacity: 0.9 }}>Rows</span>
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRows}
        rowKey={(r) => r.id}
        loading={loading}
        emptyText='데이터가 없습니다.'
      />

      {/* 페이지네이션 바 */}
      <PaginationBar>
        <span>{`Total: ${totalElements}`}</span>
        <button disabled={number <= 0 || loading} onClick={() => setPage(0)}>
          ≪ First
        </button>
        <button
          disabled={number <= 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          ‹ Prev
        </button>
        <span>{`${number + 1} / ${Math.max(totalPages, 1)}`}</span>
        <button
          disabled={number >= totalPages - 1 || loading}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next ›
        </button>
        <button
          disabled={number >= totalPages - 1 || loading}
          onClick={() => setPage(totalPages - 1)}
        >
          Last ≫
        </button>
      </PaginationBar>
    </div>
  );
}
