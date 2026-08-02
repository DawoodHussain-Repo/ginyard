import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

import { useAppContext } from '@/context/appContext';
import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/assets/logos/logo-icon.svg';
import logoLightTheme from '@/assets/logos/logo-light-theme.svg';
import logoDarkTheme from '@/assets/logos/logo-dark-theme.svg';
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
  GlobalOutlined,
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
      key: 'landing',
      icon: <GlobalOutlined />,
      label: <Link to={'/landing'}>SaaS Landing</Link>,
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
      const path = location.pathname.slice(1);
      if (location.pathname === '/') {
        setCurrentPath('dashboard');
      } else if (path === 'payment/mode') {
        setCurrentPath('paymentMode');
      } else if (path.startsWith('invoice')) {
        setCurrentPath('invoice');
      } else if (path.startsWith('quote')) {
        setCurrentPath('quote');
      } else if (path.startsWith('payment')) {
        setCurrentPath('payment');
      } else if (path.startsWith('settings')) {
        setCurrentPath('settings');
      } else {
        setCurrentPath(path);
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
            gap: 12,
            height: '60px',
          }}
        >
          <img
            src={logoIcon}
            alt="Ginyard Logo Icon"
            style={{ height: '36px', width: '36px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-dark, #0f172a)' }}>
              Ginyard
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-primary-lime, #0f766e)', textTransform: 'uppercase' }}>
              Financial OS
            </span>
          </div>
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
