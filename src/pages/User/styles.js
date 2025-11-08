import styled from 'styled-components';

export const CSS2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  margin-top: 20px;
`;

export const Header2 = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #000000;
  width: 820px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px 20px 40px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  @media (max-width: 968px) {
    font-size: 48px;
  }

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

export const ProfileCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  border: 1px solid #e0d7ff;
  border-radius: 20px;
  width: 100%;
  max-width: 820px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow:
    0 1px 6px rgba(98, 54, 255, 0.12),
    0 1px 6px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 60px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
  }
`;

export const ProfileLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const ProfileRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid #ede6ff;
`;

export const Name = styled.h2`
  color: #000000;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #000;
  font-size: 14px;
  margin: 0;
`;

export const InfoCard = styled.div`
  width: 820px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  border: 1px solid #e0d7ff;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 20px;
  box-shadow:
    0 1px 6px rgba(98, 54, 255, 0.12),
    0 1px 6px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Icon = styled.span`
  font-size: 22px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 오른쪽 정렬 전용 아이템 (ProfileRight 내부에 사용)
export const InfoItemRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  margin-left: 300px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const InfoContentRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const InfoLabel = styled.p`
  font-size: 14px;
  color: #6f48f2;
  margin: 0;
  font-weight: 600;
`;

export const InfoValue = styled.p`
  font-size: 15px;
  color: #333;
  margin: 0;
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: ${(props) =>
    props.color === 'green' ? '#37cc78' : props.color === 'purple' ? '#a275ff' : '#999'};
  box-shadow: 0 1px 6px
    ${(props) =>
      props.color === 'green'
        ? 'rgba(55, 204, 120, 0.3)'
        : props.color === 'purple'
          ? 'rgba(162, 117, 255, 0.3)'
          : 'rgba(153, 153, 153, 0.3)'};
`;

export const Tag2 = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => (props.passed ? '#E7F8ED' : '#F0F0F0')};
  color: ${(props) => (props.passed ? '#18794E' : '#667588')};
  box-shadow: 0 1px 6px
    ${(props) => (props.passed ? 'rgba(24, 121, 78, 0.2)' : 'rgba(102, 117, 136, 0.2)')};
`;

/* 🔽 게시글 박스 스타일 추가 */
export const PostBox = styled.div`
  width: 100%;
  max-width: 820px;
  border: 1px solid #e0d7ff;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  padding: 10px 20px 16px 20px;
  margin-top: 15px;
  box-shadow:
    0 1px 6px rgba(98, 54, 255, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  @media (max-width: 968px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PostHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PostHeaderRight = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 13px;
`;

export const PostDate = styled.span`
  color: #999;
  font-size: 13px;
`;

export const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

export const PostJob = styled.span`
  font-size: 13px;
  background: linear-gradient(135deg, #f1f0ff 0%, #f8f7ff 100%);
  color: #5b2ffb;
  padding: 3px 10px;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(91, 47, 251, 0.15);
  font-weight: 500;
`;

export const PostJobs = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const PostFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;

export const PostMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;

  svg {
    opacity: 0.7;
  }

  /* 날짜를 오른쪽으로 배치 */
  &:last-child {
    margin-left: auto;
  }
`;
