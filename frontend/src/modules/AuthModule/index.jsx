import useLanguage from '@/locale/useLanguage';
import { Layout, Col, Divider, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';
import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import logoLight from '@/assets/logos/logo-light-theme.svg';
import logoDark from '@/assets/logos/logo-dark-theme.svg';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegister = false }) => {
  const translate = useLanguage();
  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';
  const logoSrc = isDark ? logoDark : logoLight;

  return (
    <AuthLayout sideContent={<SideContent />} isForRegister={isForRegister}>
      <Content
        style={{
          padding: isForRegister ? '60px 30px 30px' : '100px 30px 30px',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{
              margin: '0px auto 20px',
              display: 'block',
              height: '52px',
              width: 'auto',
            }}
          />
          <div className="space10" />
        </Col>
        <Title level={1} style={{ color: 'var(--color-text-dark)', fontWeight: 800 }}>
          {translate(AUTH_TITLE)}
        </Title>

        <Divider style={{ borderColor: 'var(--color-border)' }} />
        <div className="site-layout-content">{authContent}</div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
