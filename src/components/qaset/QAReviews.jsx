import { deleteReview, fetchReviewList, postReview } from '@api/reviewAPIS';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';

import QAReviewForm from './QAReviewForm';

/**
 * QAReviews
 * 질문답변 상세 페이지 바깥에 표시되는 리뷰 섹션
 * props:
 *  - reviews: [{ reviewId, nickname, content, createdAt, profileImage }]
 *  - showForm?: boolean (default: false)
 *  - onSubmit?: (text: string) => void
 *  - onDelete?: (reviewId: number|string) => void
 */
// const sampleData = [
//   {
//     reviewId: 1,
//     nickname: '등록한 유저 닉네임',
//     content: '질문 셋에 대한 리뷰 내용',
//     createdAt: '2025-10-27T06:00:00Z',
//     profileImage: '이미지 url',
//   },
// ];
export const QAReviews = () => {
  const { qaId: postId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useContext(ThemeContext);
  const isLogin = useAuthStore((state) => state.isLogin);
  const authUser = useAuthStore((state) => state.user);

  const formUserProp = {
    nickname: authUser.name, // name -> nickname
    profileImage: authUser.profileImageUrl, // profileImageUrl -> profileImage
  };

  const count = reviews?.length ?? 0;

  // 1. API로 리뷰 목록 불러오기
  useEffect(() => {
    if (!postId) return;

    const loadReviews = async () => {
      try {
        const data = await fetchReviewList(postId);
        setReviews(data);
      } catch (error) {
        console.error('리뷰 목록을 불러오는 데 실패했습니다:', error);
      }
    };
    loadReviews();
  }, [postId]);

  // 리뷰 생성 핸들러
  const handleCreateReview = async (payload) => {
    if (!postId) return;

    setIsSubmitting(true);
    try {
      const newReview = await postReview(postId, payload);
      setReviews((prevReviews) => [...prevReviews, newReview]);
    } catch (error) {
      console.error('리뷰 등록에 실패했습니다:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (!postId) return;

    if (!window.confirm('이 리뷰를 정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(postId, reviewId);
      setReviews((prevReviews) => prevReviews.filter((r) => r.reviewId !== reviewId));
    } catch (error) {
      console.error('리뷰 삭제에 실패했습니다:', error);
      alert('리뷰 삭제에 실패했습니다. 본인이 작성한 리뷰인지 확인해주세요.');
    }
  };

  return (
    <Wrap>
      <Header>
        <Typography as='h2' size={6} weight='bold'>
          리뷰
        </Typography>
        <Typography size={2} weight='bold' color='primary.10'>
          {count}개
        </Typography>
      </Header>

      {isLogin && (
        <QAReviewForm
          onSubmit={handleCreateReview}
          isSubmitting={isSubmitting}
          user={formUserProp}
        />
      )}

      <List>
        {reviews.map((r) => (
          <Item key={r.reviewId}>
            <Avatar aria-hidden>
              {r.profileImage && r.profileImage.startsWith('http') ? (
                <img
                  src={r.profileImage}
                  alt=''
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <PersonIcon width={20} height={20} color={theme.colors.primary[10]} />
              )}
            </Avatar>

            <Body>
              <Meta>
                <Typography size={2} weight='semiBold'>
                  {r.nickname}
                </Typography>
                <Dot>•</Dot>
                <Typography size={2} color='gray.10'>
                  {formatDate(r.createdAt)}
                </Typography>
              </Meta>
              <Typography as='p' size={2} style={{ whiteSpace: 'pre-wrap' }}>
                {r.content}
              </Typography>
            </Body>

            <Button variant='ghost' onClick={() => handleDeleteReview(r.reviewId)}>
              삭제하기
            </Button>
          </Item>
        ))}
      </List>
    </Wrap>
  );
};

function formatDate(isoLike) {
  try {
    const d = new Date(isoLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  } catch (e) {
    return isoLike;
  }
}

// ===== styled =====
const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const Header = styled.div`
  display: flex;

  align-items: flex-end;
  gap: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fff;
  padding: ${({ theme }) => theme.space[5]};
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: ${({ theme }) => theme.space[2]};
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.gray[9]};
`;
