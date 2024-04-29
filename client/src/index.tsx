import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

async function mountApp() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser');

    await worker.start();
  }
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  console.log(root);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
serviceWorkerRegistration.register();
reportWebVitals();

mountApp();
