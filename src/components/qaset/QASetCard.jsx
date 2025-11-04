import Tag, { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import { BookmarkIcon, CommentIcon } from '@components/common/icons';
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

export default function QASetCard({ item }) {
  const navigate = useNavigate();
  const theme = useTheme(); // 테마 객체 가져오기

  // OTHER_WRITER prop 추가
  const {
    postId,
    job = [],
    title,
    description,
    bookCount = 0,
    review = 0,
    createAt,
    otherWriter,
  } = item || {};

  // OTHER_WRITER 값이 있으면 true (북마크된 게시글)
  const isBookmarked = !!otherWriter;

  return (
    <Card
      onClick={() => navigate(`/qa/${postId}`)}
      role='button'
      aria-label={`${title} 상세로 이동`}
    >
      {/* 북마크 아이콘 추가 */}
      <CardContentWrapper>
        {isBookmarked && (
          <BookmarkRibbon>
            <BookmarkFilledIcon />
          </BookmarkRibbon>
        )}
        {/* 태그 + 상태 배지 */}
        <TopRow>
          {job.length > 0 && (
            <TagGroup>
              {job.map((jobName) => (
                <Tag key={jobName}>{jobName}</Tag>
              ))}
            </TagGroup>
          )}
          {/* {isMe && <Badge>내 질문</Badge>}{isPass && <Badge>합격자</Badge>} */}
        </TopRow>
        <Divider />
        {/* 제목 + 설명 */}
        <Typography as='h3' size={3} weight='semiBold'>
          제목
        </Typography>
        <Typography as='p' size={3} weight='bold' style={{ marginTop: 8 }}>
          {title}
        </Typography>
        <>
          <Typography as='h4' size={3} weight='bold' style={{ marginTop: 16 }}>
            설명
          </Typography>

          <DescriptionText as='p' size={3} weight='regular'>
            {description || '설명 없음'}
          </DescriptionText>
        </>
        {/* 생성일 + 작성자 */}
        <div style={{ marginTop: 16, flexGrow: 1 }}>
          <Typography as='h4' size={3} weight='bold'>
            생성일
          </Typography>
          <Typography as='p' size={2} weight='regular' style={{ marginTop: 6 }}>
            {createAt.split('T')[0]}
          </Typography>
          {/* 북마크된 글일 경우 원작자 표시 (선택 사항)
          {isBookmarked && (
            <Typography
              as='p'
              size={1}
              weight='regular'
              style={{ marginTop: 4, color: theme.colors.gray[9] }}
            >
              가져온 글 (From: {otherWriter})
            </Typography>
          )} */}
        </div>
      </CardContentWrapper>
      <Divider />
      {/* 푸터(아이콘/숫자 표시) */}
      <Footer>
        <IconStat aria-label='북마크 수'>
          <BookmarkIcon />
          <Typography as='span' size={3}>
            {bookCount}
          </Typography>
        </IconStat>
        <IconStat aria-label='리뷰 수'>
          <CommentIcon />
          <Typography as='span' size={3}>
            {review}
          </Typography>
        </IconStat>
      </Footer>
    </Card>
  );
}

const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #fff;
  padding: ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    box-shadow 0.2s ease,
    transform 0.02s ease,
    border-color 0.2s ease;
  cursor: pointer;
  position: relative;

  display: flex;
  flex-direction: column;
  min-height: 400px;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: ${({ theme }) => theme.colors.gray[8]};
  }
  &:active {
    transform: translateY(1px);
  }
`;

const CardContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
  min-height: 68px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  background: ${({ theme }) => theme.colors.gray[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
`;

// 북마크 리본 아이콘 스타일
const BookmarkRibbon = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;

  color: ${({ theme }) => theme.colors.primary[9]};
  z-index: 2; /* 태그(TopRow)보다 위에 보이도록 설정 */

  svg {
    width: 50px;
    height: 50px;
  }
`;

const DescriptionText = styled(Typography)`
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 40px;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  margin: ${({ theme }) => theme.space[5]} 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[6]};
`;

const IconStat = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.gray[11]};
  user-select: none;
`;

const ArrowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[11]};
  width: 28px;
  height: 28px;
`;
