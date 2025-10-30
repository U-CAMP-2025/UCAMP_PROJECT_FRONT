import Tag, { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import { TrashIcon } from '@radix-ui/react-icons';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// TODO: 유저 자신의 QA셋인 경우에만 삭제 아이콘 노출
const sampleData = {
  postId: 1,
  job: ['웹개발', '프론트엔드 개발'],
  title: '질문답변셋 제목',
  nickname: '만든 유저 닉네임',
  description:
    '이 셋은 프론트엔드 신입 면접에서 자주 등장하는 질문을 모았습니다. 사전 학습 참고 링크와 답변 포인트를 함께 정리했습니다.',
  createAt: '2025.10.30',
  isPassed: true,
  isPublic: false,
  qa: [
    {
      qaId: 1,
      question: '리액트의 상태 관리 방법은 무엇이 있나요?',
      answer: 'Context, Redux, Zustand 등. 규모에 따라 선택하며, 서버 상태는 TanStack Query 권장.',
    },
    {
      qaId: 2,
      question: '브라우저 렌더링 과정에 대해 설명해주세요.',
      answer:
        'HTML 파싱 → DOM 생성, CSS 파싱 → CSSOM 생성, Render Tree → Layout → Paint → Composite.',
    },
  ],
};
export const QADetail = ({ onDelete }) => {
  const params = useParams();
  const qaId = params.qaId;
  const [qaData, setQaData] = useState(null);

  useEffect(() => {
    setQaData(sampleData);
  }, [qaId]);

  if (!qaData) return null;
  const { job = [], title, nickname, description, createAt, isPassed, qa = [] } = qaData;

  return (
    <Wrap>
      <HeaderRow>
        <div>
          <Typography as='h1' size={7} weight='bold'>
            {title}
          </Typography>
          <Meta>
            <Typography
              size={3}
              weight='semiBold'
              style={{
                color: theme.colors.gray[12],
              }}
            >
              만든 유저{' '}
            </Typography>
            <Typography
              size={3}
              style={{
                color: theme.colors.gray[12],
              }}
            >
              {nickname}
            </Typography>
            <Dot>•</Dot>
            <Typography
              size={3}
              weight='semiBold'
              style={{
                color: theme.colors.gray[12],
              }}
            >
              작성일
            </Typography>
            <Typography
              size={3}
              style={{
                color: (theme) => theme.colors.primary[11],
              }}
            >
              {createAt}
            </Typography>
            {isPassed && <PassBadge>합격자</PassBadge>}
            {!isPassed && <FailBadge>구직자</FailBadge>}
          </Meta>
        </div>
        <IconButton aria-label='삭제' onClick={onDelete}>
          <TrashIcon width={24} height={24} fill={true} />
        </IconButton>
      </HeaderRow>

      {job.length > 0 && (
        <FieldBox>
          <FieldLabel>직무 태그</FieldLabel>
          <TagGroup>
            {job.map((t, i) => (
              <Tag key={`${t}-${i}`}>#{t}</Tag>
            ))}
          </TagGroup>
        </FieldBox>
      )}

      <TextAreaBox>
        <Placeholder>설명</Placeholder>
        <Pre>{description || '설명이 없습니다.'}</Pre>
      </TextAreaBox>

      {qa.map((item, idx) => (
        <QABox key={item.qaId || idx}>
          <Placeholder>질문</Placeholder>
          <Pre>{item.question || '-'}</Pre>
          <Divider />
          <Placeholder>답변</Placeholder>
          <Pre>{item.answer || '-'}</Pre>
        </QABox>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[6]};
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.gray[9]};
`;

const IconButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.primary[10]};
  background: ${({ theme }) => theme.colors.primary[3]};
  &:hover {
    filter: brightness(0.98);
    cursor: pointer;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const PassBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  margin-left: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[11]};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const FailBadge = styled(PassBadge)`
  background: ${({ theme }) => theme.colors.gray[4]};
  color: ${({ theme }) => theme.colors.gray[10]};
`;

const FieldBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  background: #fff;
  display: flex;
  align-items: center;
`;

const FieldLabel = styled(Typography).attrs({ as: 'div', size: 2, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-right: ${({ theme }) => theme.space[4]};
`;

const TextAreaBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #fff;
  padding: ${({ theme }) => theme.space[4]};
`;

const QABox = styled(TextAreaBox)`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[6]};
  margin: ${({ theme }) => theme.space[2]} 0;
`;

const Placeholder = styled(Typography).attrs({
  as: 'div',
  size: 2,
  color: theme.colors.gray[11],
  weight: 'semiBold',
})``;

const Pre = styled.pre`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[2]};
  line-height: ${({ theme }) => theme.font.lineHeight[4]};
  white-space: pre-wrap;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.gray[12]};
`;
