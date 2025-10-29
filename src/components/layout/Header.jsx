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
  const activeMenu = '질문답변 생성'; // 현재 활성 메뉴

  return (
    <HeaderContainer>
      <LeftSection>
        <Text size={5} weight='bold' style={{ color: theme.colors.primary[9] }}>
          면접톡
        </Text>

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
        <NotificationIcon role='button' aria-label='알림'></NotificationIcon>

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
