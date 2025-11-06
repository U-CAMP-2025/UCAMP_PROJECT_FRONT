import Tag, { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import { BookmarkIcon, CommentIcon } from '@components/common/icons';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

export default function QASetCard({ item }) {
  const navigate = useNavigate();
  const theme = useTheme(); // 테마 객체 가져오기
  const { isLogin } = useAuthStore();

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

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (isLogin) {
      navigate(`/qa/${postId}`);
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <>
      <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <Card onClick={handleCardClick} role='button' aria-label={`${title} 상세로 이동`}>
        {isBookmarked && (
          <BookmarkIconWrapper>
            <BookmarkFilledIcon /> {/* 채워진 아이콘 사용 */}
          </BookmarkIconWrapper>
        )}
        <HeaderBar>
          <TopRow>
            {job.length > 0 && (
              <TagGroup>
                {job.map((jobName) => (
                  <Tag key={jobName}>{jobName}</Tag>
                ))}
              </TagGroup>
            )}
          </TopRow>
        </HeaderBar>

        {/* 메인 콘텐츠 */}
        <CardContentWrapper>
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
          <div style={{ marginTop: 16, flexGrow: 1 }}>
            <Typography as='h4' size={3} weight='bold'>
              생성일
            </Typography>
            <Typography as='p' size={2} weight='regular' style={{ marginTop: 6 }}>
              {createAt.split('T')[0]}
            </Typography>
          </div>
        </CardContentWrapper>

        <Divider />

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
    </>
  );
}

const Card = styled.article`
  border: 1px solid #e8e5d9;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  position: relative;

  display: flex;
  flex-direction: column;
  min-height: 400px;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
    border-color: #e8e5d9;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const HeaderBar = styled.div`
  background: ${({ theme }) => theme.colors.primary[5]};
  border-radius: ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl} 0 0;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};

  height: 90px;

  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;

  & ${Tag} {
    background: rgba(255, 255, 255, 0.7);
    color: #6d5b18;
    border: none;
    font-weight: ${({ theme }) => theme.font.weight.regular};

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }
`;

const CardContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[5]};
  background: #ffffff;
`;

const DescriptionText = styled(Typography)`
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 40px;
  color: #6a675e;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  margin: 0 ${({ theme }) => theme.space[5]};

  background: #ffffff;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[6]};
  background: #ffffff;
  border-radius: 0 0 ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl};
`;

const IconStat = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.gray[11]};
  user-select: none;
`;

const BookmarkIconWrapper = styled.div`
  position: absolute;
  top: -12px;
  right: 7px;
  z-index: 3;
  color: ${({ theme }) => theme.colors.primary[8]};
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  ${Card}:hover & {
    transform: translateY(-4px);
  }
  ${Card}:active & {
    transform: translateY(1px);
  }

  & svg {
    width: 1em;
    height: 1em;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
`;
