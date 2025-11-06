import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled, { css } from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  white-space: nowrap;
`;

export const HeaderContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1140px;
`;

export const Logo = styled.button`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background: none;
  border: none;
  padding: 0;
  &:hover {
    cursor: pointer;
  }
`;

export const LogoImage = styled.img`
  height: 50px;
  width: auto;
  border-radius: 4px;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
`;

// 네비게이션
export const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[10]};
`;

export const NavItem = styled.button`
  background: none;
  border: none;
  padding: 0;

  font-family: ${({ theme }) => theme.font.family.primary};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  font-size: ${({ theme }) => theme.font.size[3]};
  line-height: ${({ theme }) => theme.font.lineHeight[3]};
  color: ${({ theme }) => theme.colors.gray[10]};
  text-decoration: none;
  padding: ${({ theme }) => theme.space[1]} 0;
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[10]};
  }

  ${(props) =>
    props.$isActive &&
    css`
      color: ${({ theme }) => theme.colors.primary[9]};
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: ${({ theme }) => theme.colors.primary[9]};
        border-radius: 1.5px;
      }
    `}
`;

// --- 알림 아이콘 ---
export const NotificationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray[3]};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &::before {
    content: '🔔';
    font-size: ${({ theme }) => theme.font.size[4]};
    line-height: 1;
  }
`;

export const NotifWrap = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.gray[3]};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.25);
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary[9]};
  color: #fff;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

// --- 프로필 드롭다운 토글 및 아바타 ---
export const ProfileToggle = styled(DropdownMenu.Trigger)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

export const ProfileAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[6]};
  border: 2px solid ${({ theme }) => theme.colors.primary[9]};
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: 'U';
    font-size: ${({ theme }) => theme.font.size[3]};
    font-weight: ${({ theme }) => theme.font.weight.semiBold};
    color: white;
  }
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 6px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// --- Radix Dropdown Menu 스타일 ---
export const DropdownContent = styled(DropdownMenu.Content)`
  background-color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: ${({ theme }) => theme.space[2]} 0;
  min-width: 150px;
  margin-top: ${({ theme }) => theme.space[1]};
  z-index: 100;

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  &[data-state='open'] {
    animation: slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-state='closed'] {
    animation: slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1) reverse;
  }
`;

export const DropdownItem = styled(DropdownMenu.Item)`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.gray[12]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[3]};
    color: ${({ theme }) => theme.colors.primary[12]};
  }
`;

export const DropdownSeparator = styled(DropdownMenu.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  margin: ${({ theme }) => theme.space[2]} 0;
`;
