import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalstyles';
import Title from './components/Title';
import Layout from './layout/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
        <Title />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
