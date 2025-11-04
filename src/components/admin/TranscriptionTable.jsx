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
  const [filter, setFilter] = useState('all'); // 'all' | 'inprogress' | 'done'
  const [rows, setRows] = useState([]);

  // 1️⃣ 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTranscriptions(); // 백엔드 요청
        // 백엔드 → 프론트 구조로 변환
        const mapped = data.map((item, index) => ({
          id: `u${index + 1}`,
          nickName: item.nickname,
          email: item.email,
          simulation: { completedAt: item.completedAt },
          status: item.status, // SUCCESS / INPROGRESS
        }));
        setRows(mapped);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };
    loadData();
  }, []);

  // 상태 노멀라이즈 ('진행 중'/'완료' 한글 또는 영문 코드 모두 허용)
  const normalizeStatus = (s) => {
    if (!s) return 'unknown';
    if (s === '완료' || s === 'COMPLETED' || s === 'SUCCESS') return 'done';
    if (s === '진행 중' || s === 'PROCESSING' || s === 'IN_PROGRESS' || s === 'INPROGRESS')
      return 'inprogress';
    return 'unknown';
  };

  const inProgressCount = useMemo(
    () => rows.filter((r) => normalizeStatus(r.status) === 'inprogress').length,
    [rows],
  );
  const doneCount = useMemo(
    () => rows.filter((r) => normalizeStatus(r.status) === 'done').length,
    [rows],
  );

  const filteredRows = useMemo(() => {
    if (filter === 'inprogress')
      return rows.filter((r) => normalizeStatus(r.status) === 'inprogress');
    if (filter === 'done') return rows.filter((r) => normalizeStatus(r.status) === 'done');
    return rows;
  }, [rows, filter]);

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
          <SegmentItem value='all'>전체 ({rows.length})</SegmentItem>
          <SegmentItem value='inprogress'>진행 중 ({inProgressCount})</SegmentItem>
          <SegmentItem value='done'>완료 ({doneCount})</SegmentItem>
        </Segmented>
      </div>

      <DataTable columns={columns} rows={filteredRows} rowKey={(r) => r.id} />
    </div>
  );
}
