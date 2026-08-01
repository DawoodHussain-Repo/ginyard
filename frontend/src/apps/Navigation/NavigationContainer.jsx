import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

import { useAppContext } from '@/context/appContext';
import useLanguage from '@/locale/useLanguage';
import logoLightTheme from '@/style/images/logo-light-theme.svg';
import logoDarkTheme from '@/style/images/logo-dark-theme.svg';
import useResponsive from '@/hooks/useResponsive';
import SidebarUserProfile from './SidebarUserProfile';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  CreditCardOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  RobotOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();
  const navigate = useNavigate();

  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';
  const logoSrc = isDark ? logoDarkTheme : logoLightTheme;

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;

  const [currentPath, setCurrentPath] = useState('');
  const translate = useLanguage();

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'ai-assistant',
      icon: <RobotOutlined />,
      label: <Link to={'/ai-assistant'}>AI Assistant</Link>,
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>{translate('customers')}</Link>,
    },
    {
      key: 'invoice',
      icon: <ContainerOutlined />,
      label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
    },
    {
      key: 'quote',
      icon: <FileSyncOutlined />,
      label: <Link to={'/quote'}>{translate('quote')}</Link>,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: <Link to={'/payment'}>{translate('payments')}</Link>,
    },
    {
      key: 'paymentMode',
      icon: <WalletOutlined />,
      label: <Link to={'/payment/mode'}>{translate('payment_mode')}</Link>,
    },
    {
      key: 'taxes',
      icon: <TagOutlined />,
      label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to={'/settings'}>{translate('settings')}</Link>,
    },
    {
      key: 'about',
      label: <Link to={'/about'}>{translate('about')}</Link>,
      icon: <ReconciliationOutlined />,
    },
  ];

  useEffect(() => {
    if (location) {
      if (location.pathname === '/') {
        setCurrentPath('dashboard');
      } else {
        setCurrentPath(location.pathname.slice(1));
      }
    }
  }, [location]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
        height: isMobile ? '100vh' : 'calc(100vh - 40px)',
        position: isMobile ? 'absolute' : 'sticky',
        top: isMobile ? 0 : '20px',
        left: isMobile ? 0 : '20px',
        borderRadius: isMobile ? 0 : '16px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
        scrollbarWidth: 'none',
      }}
      theme={'light'}
    >
      <div>
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            padding: '16px 20px 12px',
            display: 'flex',
            alignItems: 'center',
            height: '60px',
          }}
        >
          <img
            src={logoSrc}
            alt="Ginyard Logo"
            style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <Menu
          items={items}
          mode="inline"
          theme={'light'}
          selectedKeys={[currentPath]}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
          }}
        />
      </div>

      {/* Sidebar Footer Profile */}
      <SidebarUserProfile />
    </Sider>
  );
}

function MobileSidebar() {
  return (
    <div className="mobile-sidebar-wraper">
      <Sidebar collapsible={false} isMobile={true} />
    </div>
  );
}
