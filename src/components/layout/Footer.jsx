import Typography from '@components/common/Typography';
import React from 'react';

import {
  FooterContainer,
  FooterContentWrapper,
  FooterLinkSection,
  FooterLinkGroup,
  FooterLink,
  FooterGroupTitle,
  FooterSeparator,
  FooterInfoSection,
  CopyrightText,
  ContactText,
} from '../common/FooterStyles';

// 푸터 링크 데이터 (실제 서비스 링크로 교체 필요)
const footerLinks = [
  {
    title: '서비스',
    links: [
      { name: '면접 노트', href: '/qalist' },
      { name: '나의 노트', href: '/myqa' },
      { name: '면접 연습', href: '/simulation' },
    ],
  },
  {
    title: '회사 정보',
    links: [
      { name: '회사 소개', href: '/about' },
      { name: '채용 정보', href: '/careers' },
      { name: '제휴 문의', href: '/contact/partner' },
    ],
  },
  {
    title: '지원',
    links: [
      { name: '자주 묻는 질문', href: '/faq' },
      { name: '이용 약관', href: '/terms' },
      { name: '개인정보 처리방침', href: '/privacy' },
    ],
  },
];

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContentWrapper>
        {/* 1. 상단 링크 섹션 */}
        <FooterLinkSection>
          {/* 로고 영역 */}
          <Typography size={5} weight='bold' style={{ color: 'black' }}>
            면접톡
          </Typography>

          {/* 링크 그룹 */}
          {footerLinks.map((group) => (
            <FooterLinkGroup key={group.title}>
              <FooterGroupTitle>{group.title}</FooterGroupTitle>
              {group.links.map((link) => (
                <FooterLink key={link.name} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </FooterLinkGroup>
          ))}
        </FooterLinkSection>

        <FooterSeparator />

        {/* 2. 하단 정보 섹션 */}
        <FooterInfoSection>
          <div>
            <ContactText>이메일: support@myeonjeoptok.com</ContactText>
            <ContactText>전화: 070-1234-5678 (평일 9:00 ~ 18:00)</ContactText>
          </div>

          <CopyrightText>&copy; 2024 Myeonjeoptok, Inc. All rights reserved.</CopyrightText>
        </FooterInfoSection>
      </FooterContentWrapper>
    </FooterContainer>
  );
};
