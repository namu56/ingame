import React from 'react';
import { worker } from './mocks/browser';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

async function mountApp() {
  if (process.env.NODE_ENV === 'development') {
    await worker.start();
  }
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
serviceWorkerRegistration.register();
reportWebVitals();

mountApp();
