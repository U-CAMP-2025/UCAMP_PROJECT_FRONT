import { PageContainer } from '@components/layout/PageContainer';
import QASetList from '@components/qaset/QASetList';

const qaList = [
  {
    postId: 1,
    nickname: '댄싱다람쥐',
    job: ['웹개발', '프론트엔드 개발', '백엔드 개발'],
    title: 'Q/A SET',
    description: '기술면접 질문 모음',
    bookCount: 20, // 전체 조회에서 사용
    review: 13, // 전체 조회에서 사용
    createAt: '2025.10.30',
    isMe: true, // 나의 질문에서만 사용
    isPass: false, // 전체 조회에서 사용
  },
  {
    postId: 2,
    nickname: '댄싱다람쥐',
    job: ['웹개발'],
    title: 'Q/A SET',
    description: '기술면접 질문 모음',
    bookCount: 20, // 전체 조회에서 사용
    review: 13, // 전체 조회에서 사용
    createAt: '2025.10.30',
    isMe: true, // 나의 질문에서만 사용
    isPass: false, // 전체 조회에서 사용
  },
  {
    postId: 3,
    nickname: '댄싱다람쥐',
    job: ['웹개발', '프론트엔드 개발'],
    title: 'Q/A SET',
    description: '기술면접 질문 모음',
    bookCount: 20, // 전체 조회에서 사용
    review: 13, // 전체 조회에서 사용
    createAt: '2025.10.30',
    isMe: true, // 나의 질문에서만 사용
    isPass: false, // 전체 조회에서 사용
  },
];
export default function QAListPage() {
  return (
    <PageContainer header footer>
      <QASetList qaList={qaList} />
    </PageContainer>
  );
}
