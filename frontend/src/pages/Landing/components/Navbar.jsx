import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function Navbar({ isDarkMode, onToggleTheme, isLoggedIn }) {
  const navigate = useNavigate();
  const translate = useLanguage();

  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <a href="#hero" className="landing-logo">
          <img src="/logo-icon.svg" alt="Ledgerly OS" style={{ width: 32, height: 32 }} />
          <span>Ledgerly OS</span>
        </a>

        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#ai-spotlight">AI Assistant</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            shape="circle"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={onToggleTheme}
            style={{ color: 'var(--color-text-dark)' }}
          />

          {isLoggedIn ? (
            <Button
              type="primary"
              style={{
                backgroundColor: 'var(--color-primary-lime)',
                borderColor: 'var(--color-primary-lime)',
                borderRadius: 8,
                fontWeight: 600,
              }}
              onClick={() => navigate('/')}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                type="text"
                onClick={() => navigate('/login')}
                style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}
              >
                Log In
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: 'var(--color-primary-lime)',
                  borderColor: 'var(--color-primary-lime)',
                  borderRadius: 8,
                  fontWeight: 600,
                }}
                onClick={() => navigate('/onboarding')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
