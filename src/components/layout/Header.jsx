import { postLogout } from '@api/authAPIS';
import {
  getNoti,
  getNotiLast,
  notiDel,
  notiDelAll,
  notiRead,
  notiReadAll,
} from '@api/notificationsAPIS';
import { fetchUserRole, fetchUserStatus, patchUserStatus } from '@api/userAPIS';
import Button from '@components/common/Button';
import { Overlay, Content, Title, Description } from '@components/common/Dialog';
import * as H from '@components/common/HeaderStyles';
import Typography from '@components/common/Typography';
import NotificationDrawer from '@components/notification/NotificationDrawer';
import { KakaoLoginDialog } from '@components/signup/KakaoLoginDialog';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, PersonIcon, BellIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@store/auth/useAuthStore';
import { usePaymentStore } from '@store/payment/usePaymentStore';
import { useTutorialStore } from '@store/tutorial/useTutorialStore';
import theme from '@styles/theme';
import { useState } from 'react';
import { useEffect } from 'react';
import Joyride from 'react-joyride';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const Header = () => {
  const { isLogin, logout, user } = useAuthStore();
  const { setTutorial } = useTutorialStore();
  const { seenHeaderTour, setHeaderTour } = useTutorialStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadDerived = notifications?.filter((n) => !n.read).length;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  const [userRole, setUserRole] = useState('USER');

  const { isPlus, refreshIsPlus } = usePaymentStore.getState();

  // ======================= 유저 가이드투어 ======================
  // Joyride 실행 state

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    refreshIsPlus();
  }, []);

  const tourSteps = [
    {
      target: '#tour-nav-qalist', // 2. 면접 노트
      content: (
        <>
          <b style={{ fontSize: '20px' }}>면접 노트</b>
          <br />
          <br />
          다른 사용자들의 면접 대비 질문과 답변을
          <br />볼 수 있습니다.
        </>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#tour-nav-myqa', // 3. 나의 노트
      content: (
        <>
          <b style={{ fontSize: '20px' }}>나의 노트</b>
          <br />
          <br />
          나만의 면접 질문과 답변을 만들고 <br />
          관리할 수 있습니다.
        </>
      ),
      placement: 'bottom',
    },
    {
      target: '#tour-nav-simulation', // 4. 면접 연습
      content: (
        <>
          <b style={{ fontSize: '20px' }}>면접 연습</b>
          <br />
          <br />
          AI 면접관과 함께 실제 면접처럼 연습해보세요!
        </>
      ),
      placement: 'bottom',
    },
    {
      target: '#tour-nav-ranking', // 5. 랭킹
      content: (
        <>
          <b style={{ fontSize: '20px' }}>랭킹</b>
          <br />
          <br />
          다른 유저들은 얼마나 열심히 준비하고 있을까요?
          <br />
          랭킹을 확인하고 합격 동기부여를 받아보세요!
        </>
      ),
      placement: 'bottom',
    },
    {
      target: '#tour-nav-qalist', // 다시 면접노트
      content: (
        <>
          <br />
          이제 <b>면접 노트</b>를 클릭하여 <br />
          다른 유저의 면접 질문과 답변을 확인해보세요!
        </>
      ),
      placement: 'bottom',
    },
  ];

  useEffect(() => {
    if (isLogin) {
      fetchUserStatus().then((response) => {
        if (response?.status === 'NEW' && !seenHeaderTour) {
          setWelcomeModalOpen(true); // 튜토리얼 모달 열기
        }
      });
    }
  }, []);

  const handleStartTutorial = () => {
    setWelcomeModalOpen(false);
    setHeaderTour(true);
    setTimeout(() => {
      setRunTour(true);
    }, 100);
  };

  const handleSkipAndClose = () => {
    setWelcomeModalOpen(false);
    setHeaderTour(true);
    setRunTour(false);

    // 튜토리얼을 보지 않았으므로 상태를 'ACTIVE'로 업데이트
    patchUserStatus('ACTIVE');
  };

  const handleJoyrideCallback = (data) => {
    const { status, action, index } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status) || action === 'close') {
      setRunTour(false);
      setHeaderTour(true);
      patchUserStatus('ACTIVE');
    }

    if (index === tourSteps.length - 1 && action === 'next') {
      navigate('/qalist');
    }
  };
  // ========================== 유저 가이드투어 ================================

  const handleProtectedLink = (path) => {
    // 면접 노트와 랭킹은 비로그인도 접근 가능
    if (!isLogin && path !== '/qalist' && path !== '/rank') {
      setLoginAlertOpen(true);
      return;
    }
    navigate(path);
  };

  const handleClickLogoButton = () => {
    navigate('/');
  };

  const handleClickLoginButton = () => {
    setLoginDialogOpen(true);
  };

  const handleClickLogout = () => {
    postLogout()
      .then(() => {
        setTutorial({
          seenHeaderTour: false,
          seenSimTour: false,
          seenQAListTour: false,
        });
        logout();
      })
      .then(() => {
        refreshIsPlus();
      });

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
          setNotifications(response?.data ?? []);
        })
        .catch(() => setNotifications([]));
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      setTimeout(() => {
        getNotiLast()
          .then((response) => {
            if (response?.data === null) {
              return;
            }
            setNotifications((prevNotifications) => [...prevNotifications, response?.data ?? []]);
          })
          .catch(() => setNotifications([]));
      }, 10);
    }
  }, [alertTrigger]);

  useEffect(() => {
    if (isLogin) {
      fetchUserRole().then((response) => {
        if (response?.role === 'ADMIN') {
          setUserRole('ADMIN');
        } else {
          setUserRole('USER');
        }
      });
    }
  }, [isLogin]);

  return (
    <H.HeaderContainer>
      <H.HeaderContentWrapper>
        <H.LeftSection>
          <H.Logo onClick={handleClickLogoButton} id='tour-logo'>
            <H.LogoImage
              src={isPlus ? '/images/logo1.svg' : '/images/logo0.svg'}
              alt='면접톡 로고'
            />
          </H.Logo>
        </H.LeftSection>
        <H.Nav>
          <H.NavItem
            onClick={() => handleProtectedLink('/qalist')}
            $isActive={pathname === '/qalist'}
            id='tour-nav-qalist'
          >
            면접 노트
          </H.NavItem>

          <H.NavItem
            onClick={() => handleProtectedLink('/myqa')}
            $isActive={pathname === '/myqa'}
            id='tour-nav-myqa'
          >
            나의 노트
          </H.NavItem>

          <H.NavItem
            onClick={() => handleProtectedLink('/simulation')}
            $isActive={pathname.startsWith('/simulation')}
            id='tour-nav-simulation'
          >
            면접 연습
          </H.NavItem>

          <H.NavItem
            onClick={() => handleProtectedLink('/rank')}
            $isActive={pathname === '/rank'}
            id='tour-nav-ranking'
          >
            랭킹
          </H.NavItem>
        </H.Nav>

        <H.RightSection>
          {isLogin ? (
            <>
              <H.NotifWrap type='button' aria-label='알림' onClick={() => setNotifOpen(true)}>
                <BellIcon width={20} height={20} color={theme.colors.gray[11]} />
                {unreadDerived > 0 && (
                  <H.Badge aria-label={`읽지 않은 알림 ${unreadDerived}건`}>
                    {unreadDerived > 99 ? '99+' : unreadDerived}
                  </H.Badge>
                )}
              </H.NotifWrap>
              <DropdownMenu.Root>
                <H.ProfileToggle>
                  <H.Avatar aria-hidden>
                    {user.profileImageUrl && user.profileImageUrl.startsWith('http') ? (
                      <img
                        src={user.profileImageUrl}
                        alt=''
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <PersonIcon width={20} height={20} color={theme.colors.primary[10]} />
                    )}
                  </H.Avatar>
                  <Typography size={2} weight='semiBold' color='gray.12'>
                    {user.name}
                  </Typography>
                  <ChevronDownIcon width={16} height={16} color={theme.colors.gray[11]} />
                </H.ProfileToggle>

                <DropdownMenu.Portal>
                  <H.DropdownContent sideOffset={5} align='end'>
                    <H.DropdownItem onSelect={() => navigate('/mypage')}>마이페이지</H.DropdownItem>
                    <H.DropdownSeparator />
                    <H.DropdownItem onSelect={handleClickLogout}>로그아웃</H.DropdownItem>
                    {userRole === 'ADMIN' && (
                      <>
                        <H.DropdownSeparator />
                        <H.DropdownItem onSelect={handleClickAdminPage}>
                          관리자 페이지
                        </H.DropdownItem>
                      </>
                    )}
                  </H.DropdownContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <NotificationDrawer
                open={notifOpen}
                trigger={setAlertTrigger}
                onOpenChange={setNotifOpen}
                items={notifications}
                onItemClick={(item) => {
                  // 읽지 않은 알림이면 → 읽음 처리
                  if (!item.read) {
                    notiRead(item.notiId)
                      .then(() => {
                        setNotifications((prev) =>
                          prev.map((n) => (n.notiId === item.notiId ? { ...n, read: true } : n)),
                        );
                      })
                      .catch(() => setNotifications([]));
                    return;
                  }

                  // 이미 읽은 알림이면 → 삭제
                  notiDel(item.notiId)
                    .then(() => {
                      setNotifications((prev) => prev?.filter((n) => n.notiId !== item.notiId));
                    })
                    .catch(() => setNotifications([]));
                }}
                onMarkAllRead={() => {
                  notiReadAll()
                    .then(() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                    })
                    .catch(() => setNotifications([]));
                }}
                onDeleteAll={() => {
                  notiDelAll()
                    .then(() => setNotifications([]))
                    .catch(() => setNotifications([]));
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
        </H.RightSection>
      </H.HeaderContentWrapper>
      <Dialog.Root
        open={welcomeModalOpen}
        onOpenChange={(open) => {
          // 모달이 닫힐 때 (Esc, 오버레이 클릭)
          if (!open) {
            handleSkipAndClose();
          }
        }}
      >
        <Dialog.Portal>
          <Overlay />
          <Content>
            <Title>👋 환영합니다!</Title>
            <Description>
              면접톡과 함께 해주셔서 감사합니다!
              <br />
              서비스 투어를 시작해볼까요?
            </Description>
            <ButtonArea>
              <ModalButton variant='secondary' onClick={handleSkipAndClose}>
                괜찮아요
              </ModalButton>
              <ModalButton variant='primary' onClick={handleStartTutorial}>
                투어 시작하기
              </ModalButton>
            </ButtonArea>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={loginAlertOpen} onOpenChange={setLoginAlertOpen}>
        <Dialog.Portal>
          <Overlay />
          <Content style={{ maxWidth: '350px' }}>
            <Title>🔒 로그인 필요</Title>
            <Description>
              로그인 후 이용 가능한 페이지입니다.
              <br />
              지금 로그인하고 서비스를 이용해보세요!
            </Description>
            <ButtonArea style={{ justifyContent: 'center', marginTop: '24px' }}>
              <KakaoButton
                type='button'
                onClick={() => {
                  window.location.href = import.meta.env.VITE_API_KAKAO_LOGIN;
                }}
              >
                <img src='/images/kakao_login.png' alt='카카오 로그인' />
              </KakaoButton>
            </ButtonArea>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Joyride
        steps={tourSteps}
        run={runTour}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={false}
        showSkipButton={true}
        locale={{
          next: '다음',
          back: '이전',
          skip: '건너뛰기',
          last: '확인',
        }}
        styles={{
          options: {
            primaryColor: theme.colors.primary[9],
            textColor: theme.colors.gray[12],
            backgroundColor: theme.colors.gray[1],
            arrowColor: theme.colors.gray[1],
          },
        }}
      />
    </H.HeaderContainer>
  );
};

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[5]};
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background-color: ${theme.colors.primary[9]};
        color: white;
      `;
    }
    return `
      background-color: ${theme.colors.gray[3]};
      color: ${theme.colors.gray[11]};
      &:hover {
        background-color: ${theme.colors.gray[4]};
      }
    `;
  }}
`;

const KakaoButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 44px;
  border-radius: 8px;
  background: #fee500;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  img {
    width: 140px;
    height: auto;
    display: block;
  }
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;
