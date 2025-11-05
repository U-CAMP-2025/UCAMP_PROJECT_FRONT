import { getNoti, notiDel, notiDelAll, notiRead, notiReadAll } from '@api/notificationsAPIS';
import { fetchUserRole } from '@api/userAPIS';
import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import NotificationDrawer from '@components/notification/NotificationDrawer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, PersonIcon, BellIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  HeaderContainer,
  HeaderContentWrapper,
  Logo,
  LogoImage,
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
  const { isLogin, logout, user } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadDerived = notifications?.filter((n) => !n.read).length;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const [userRole, setUserRole] = useState('USER');

  const handleClickLogoButton = () => {
    navigate('/');
  };

  const handleClickLoginButton = () => {
    setLoginDialogOpen(true);
  };

  const handleClickLogout = () => {
    logout();
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;
  };

  const handleClickAdminPage = () => {
    navigate('/admin/user');
  };

  const [alertTrigger, setAlertTrigger] = useState();

  useEffect(() => {
    if (isLogin) {
      getNoti()
        .then((response) => {
          setNotifications(response?.data ?? null);
        })
        .catch(() => setNotifications(null));
    }
  }, [isLogin, alertTrigger]);

  useEffect(() => {
    fetchUserRole().then((response) => {
      if (response?.role === 'ADMIN') {
        setUserRole('ADMIN');
      } else {
        setUserRole('USER');
      }
    });
  }, [isLogin]);

  return (
    <HeaderContainer>
      <HeaderContentWrapper>
        <LeftSection>
          <Logo onClick={handleClickLogoButton}>
            <LogoImage src='/images/logo2.png' alt='면접톡 로고' />
            <Typography size={5} weight='bold' style={{ color: theme.colors.primary[9] }}>
              면접톡
            </Typography>
          </Logo>
        </LeftSection>
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
          <NavItem href='/rank' $isActive={pathname === '/rank'}>
            랭킹정보
          </NavItem>
        </Nav>

        <RightSection>
          {isLogin ? (
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
                    {user.profileImageUrl && user.profileImageUrl.startsWith('http') ? (
                      <img
                        src={user.profileImageUrl}
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
                    {userRole === 'ADMIN' && (
                      <>
                        <DropdownSeparator />
                        <DropdownItem onSelect={handleClickAdminPage}>관리자 페이지</DropdownItem>
                      </>
                    )}
                  </DropdownContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <NotificationDrawer
                open={notifOpen}
                trigger={setAlertTrigger}
                onOpenChange={setNotifOpen}
                items={notifications}
                onItemClick={(item) => {
                  // 예시: 클릭 시 읽음 처리
                  if (!item.read) {
                    notiRead(item.notiId)
                      .then((response) => {
                        setNotifications((prev) =>
                          prev.map((n) => (n.notiId === item.notiId ? { ...n, read: true } : n)),
                        );
                      })
                      .catch(() => setNotifications(null));
                  } else {
                    notiDel(item.notiId)
                      .then((response) => {
                        setNotifications((prev) => prev.filter((n) => n.notiId !== item.notiId));
                      })
                      .catch(() => setNotifications(null));
                  }
                }}
                onMarkAllRead={() => {
                  if (unreadDerived !== 0) {
                    notiReadAll()
                      .then((response) => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                      })
                      .catch(() => setNotifications(null));
                  } else {
                    notiDelAll()
                      .then((response) => {
                        setNotifications([]);
                      })
                      .catch(() => setNotifications(null));
                  }
                }}
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
      </HeaderContentWrapper>
    </HeaderContainer>
  );
};
