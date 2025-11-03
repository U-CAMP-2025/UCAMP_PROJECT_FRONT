import Typography from '@components/common/Typography';
import * as Switch from '@radix-ui/react-switch';
import styled, { css, keyframes } from 'styled-components';

// --- [스타일 정의] ---

export const MainContentWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

// 1. 레이아웃 (사이드바 + 메인)
export const SimulationLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 7fr 2fr; /* (좌)3: (중앙)7: (우)3 비율 */
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 2. 좌측 사이드바
export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  height: fit-content;
`;

// 사이드바 버튼
export const SidebarButton = styled.button`
  all: unset;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};

  background-color: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[11]};
  border: 1px solid ${({ theme }) => theme.colors.primary[5]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[4]};
    border-color: ${({ theme }) => theme.colors.primary[6]};
  }
  &:focus:not(:disabled) {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[6]};
  }

  ${({ $variant }) =>
    $variant === 'danger' &&
    css`
      background-color: #fee2e2;
      color: #b91c1c;
      border-color: #fca5a5;

      &:hover:not(:disabled) {
        background-color: #fecaca;
      }
      &:focus:not(:disabled) {
        box-shadow: 0 0 0 3px #fca5a5;
      }
    `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[2]};
    color: ${({ theme }) => theme.colors.gray[7]};
    border-color: ${({ theme }) => theme.colors.gray[4]};
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// 3. 메인 콘텐츠 영역 (PIP를 위해 position: relative)
export const MainContent = styled.div`
  position: relative; /* 💡 PIP의 기준점 */
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

// 타이머, 카운터 포함 상단 바
export const TopInfoBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  border-radius: ${({ theme }) => theme.radius.md};
  color: white;
`;

export const TimerPill = styled.div`
  background: ${({ theme }) => theme.colors.gray[1]};
  color: ${({ theme }) => theme.colors.primary[9]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border-radius: 999px;
  font-weight: 700;
  min-width: 100px;
  text-align: center;
  font-size: ${({ theme }) => theme.font.size[5]}; /* 💡 4 -> 5 (20px)로 키움 */
`;

export const QuestionCounter = styled(Typography).attrs({ size: 4, weight: 'medium' })`
  color: ${({ theme }) => theme.colors.gray[1]};
  margin-left: auto;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LiveIndicator = styled(Typography).attrs({ size: 2, weight: 'bold' })`
  color: ${({ theme }) => theme.colors.gray[1]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};

  &::before {
    content: '●';
    font-size: 10px;
    color: #d93025;
    animation: ${spin} 1.5s linear infinite;
  }
`;

// InterviewerImage -> InterviewerVideo (기존 InterviewerImage 스타일 재사용)
export const InterviewerVideo = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.gray[3]};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserPipVideoWrapper = styled.div`
  position: absolute;

  // 기본 위치
  bottom: ${({ theme }) => theme.space[6]};
  right: ${({ theme }) => theme.space[6]};

  width: 500px;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[12]};
  border: 2px solid white;
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: 10;

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? 'scale(1)' : 'scale(0.9)')};
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  /* 드래그 커서 추가 */
  cursor: grab;
  &[data-dragging='true'] {
    cursor: grabbing;
    transition: none;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 150px;
    bottom: ${({ theme }) => theme.space[4]};
    right: ${({ theme }) => theme.space[4]};
  }
`;

// 3. 스크립트 패널
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  min-height: 40px;
`;
export const QuestionBadge = styled.span`
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.primary[9]};
  border: 1px solid ${({ theme }) => theme.colors.primary[6]};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  background-color: ${({ theme }) => theme.colors.primary[2]};
`;

export const QuestionText = styled(Typography).attrs({ as: 'h2', size: 5, weight: 'bold' })`
  color: ${({ theme }) => theme.colors.gray[12]};
`;

export const InterviewerImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.gray[3]};
`;

export const VideoRecorderWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[12]};
`;

// 3. 스크립트 패널
export const ScriptPanel = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[5]};
  background: ${({ theme }) => theme.colors.gray[2]};
  height: fit-content;
`;

export const ScriptLabel = styled(Typography).attrs({ size: 2, weight: 'medium' })`
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

export const ScriptQuestion = styled(Typography).attrs({ as: 'h3', size: 4, weight: 'bold' })`
  color: ${({ theme }) => theme.colors.gray[12]};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

export const ScriptAnswer = styled(Typography).attrs({ as: 'p', size: 3 })`
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${({ $hasContent, theme }) =>
    $hasContent ? theme.colors.gray[12] : theme.colors.gray[9]};
`;

// 4. Radix Switch 스타일
export const SwitchToggleWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  cursor: pointer;
  user-select: none;
`;

export const StyledSwitch = styled(Switch.Root)`
  all: unset;
  width: 40px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s ease;

  &[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.primary[9]};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;

export const StyledThumb = styled(Switch.Thumb)`
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(18px);
  }
`;

// 5. 녹음 목록 (임시 스타일)
export const RecordingListSection = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  padding-top: ${({ theme }) => theme.space[4]};
`;
export const StyledOL = styled.ol`
  padding-left: 20px;
  line-height: 1.9;
`;
export const StyledLI = styled.li`
  color: ${({ theme }) => theme.colors.gray[11]};
`;
export const DownloadLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[9]};
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
export const SessionVideoSection = styled(RecordingListSection)``;
export const StyledVideo = styled.video`
  width: 320px;
  border-radius: ${({ theme }) => theme.radius.md};
`;
