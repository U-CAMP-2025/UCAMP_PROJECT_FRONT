import styled, { css } from 'styled-components';

const scale = {
  1: css`
    font-size: ${({ theme }) => theme.font.size[1]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[1]};
    line-height: ${({ theme }) => theme.font.lineHeight[1]};
  `,
  2: css`
    font-size: ${({ theme }) => theme.font.size[2]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[2]};
    line-height: ${({ theme }) => theme.font.lineHeight[2]};
  `,
  3: css`
    font-size: ${({ theme }) => theme.font.size[3]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[3]};
    line-height: ${({ theme }) => theme.font.lineHeight[3]};
  `,
  4: css`
    font-size: ${({ theme }) => theme.font.size[4]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[4]};
    line-height: ${({ theme }) => theme.font.lineHeight[4]};
  `,
  5: css`
    font-size: ${({ theme }) => theme.font.size[5]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[5]};
    line-height: ${({ theme }) => theme.font.lineHeight[5]};
  `,
  6: css`
    font-size: ${({ theme }) => theme.font.size[6]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[6]};
    line-height: ${({ theme }) => theme.font.lineHeight[6]};
  `,
  7: css`
    font-size: ${({ theme }) => theme.font.size[7]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[7]};
    line-height: ${({ theme }) => theme.font.lineHeight[7]};
  `,
  8: css`
    font-size: ${({ theme }) => theme.font.size[8]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[8]};
    line-height: ${({ theme }) => theme.font.lineHeight[8]};
  `,
  9: css`
    font-size: ${({ theme }) => theme.font.size[9]};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing[9]};
    line-height: ${({ theme }) => theme.font.lineHeight[9]};
  `,
};

const Typography = styled.p.withConfig({
  shouldForwardProp: (prop) => !['size', 'weight', 'muted', 'color'].includes(prop),
})`
  margin: 0;
  color: ${({ color, muted, theme }) =>
    color
      ? theme.colors[color.split('.')[0]]?.[color.split('.')[1]] || color // theme 색상 or hex값
      : muted
        ? theme.colors.gray[3]
        : theme.colors.gray[12]};
  ${({ size }) => scale[size || 'md']}
  font-weight: ${({ weight, theme }) =>
    weight ? theme.font.weight[weight] : theme.font.weight.regular};
`;

export default Typography;
