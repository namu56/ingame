import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { Provider } from 'react-redux';

async function mountApp() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser');

    await worker.start();
  }
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
serviceWorkerRegistration.register();
reportWebVitals();

mountApp();
