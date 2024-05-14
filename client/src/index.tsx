import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/index';

async function mountApp() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser');

    await worker.start();
  } else {
    console = window.console || {};
    console.log = function no_console() {};
    console.warn = function no_console() {};
    console.error = function () {};
  }
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}
serviceWorkerRegistration.register();
reportWebVitals();

mountApp();
