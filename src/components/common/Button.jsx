import styled, { css } from 'styled-components';

const sizes = {
  sm: css`
    height: 32px;
    padding: 0 ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.font.size[2]};
    border-radius: ${({ theme }) => theme.radius.sm};
  `,
  md: css`
    height: 40px;
    padding: 0 ${({ theme }) => theme.space[4]};
    font-size: ${({ theme }) => theme.font.size[3]};
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${({ theme }) => theme.space[5]};
    font-size: ${({ theme }) => theme.font.size[4]};
    border-radius: ${({ theme }) => theme.radius.lg};
  `,
};

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary[9]};
    color: white;
    &:hover {
      background: ${({ theme }) => theme.colors.primary[10]};
    }
    &:active {
      background: ${({ theme }) => theme.colors.primary[11]};
    }
  `,
  outline: css`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.gray[6]};
    color: ${({ theme }) => theme.colors.text};
    &:hover {
      background: ${({ theme }) => theme.colors.gray[2]};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    &:hover {
      background: ${({ theme }) => theme.colors.gray[2]};
    }
  `,
};

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'block'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  border: 0;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  box-shadow: none;
  transition:
    transform 0.02s ease,
    opacity 0.2s ease;
  ${({ size = 'md' }) => sizes[size]}
  ${({ variant = 'primary' }) => variants[variant]}
  width: ${({ block }) => (block ? '100%' : 'auto')};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export default Button;
