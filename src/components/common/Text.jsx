import styled, { css } from 'styled-components';

const scale = {
  xs: css`
    font-size: ${({ theme }) => theme.font.size.xs};
  `,
  sm: css`
    font-size: ${({ theme }) => theme.font.size.sm};
  `,
  md: css`
    font-size: ${({ theme }) => theme.font.size.md};
  `,
  lg: css`
    font-size: ${({ theme }) => theme.font.size.lg};
  `,
  xl: css`
    font-size: ${({ theme }) => theme.font.size.xl};
  `,
  title: css`
    font-size: ${({ theme }) => theme.font.size.title};
    font-weight: ${({ theme }) => theme.font.weight.bold};
  `,
};

const Text = styled.p.withConfig({
  shouldForwardProp: (prop) => !['size', 'weight', 'muted'].includes(prop),
})`
  margin: 0;
  color: ${({ muted, theme }) => (muted ? theme.colors.textMuted : theme.colors.text)};
  ${({ size }) => scale[size || 'md']}
  font-weight: ${({ weight, theme }) =>
    weight ? theme.font.weight[weight] : theme.font.weight.regular};
`;

export default Text;
