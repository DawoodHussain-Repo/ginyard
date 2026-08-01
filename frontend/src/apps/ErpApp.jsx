import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { Layout } from 'antd';

import Navigation from '@/apps/Navigation/NavigationContainer';
import PageLoader from '@/components/PageLoader';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';
import FloatingAiWidget from '@/components/FloatingAiWidget';

export default function ErpCrmApp() {
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAdmin = useSelector(selectCurrentAdmin);

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);
  const isOnboardingCompleted = Boolean(currentAdmin?.onboarding_completed_at);

  if (!settingIsloaded) return <PageLoader />;

  // Route Guard: If onboarding is not completed, enforce /onboarding page without sidebar
  if (!isOnboardingCompleted) {
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
    return <AppRouter />;
  }

  // If onboarding is completed but user manually visits /onboarding, redirect to home
  if (isOnboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout hasSider>
      <Navigation />

      <Layout style={{ marginLeft: 0 }}>
        <Content
          style={{
            margin: '24px auto 30px',
            overflow: 'initial',
            width: '100%',
            padding: isMobile ? '0 16px' : '0 32px',
            maxWidth: 1440,
          }}
        >
          <AppRouter />
        </Content>
      </Layout>

      <FloatingAiWidget />
    </Layout>
  );
}
