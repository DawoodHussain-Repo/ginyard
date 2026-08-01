import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'antd';

import Navigation from '@/apps/Navigation/NavigationContainer';
import PageLoader from '@/components/PageLoader';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';
import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';
import FloatingAiWidget from '@/components/FloatingAiWidget';

export default function ErpCrmApp() {
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  if (settingIsloaded)
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
  else return <PageLoader />;
}
