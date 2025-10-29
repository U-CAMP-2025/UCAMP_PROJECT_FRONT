import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import theme from '@styles/theme';

import {
  HeaderContainer,
  LeftSection,
  RightSection,
  Nav,
  NavItem,
  NotificationIcon,
  ProfileToggle,
  ProfileAvatar,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../common/HeaderStyles';
import Text from '../common/Text';

export const Header = () => {
  // 실제 서비스에서는 현재 페이지 경로에 따라 '활성 메뉴' 상태를 관리합니다.
  const activeMenu = '질문답변 생성'; // 예시: 현재 활성 메뉴

  return (
    <HeaderContainer>
      <LeftSection>
        {/* 로고 영역 */}
        <Text size={5} weight='bold' style={{ color: theme.colors.primary[9] }}>
          면접톡
        </Text>

        {/* 메인 네비게이션 */}
        <Nav>
          <NavItem href='#' $isActive={activeMenu === '질문답변 둘러보기'}>
            질문답변 둘러보기
          </NavItem>
          <NavItem href='#' $isActive={activeMenu === '질문답변 생성'}>
            질문답변 생성
          </NavItem>
          <NavItem href='#' $isActive={activeMenu === '면접 시뮬레이션'}>
            면접 시뮬레이션
          </NavItem>
          <NavItem href='#' $isActive={activeMenu === '시뮬레이션 결과'}>
            시뮬레이션 결과
          </NavItem>
        </Nav>
      </LeftSection>

      <RightSection>
        {/* 알림 아이콘 */}
        <NotificationIcon role='button' aria-label='알림'></NotificationIcon>

        {/* 프로필 드롭다운 메뉴 */}
        <DropdownMenu.Root>
          <ProfileToggle>
            <ProfileAvatar role='img' aria-label='사용자 아바타' />
            <Text size={3} weight='semiBold'>
              유저 닉네임
            </Text>
            <ChevronDownIcon width={16} height={16} color={theme.colors.gray[11]} />
          </ProfileToggle>

          <DropdownMenu.Portal>
            <DropdownContent sideOffset={5} align='end'>
              <DropdownItem onSelect={() => console.log('마이페이지 이동')}>
                마이페이지
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem onSelect={() => console.log('로그아웃')}>로그아웃</DropdownItem>
            </DropdownContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </RightSection>
    </HeaderContainer>
  );
};
