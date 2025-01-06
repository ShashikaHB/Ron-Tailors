/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { Provider } from 'react-redux';
import { store } from './redux/store/store';

import App from './App';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
