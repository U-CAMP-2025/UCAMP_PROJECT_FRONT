import { getNoti, notiDel, notiDelAll, notiRead, notiReadAll } from '@api/notificationsAPIS';
import { fetchUserRole, fetchUserStatus, patchUserStaus } from '@api/userAPIS';
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
import theme from '@styles/theme';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import Joyride from 'react-joyride';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const Header = () => {
  const { isLogin, logout, user } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadDerived = notifications?.filter((n) => !n.read).length;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  const [userRole, setUserRole] = useState('USER');

  // ======================= 유저 가이드투어 ======================
  // Joyride 실행 state
  const [runTour, setRunTour] = useState(false);
  const tourStartedByButton = useRef(false);

  const tourSteps = [
    {
      target: '#tour-logo', // 1. 로고
      content: (
        <>
          <b style={{ fontSize: '20px' }}>면접톡</b>
          <br />
          <br />
          면접톡 로고입니다.
          <br />
          클릭하면 메인 페이지로 이동합니다.
        </>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
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
  ];

  useEffect(() => {
    if (isLogin) {
      fetchUserStatus()
        .then((response) => {
          if (response?.status === 'NEW') {
            tourStartedByButton.current = false; // 플래그 초기화
            setWelcomeModalOpen(true); // 튜토리얼 대신 모달 열기
          }
        })
        .catch((err) => {
          console.error('유저 상태 조회에 실패했습니다:', err);
        });
    }
  }, [isLogin]);

  const handleStartTutorial = () => {
    tourStartedByButton.current = true;
    setWelcomeModalOpen(false);
    setTimeout(() => {
      setRunTour(true);
    }, 100);
  };

  const handleSkipAndClose = () => {
    if (tourStartedByButton.current) {
      return;
    }
    setWelcomeModalOpen(false);

    // 튜토리얼을 보지 않았으므로 상태를 'ACTIVE'로 업데이트
    patchUserStaus('ACTIVE')
      .then(() => {
        console.log("튜토리얼 건너뜀: 유저 상태가 'ACTIVE'로 업데이트되었습니다.");
      })
      .catch((err) => {
        console.error('유저 상태 업데이트에 실패했습니다:', err);
      });
  };

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    // 튜토리얼이 종료 또는 스킵되었는지 확인
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status) || action === 'close') {
      // 1. 튜토리얼을 닫습니다.
      setRunTour(false);

      // 2. 서버에 유저 상태를 'ACTIVE'로 업데이트합니다.
      patchUserStaus('ACTIVE')
        .then(() => {
          console.log("튜토리얼 완료: 유저 상태가 'ACTIVE'로 업데이트되었습니다.");
        })
        .catch((err) => {
          console.error('유저 상태 업데이트에 실패했습니다:', err);
        });
    }
  };
  // ========================== 유저 가이드투어 ===================================

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
    <H.HeaderContainer>
      <H.HeaderContentWrapper>
        <H.LeftSection>
          <H.Logo onClick={handleClickLogoButton} id='tour-logo'>
            <H.LogoImage src='/images/logo2.png' alt='면접톡 로고' />
            <Typography size={5} weight='bold' style={{ color: theme.colors.primary[9] }}>
              면접톡
            </Typography>
          </H.Logo>
        </H.LeftSection>
        <H.Nav>
          <H.NavItem
            onClick={() => navigate('/qalist')}
            $isActive={pathname === '/qalist'}
            id='tour-nav-qalist'
          >
            면접 노트
          </H.NavItem>

          <H.NavItem
            onClick={() => navigate('/myqa')}
            $isActive={pathname === '/myqa'}
            id='tour-nav-myqa'
          >
            나의 노트
          </H.NavItem>

          <H.NavItem
            onClick={() => navigate('/simulation')}
            $isActive={pathname.startsWith('/simulation')}
            id='tour-nav-simulation'
          >
            면접 연습
          </H.NavItem>

          <H.NavItem
            onClick={() => navigate('/rank')}
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
      <Joyride
        // 튜토리얼 단계
        steps={tourSteps}
        // 튜토리얼 실행 여부 (state와 연결)
        run={runTour}
        // 튜토리얼 완료/스킵/닫기 시 호출될 함수
        callback={handleJoyrideCallback}
        // '다음' 버튼 클릭 시 다음 단계로 자동 이동
        continuous={true}
        // 진행률 표시 (예: 2/6)
        showProgress={false}
        // '건너뛰기' 버튼 표시
        showSkipButton={true}
        // 버튼 텍스트 한글화
        locale={{
          next: '다음',
          back: '이전',
          skip: '건너뛰기',
          last: '마침',
        }}
        // 스타일 커스터마이징
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
