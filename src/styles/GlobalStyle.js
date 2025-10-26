import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: var(--font-primary); 
    font-weight: ${({ theme }) => theme.font.weight.regular};
    background-color: ${({ theme }) => theme.color?.bg || '#fff'};
    color: ${({ theme }) => theme.color?.text || '#000'};
  }
  button, input, textarea {
    font-family: inherit;
  }
  :root { 
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export default GlobalStyle;
