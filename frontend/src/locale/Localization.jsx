import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

export default function Localization({ children }) {
  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#84cc16',
          colorLink: isDark ? '#a3e635' : '#65a30d',
          colorSuccess: '#84cc16',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#0284c7',
          colorBgBase: isDark ? '#09090b' : '#f8fafc',
          colorBgContainer: isDark ? '#141417' : '#ffffff',
          colorBgElevated: isDark ? '#1e1e24' : '#ffffff',
          colorTextBase: isDark ? '#f4f4f5' : '#0f172a',
          colorText: isDark ? '#f4f4f5' : '#0f172a',
          colorTextSecondary: isDark ? '#a1a1aa' : '#64748b',
          colorBorder: isDark ? '#27272a' : '#e2e8f0',
          colorBorderSecondary: isDark ? '#27272a' : '#f1f5f9',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 10,
            fontWeight: 700,
            colorPrimary: '#84cc16',
            colorPrimaryHover: '#84cc16',
            colorTextLightSolid: '#ffffff',
          },
          Card: {
            borderRadius: 14,
            colorBgContainer: isDark ? '#141417' : '#ffffff',
          },
          Table: {
            borderRadius: 12,
            colorBgContainer: isDark ? '#141417' : '#ffffff',
            headerBg: isDark ? '#1e1e24' : '#f1f5f9',
          },
          Menu: {
            colorBgContainer: isDark ? '#141417' : '#ffffff',
            itemSelectedBg: '#84cc16',
            itemSelectedColor: '#ffffff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
