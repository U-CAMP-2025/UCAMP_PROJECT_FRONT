import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary[10]};
    color: ${({ theme }) => theme.colors.primary[2]};
    &:hover {
      background: ${({ theme }) => theme.colors.primary[9]};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.primary[6]};
    color: ${({ theme }) => theme.colors.primary[10]};
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary[5]};
    }
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
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
  }
`;

const Button = ({ children, variant = 'primary', size = 'md', ...rest }) => {
  return (
    <Base $variant={variant} $size={size} {...rest}>
      {children}
    </Base>
  );
};

export default Button;
