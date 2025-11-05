import { copyPost, delPost, getPost } from '@api/postAPIS';
import { Overlay, Content, Title, Description } from '@components/common/Dialog';
import Tag, { TagGroup } from '@components/common/Tag';
import Typography from '@components/common/Typography';
import { BookmarkIcon } from '@components/common/icons';
// 🧩 다이얼로그 관련 import
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import theme from '@styles/theme';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

// ✅ 너가 준 다이얼로그 파일

// TODO: 유저 자신의 QA셋인 경우에만 삭제 아이콘 노출
export const QADetail = () => {
  const params = useParams();
  const qaId = params.qaId;
  const [qaData, setQaData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPost(qaId)
      .then((resp) => {
        setQaData(resp?.data ?? null);
      })
      .catch(() => setQaData([]));
  }, [qaId]);

  const onUpdate = () => {
    navigate('/qa/update', { state: { qaId } });
  };

  const onCopy = () => {
    copyPost(qaId)
      .then(() => {
        setIsCopyModalOpen(true);
      })
      .catch();
  };

  const onDeleteConfirm = () => {
    delPost(qaId)
      .then(() => {
        setOpenDeleteModal(false);
        navigate('/myqa');
      })
      .catch();
  };

  if (!qaData) return null;
  const {
    job = [],
    title,
    nickname,
    description,
    createAt,
    isPassed,
    qa = [],
    me,
    otherWriter,
  } = qaData;
  const dateOnly = createAt ? createAt.split('T')[0] : '';

  return (
    <Wrap>
      <HeaderRow>
        <div>
          <Typography as='h1' size={7} weight='bold'>
            {title}
          </Typography>
          <Meta>
            <Typography size={3} weight='semiBold' style={{ color: theme.colors.gray[12] }}>
              만든 유저
            </Typography>
            <Typography size={3} style={{ color: theme.colors.gray[12] }}>
              {nickname}
            </Typography>
            <Dot>•</Dot>
            <Typography size={3} weight='semiBold' style={{ color: theme.colors.gray[12] }}>
              작성일
            </Typography>
            <Typography size={3} style={{ color: theme.colors.primary[11] }}>
              {dateOnly}
            </Typography>
            {isPassed && <PassBadge>합격자</PassBadge>}
            {!isPassed && <FailBadge>구직자</FailBadge>}
          </Meta>
          {otherWriter && (
            <Typography
              as='p'
              size={1}
              weight='regular'
              style={{ marginTop: 4, color: theme.colors.gray[9] }}
            >
              스크랩한 글 (From: {otherWriter})
            </Typography>
          )}
        </div>

        <div>
          {!me && (
            <IconButton1
              aria-label='북마크'
              onClick={onCopy}
              title='현재 면접 노트를 나의 면접 노트로 스크랩합니다.'
            >
              <BookmarkIcon />
            </IconButton1>
          )}
          {me && (
            <>
              <IconButton1 aria-label='수정' onClick={onUpdate}>
                <Pencil1Icon width={24} height={24} fill='true' />
              </IconButton1>
              <IconButton2 aria-label='삭제' onClick={() => setOpenDeleteModal(true)}>
                <TrashIcon width={24} height={24} fill='true' />
              </IconButton2>
            </>
          )}
        </div>
      </HeaderRow>

      {/* ✅ 삭제 확인 다이얼로그 */}
      <Dialog.Root open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <Dialog.Portal>
          <Overlay />
          <Content>
            <Title>면접 노트 삭제</Title>
            <Description>
              정말로 이 노트를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </Description>
            <ButtonRow>
              <DeleteButton onClick={onDeleteConfirm}>삭제</DeleteButton>
              <Dialog.Close asChild>
                <CancelButton>취소</CancelButton>
              </Dialog.Close>
            </ButtonRow>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <Dialog.Portal>
          <Overlay />
          <Content>
            <Title>스크랩 완료</Title>
            <Description>나의 면접 노트에 스크랩되었습니다.</Description>
            <ButtonRow>
              <Dialog.Close asChild>
                <ConfirmButton>확인</ConfirmButton>
              </Dialog.Close>
            </ButtonRow>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>

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
          <Placeholder>질문{idx + 1}</Placeholder>
          <Pre>{item.question || '-'}</Pre>
          <Divider />
          <Placeholder>답변{idx + 1}</Placeholder>
          <Pre>{item.answer || '-'}</Pre>
        </QABox>
      ))}
    </Wrap>
  );
};

/* ----------------------------- 스타일 ----------------------------- */
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

const IconButton1 = styled.button`
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
    filter: brightness(0.95);
    cursor: pointer;
  }
  &:active {
    transform: translateY(1px);
  }
  margin-right: 10px;
`;

const IconButton2 = styled(IconButton1)``;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const CancelButton = styled.button`
  all: unset;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.gray[4]};
  color: ${({ theme }) => theme.colors.gray[12]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  &:hover {
    background: ${({ theme }) => theme.colors.gray[5]};
  }
`;

const DeleteButton = styled(CancelButton)`
  background: ${({ theme }) => theme.colors.primary[10]};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.colors.primary[11]};
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

const ConfirmButton = styled(DeleteButton)``;
