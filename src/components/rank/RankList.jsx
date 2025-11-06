import { PersonIcon } from '@radix-ui/react-icons';
import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-spacing: 0;
`;
const TableHeader = styled.thead`
  background: #f4f0fe;
  /* underline the thead with matching color */
  tr {
    border-bottom: 1px solid #d9d9d9;
  }
`;
const HeaderRow = styled.tr`
  border-bottom: 1px solid #d9d9d9;
`;
const Th = styled.th`
  padding: 16px 20px; /* tighter padding to remove small white gaps */
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #202020;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #d9d9d9; /* underline for thead cells */
`;
const TableBody = styled.tbody``;
const Row = styled.tr`
  border-bottom: 1px solid #d9d9d9; /* tbody underline color */
  &:hover {
    background: #fafafa;
  }
  &:last-child {
    border-bottom: none;
  }
`;
const Td = styled.td`
  padding: 16px 20px; /* match Th for tighter layout */
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #d9d9d9; /* underline between rows */
`;
const PositionCell = styled(Td)`
  width: 60px;
  font-weight: 600;
  color: #666;
`;
const PlayerCell = styled(Td)``;
const TitleCell = styled(Td)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const BookmarkCell = styled(Td)`
  text-align: center;
  color: #666;
`;
const PassCell = styled(Td)`
  text-align: center;
`;
const PassBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${(props) => (props.passed ? '#E7F8ED' : '#F0F0F0')};
  color: ${(props) => (props.passed ? '#18794E' : '#667588')};
`;
const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const PlayerName = styled.div`
  font-weight: 500;
  color: #0066cc;
  cursor: pointer;
`;
const RankBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.color};
  color: white;
  font-size: 12px;
  font-weight: bold;
`;
const PlusCss = styled.span`
  margin-left: 6px;
`;

const RankingTable = ({ data, type, value }) => {
  const getMedalColor = (position) => {
    switch (position) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#ddd';
    }
  };

  const getRankBadge = (position) =>
    position <= 3 ? (
      <RankBadge color={getMedalColor(position)}>{position}</RankBadge>
    ) : (
      <PlusCss>{position}.</PlusCss>
    );

  return (
    <Table>
      <TableHeader>
        <HeaderRow>
          <Th>순위</Th>
          <Th>닉네임</Th>
          <Th>직무</Th>
          <Th style={{ textAlign: 'center' }}>{type === 'practice' ? '연습 횟수' : '북마크 수'}</Th>
          <Th style={{ textAlign: 'center' }}>합격자 여부</Th>
        </HeaderRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => (
          <Row key={`${user.userId}`}>
            <PositionCell>{getRankBadge(index + 1)}</PositionCell>
            <PlayerCell>
              <PlayerWrapper>
                <Avatar aria-hidden>
                  {user.profileImageUrl && user.profileImageUrl.startsWith('http') ? (
                    <img
                      src={user.profileImageUrl}
                      alt={`${user.nickname} 프로필 이미지`}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <PersonIcon width={20} height={20} color='#666' />
                  )}
                </Avatar>
                <PlayerInfo>
                  <PlayerName>{user.nickname}</PlayerName>
                </PlayerInfo>
              </PlayerWrapper>
            </PlayerCell>
            <TitleCell>{user.jobName}</TitleCell>
            <BookmarkCell>{user.cnt}</BookmarkCell>
            <PassCell>
              <PassBadge passed={user.passStatus === 'Y'}>
                {user.passStatus === 'Y' ? '합격자' : '구직자'}
              </PassBadge>
            </PassCell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default RankingTable;
