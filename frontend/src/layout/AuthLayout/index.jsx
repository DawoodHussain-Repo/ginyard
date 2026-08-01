import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { selectAppSettings } from '@/redux/settings/selectors';

export default function AuthLayout({ sideContent, formContent, isForRegister = false }) {
  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';

  // In light mode, visual side is pitch black (#09090b). In dark mode, visual side is white (#ffffff).
  const visualBg = isDark ? '#ffffff' : '#09090b';
  const visualBorder = isDark ? '#e2e8f0' : '#27272a';

  return (
    <Layout
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--color-bg-main)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="auth-desktop-container"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Visual Hero Side Panel (Black in Light Mode, White in Dark Mode) */}
        <div
          className="auth-side-panel"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background: visualBg,
            borderRight: isForRegister ? 'none' : `1px solid ${visualBorder}`,
            borderLeft: isForRegister ? `1px solid ${visualBorder}` : 'none',
            transform: isForRegister ? 'translateX(100%)' : 'translateX(0%)',
            transition: 'transform 600ms cubic-bezier(0.65, 0, 0.35, 1), background-color 300ms ease',
            zIndex: 2,
          }}
        >
          {sideContent}
        </div>

        {/* Form Panel */}
        <div
          className="auth-form-panel"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-dark)',
            transform: isForRegister ? 'translateX(-100%)' : 'translateX(0%)',
            transition: 'transform 600ms cubic-bezier(0.65, 0, 0.35, 1), background-color 300ms ease',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {formContent}
        </div>
      </div>
    </Layout>
  );
}
