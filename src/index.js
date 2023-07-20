import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import rootreducer from 'reducers';
import './index.css';

const container = document.getElementById('root');

const store = configureStore({reducer: rootreducer});
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

