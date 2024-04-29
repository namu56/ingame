import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalstyles';
import Title from './components/Title';
import Layout from './layout/Layout';
import { login } from './api/auth';

function App() {
  const temp = () => login({ email: 'email', password: '1234' });
  temp();
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
