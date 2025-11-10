import Tag, { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import { BookmarkIcon, CommentIcon } from '@components/common/icons';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import { BookmarkFilledIcon, GlobeIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function QASetCard({ item, showPublicBadge = false, onClick }) {
  const navigate = useNavigate();
  const { isLogin } = useAuthStore();

  const {
    postId,
    job = [],
    title,
    description,
    bookCount = 0,
    review = 0,
    createAt,
    otherWriter,
    nickname,
    public: isPublic,
    me,
    payment,
    passed,
  } = item || {};

  const isBookmarked = !!otherWriter;
  const displayAuthor = otherWriter || nickname || '작성자 미표시';
  const createdLabel = createAt ? createAt.split('T')[0] : '';

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
      return;
    }

    if (isLogin) {
      navigate(`/qa/${postId}`);
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <>
      <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <Card onClick={handleCardClick} type='button' aria-label={`${title} 상세로 이동`}>
        {isBookmarked && (
          <BookmarkFloating>
            <BookmarkFilledIcon />
          </BookmarkFloating>
        )}

        <TopMetaRow>
          <BadgeGroup>
            {passed && <PassedBadge>합격자 셋</PassedBadge>}
            {payment && <PaidBadge>유료</PaidBadge>}
            {showPublicBadge && (
              <PublicBadge $public={isPublic}>
                {isPublic ? (
                  <>
                    <GlobeIcon /> 공개
                  </>
                ) : (
                  <>
                    <LockClosedIcon /> 비공개
                  </>
                )}
              </PublicBadge>
            )}
            {me && <OwnerBadge>내가 만든 셋</OwnerBadge>}
          </BadgeGroup>
        </TopMetaRow>

        {job.length > 0 && (
          <JobChips>
            {job.slice(0, 3).map((j) => (
              <JobChip key={j}>{j}</JobChip>
            ))}
            {job.length > 3 && <MoreChip>+{job.length - 3}</MoreChip>}
          </JobChips>
        )}

        <TitleBlock>
          <Typography as='h3' size={4} weight='semiBold'>
            {title}
          </Typography>
          <DescriptionText as='p' size={2}>
            {description || '설명이 아직 작성되지 않은 질문 셋입니다.'}
          </DescriptionText>
        </TitleBlock>

        <BottomRow>
          <AuthorDate>
            <Typography as='span' size={1}>
              {displayAuthor}
            </Typography>
            {createdLabel && (
              <Typography as='span' size={1}>
                · {createdLabel}
              </Typography>
            )}
          </AuthorDate>
          <Stats>
            <StatItem aria-label='스크랩 수'>
              <BookmarkIcon />
              <Typography as='span' size={1}>
                {bookCount}
              </Typography>
            </StatItem>
            <StatItem aria-label='리뷰 수'>
              <CommentIcon />
              <Typography as='span' size={1}>
                {review}
              </Typography>
            </StatItem>
          </Stats>
        </BottomRow>
      </Card>
    </>
  );
}

const Card = styled.article`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[7]};
    background-color: ${({ theme }) => theme.colors.primary[2]};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
`;

const TopMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const BadgeBase = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: 1.4;
`;

const PassedBadge = styled(BadgeBase)`
  background-color: ${({ theme }) => theme.colors.primary[2]};
  color: ${({ theme }) => theme.colors.primary[11]};
`;

const PaidBadge = styled(BadgeBase)`
  background-color: ${({ theme }) => theme.colors.gray[12]};
  color: #ffffff;
`;

const PublicBadge = styled(BadgeBase)`
  background-color: ${({ $public, theme }) =>
    $public ? theme.colors.primary[3] : theme.colors.gray[3]};
  color: ${({ $public, theme }) => ($public ? theme.colors.primary[11] : theme.colors.gray[11])};
`;

const OwnerBadge = styled(BadgeBase)`
  background-color: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.colors.gray[11]};
`;

const JobChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  // border: 1px solid red;
`;

const JobChip = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.primary[10]};
  background-color: ${({ theme }) => theme.colors.primary[2]};
`;

const MoreChip = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  color: ${({ theme }) => theme.colors.gray[10]};
  background-color: ${({ theme }) => theme.colors.gray[2]};
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DescriptionText = styled(Typography)`
  color: ${({ theme }) => theme.colors.gray[10]};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const AuthorDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const Stats = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StatItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray[9]};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.gray[10]};
  }
`;

const BookmarkFloating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ theme }) => theme.colors.primary[8]};
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    width: 20px;
    height: 20px;
  }
`;
