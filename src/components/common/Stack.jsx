import styled from 'styled-components';

const Stack = styled.div.withConfig({
  shouldForwardProp: (prop) => !['direction', 'gap', 'align', 'justify', 'wrap'].includes(prop),
})`
  display: flex;
  /* direction: 가로(row) 또는 세로(column) 방향 정렬 설정 */
  flex-direction: ${({ direction }) => direction || 'row'};
  /* gap: 자식 요소 간의 간격 설정 */
  gap: ${({ gap, theme }) => gap || theme.space[4]};
  /* align: 세로 정렬 방식 설정 */
  align-items: ${({ align }) => align || 'stretch'};
  /* justify: 가로 정렬 방식 설정 */
  justify-content: ${({ justify }) => justify || 'flex-start'};
  /* wrap: 요소가 한 줄에 다 들어가지 않을 때 줄바꿈 여부 설정 */
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export default Stack;
