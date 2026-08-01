import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App as AntApp } from 'antd';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const LedgerlyOs = lazy(() => import('./apps/LedgerlyOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AntApp>
          <Suspense fallback={<PageLoader />}>
            <LedgerlyOs />
          </Suspense>
        </AntApp>
      </Provider>
    </BrowserRouter>
  );
}
