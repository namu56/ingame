import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globalstyles';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routing';
import ReactQueryProvider from './provider/queryProvider';

function App() {

  return (
    <ReactQueryProvider showDevTools>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
