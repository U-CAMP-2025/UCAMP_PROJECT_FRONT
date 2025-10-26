import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  `,
};

const sizes = {
  sm: css`
    padding: 6px 10px;
    font-size: 14px;
  `,
  md: css`
    padding: 10px 14px;
    font-size: 16px;
  `,
  lg: css`
    padding: 12px 18px;
    font-size: 18px;
  `,
};

const Base = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    transform 0.05s ease,
    filter 0.2s ease;
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const Button = ({ children, variant = 'primary', size = 'md', ...rest }) => {
  return (
    <Base $variant={variant} $size={size} {...rest}>
      {children}
    </Base>
  );
};

export default Button;
