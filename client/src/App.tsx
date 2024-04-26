import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalstyles';
import Temp from './components/Temp';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Temp />
    </ThemeProvider>
  );
}

export default App;
