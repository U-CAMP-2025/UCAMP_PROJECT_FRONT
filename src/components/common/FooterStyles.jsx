import styled from 'styled-components';

// --- 푸터 기본 구조 ---
export const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  padding: ${({ theme }) => theme.space[10]} ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.gray[9]};
`;

export const FooterContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[8]};
`;

// --- 상단 섹션 (링크) ---

export const FooterLinkSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[8]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space[6]};
  }
`;

export const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]}; /* 12px */
  min-width: 120px;
`;

export const FooterLink = styled.a`
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  text-decoration: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.regular};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[9]};
  }
`;

export const FooterGroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

// --- 하단 섹션 (저작권/정보) ---

export const FooterSeparator = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[4]};
  margin: 0;
`;

export const FooterInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[4]};
  }
`;

export const CopyrightText = styled.p`
  font-size: ${({ theme }) => theme.font.size[1]};
  color: ${({ theme }) => theme.colors.gray[9]};
`;

export const ContactText = styled(CopyrightText)`
  /* 연락처 및 기타 정보는 더 연한 Gray 9 사용 */
`;
