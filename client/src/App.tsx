import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalstyles';
import Title from './components/Title';
import Layout from './layout/Layout';
import { Counter } from './pages/counter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Counter />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
