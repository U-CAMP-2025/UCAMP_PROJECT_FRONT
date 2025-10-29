import { css } from 'styled-components';

export const center = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const truncate = (lines = 1) => css`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
`;
