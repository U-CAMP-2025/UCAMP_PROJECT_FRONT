import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import NotificationDrawer from '@components/notification/NotificationDrawer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, PersonIcon, BellIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/authStore';
import theme from '@styles/theme';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  HeaderContainer,
  Logo,
  LeftSection,
  RightSection,
  Nav,
  NavItem,
  ProfileToggle,
  Avatar,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  NotifWrap,
  Badge,
} from '../common/HeaderStyles';

export const Header = () => {
  const { logout, user } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      notiId: 2,
      content: '알림 내용',
      type: 'TRANSCRIPTION',
      read: false,
      createdAt: '2025-10-27T06:00:00Z',
    },
    {
      notiId: 1,
      content: '알림 내용',
      type: 'REVIEW',
      read: true,
      createdAt: '2025-10-27T06:00:00Z',
    },
    {
      notiId: 3,
      content: '알림 내용',
      type: 'CERTIFICATE',
      read: true,
      createdAt: '2025-10-27T06:00:00Z',
    },
    {
      notiId: 4,
      content: '알림 내용',
      type: 'TRANSCRIPTION',
      read: false,
      createdAt: '2025-10-27T06:00:00Z',
    },
  ]);
  const unreadDerived = notifications.filter((n) => !n.read).length;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleClickLogoButton = () => {
    navigate('/');
  };

  const handleClickLoginButton = () => {
    setLoginDialogOpen(true);
  };

  const handleClickLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo onClick={handleClickLogoButton}>
          <Typography size={5} weight='bold' style={{ color: theme.colors.primary[9] }}>
            면접톡
          </Typography>
        </Logo>

        <Nav>
          <NavItem href='/qalist' $isActive={pathname === '/qalist'}>
            질문답변 둘러보기
          </NavItem>
          <NavItem href='/myqa' $isActive={pathname === '/myqa'}>
            질문답변 생성
          </NavItem>
          <NavItem href='/simulation' $isActive={pathname === '/simulation'}>
            면접 시뮬레이션
          </NavItem>
          <NavItem href='/simulation/record' $isActive={pathname === '/simulation/record'}>
            시뮬레이션 결과
          </NavItem>
        </Nav>
      </LeftSection>

      <RightSection>
        {user ? (
          <>
            <NotifWrap type='button' aria-label='알림' onClick={() => setNotifOpen(true)}>
              <BellIcon width={20} height={20} color={theme.colors.gray[11]} />
              {unreadDerived > 0 && (
                <Badge aria-label={`읽지 않은 알림 ${unreadDerived}건`}>
                  {unreadDerived > 99 ? '99+' : unreadDerived}
                </Badge>
              )}
            </NotifWrap>
            <DropdownMenu.Root>
              <ProfileToggle>
                <Avatar aria-hidden>
                  {user.profileImage && user.profileImage.startsWith('http') ? (
                    <img
                      src={user.profileImage}
                      alt=''
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <PersonIcon width={20} height={20} color={theme.colors.primary[10]} />
                  )}
                </Avatar>
                <Typography size={2} weight='semiBold' color='gray.12'>
                  {user.name}
                </Typography>
                <ChevronDownIcon width={16} height={16} color={theme.colors.gray[11]} />
              </ProfileToggle>

              <DropdownMenu.Portal>
                <DropdownContent sideOffset={5} align='end'>
                  <DropdownItem onSelect={() => navigate('/mypage')}>마이페이지</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem onSelect={handleClickLogout}>로그아웃</DropdownItem>
                </DropdownContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <NotificationDrawer
              open={notifOpen}
              onOpenChange={setNotifOpen}
              items={notifications}
              onItemClick={(item) => {
                // 예시: 클릭 시 읽음 처리
                setNotifications((prev) =>
                  prev.map((n) => (n.notiId === item.notiId ? { ...n, read: true } : n)),
                );
              }}
              onMarkAllRead={() =>
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            />
          </>
        ) : (
          <>
            <Button size='sm' onClick={handleClickLoginButton}>
              로그인
            </Button>
            <KakaoLoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
          </>
        )}
      </RightSection>
    </HeaderContainer>
  );
};
