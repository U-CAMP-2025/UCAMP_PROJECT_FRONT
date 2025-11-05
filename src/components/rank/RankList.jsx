import { PersonIcon } from '@radix-ui/react-icons';
import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
`;
const HeaderRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`;
const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const TableBody = styled.tbody``;
const Row = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:hover {
    background: #fafafa;
  }
  &:last-child {
    border-bottom: none;
  }
`;
const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333;
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
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.passed ? '#e8f5e9' : '#fef3e9')};
  color: ${(props) => (props.passed ? '#2e7d32' : '#f57c00')};
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
  &:hover {
    text-decoration: underline;
  }
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

const RankingTable = ({ data, type }) => {
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
          <Th style={{ textAlign: 'center' }}>{type === 'practice' ? '연습횟수' : '북마크수'}</Th>
          <Th style={{ textAlign: 'center' }}>합격자여부</Th>
        </HeaderRow>
      </TableHeader>
      <TableBody>
        {data.map((player, index) => (
          <Row key={`${player.userId}`}>
            <PositionCell>{getRankBadge(index + 1)}</PositionCell>
            <PlayerCell>
              <PlayerWrapper>
                <Avatar aria-hidden>
                  {player.profileImageUrl && player.profileImageUrl.startsWith('http') ? (
                    <img
                      src={player.profileImageUrl}
                      alt={`${player.nickname} 프로필 이미지`}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <PersonIcon width={20} height={20} color='#666' />
                  )}
                </Avatar>
                <PlayerInfo>
                  <PlayerName>{player.nickname}</PlayerName>
                </PlayerInfo>
              </PlayerWrapper>
            </PlayerCell>
            <TitleCell>{player.jobName}</TitleCell>
            <BookmarkCell>{player.cnt}</BookmarkCell>
            <PassCell>
              <PassBadge passed={player.passStatus === 'Y'}>
                {player.passStatus === 'Y' ? '합격' : '불합격'}
              </PassBadge>
            </PassCell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default RankingTable;
