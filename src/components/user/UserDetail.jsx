import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import {
  CSS2,
  Header2,
  Container,
  ProfileCard,
  ProfileLeft,
  ProfileRight,
  Avatar,
  Name,
  Subtitle,
  InfoItem,
  InfoItemRight,
  Icon,
  InfoContent,
  InfoContentRight,
  InfoLabel,
  InfoValue,
  Tag,
  Tag2,
  PostBox,
  PostHeader,
  PostTitle,
  PostJob,
  PostJobs,
  PostFooter,
  PostMeta,
} from '@pages/User/styles';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BookmarkIcon = (props) => (
  <svg width='22' height='22' viewBox='0 0 24 24' fill='none' {...props}>
    <path
      d='M7 4h10a1 1 0 0 1 1 1v14l-6-3-6 3V5a1 1 0 0 1 1-1z'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinejoin='round'
    />
  </svg>
);

export const CommentIcon = (props) => (
  <svg width='22' height='22' viewBox='0 0 24 24' fill='none' {...props}>
    <path
      d='M7 17l-3 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7z'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinejoin='round'
    />
  </svg>
);

export default function UserDetail({ user }) {
  // use passed-in user prop; fallback to empty object to avoid crashes
  const u = user || {};
  const posts = Array.isArray(u.posts) ? u.posts : [];
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { isLogin } = useAuthStore();
  const navigate = useNavigate();
  const handleCardClick = (postId) => {
    if (isLogin) {
      navigate(`/qa/${postId}`);
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <>
      <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <Container>
        <ProfileCard>
          <ProfileLeft>
            <Avatar src={u.userImageUrl} alt={u.nickname || 'profile'} />
            <Name>{u.nickname || '사용자'}</Name>
          </ProfileLeft>

          <ProfileRight>
            <InfoItemRight>
              <Icon>📧</Icon>
              <InfoContentRight>
                <InfoLabel>이메일</InfoLabel>
                <InfoValue>{u.email || '-'}</InfoValue>
              </InfoContentRight>
            </InfoItemRight>

            <InfoItemRight>
              <Icon>💼</Icon>
              <InfoContentRight>
                <InfoLabel>관심직무</InfoLabel>
                <Tag color='purple'>{u.jobName || '-'}</Tag>
              </InfoContentRight>
            </InfoItemRight>

            <InfoItemRight>
              <Icon>✅</Icon>
              <InfoContentRight>
                <InfoLabel>합격여부</InfoLabel>
                <Tag2 passed={u.passStatus === 'Y'}>
                  {u.passStatus === 'Y' ? '합격자' : '구직자'}
                </Tag2>
              </InfoContentRight>
            </InfoItemRight>
          </ProfileRight>
        </ProfileCard>

        {posts.map((p) => (
          <PostBox key={p.postId} onClick={() => handleCardClick(p.postId)} role='button'>
            <PostHeader>
              <PostTitle>{p.postTitle || p.postTitle}</PostTitle>
              {/* render each job as its own badge */}
              {Array.isArray(p.jobs) && p.jobs.length > 0 ? (
                <PostJobs>
                  {p.jobs.map((j) => (
                    <PostJob key={j.jobId ?? j.jobName}>{j.jobName}</PostJob>
                  ))}
                </PostJobs>
              ) : (
                <PostJob>{p.job || '-'}</PostJob>
              )}
            </PostHeader>
            <PostFooter>
              <PostMeta>
                <CommentIcon />
                리뷰 {p.reviewCount ?? 0}
              </PostMeta>
              <PostMeta>
                <BookmarkIcon /> 스크랩 {p.bookmarkCount ?? 0}
              </PostMeta>
              <PostMeta>🗓 {p.postCreatedAt ?? '-'}</PostMeta>
            </PostFooter>
          </PostBox>
        ))}
      </Container>
    </>
  );
}
