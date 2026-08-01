import { Avatar, Button, Tooltip, Switch, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { selectAppSettings } from '@/redux/settings/selectors';
import { logout as logoutAction } from '@/redux/auth/actions';
import { settingsAction } from '@/redux/settings/actions';
import { FILE_BASE_URL } from '@/config/serverApiConfig';

export default function SidebarUserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const appSettings = useSelector(selectAppSettings);

  const isDark = appSettings?.app_theme === 'dark';

  const handleThemeToggle = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    dispatch(
      settingsAction.updateMany({
        entity: 'setting',
        jsonData: {
          settings: [{ settingKey: 'app_theme', settingValue: newTheme }],
        },
      })
    );
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <div
      style={{
        padding: '14px 16px',
        margin: '12px',
        borderRadius: '14px',
        background: 'var(--color-bg-main, #f8fafc)',
        border: '1px solid var(--color-border, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* iOS Style Theme Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 10,
          borderBottom: '1px solid var(--color-border, #e2e8f0)',
        }}
      >
        <Space align="center" size={6}>
          <SunOutlined style={{ color: !isDark ? '#84cc16' : '#94a3b8', fontSize: 15 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted, #64748b)' }}>
            Theme
          </span>
        </Space>

        <Space align="center" size={6}>
          <Switch
            checked={isDark}
            onChange={handleThemeToggle}
            size="small"
            style={{
              backgroundColor: isDark ? '#84cc16' : '#cbd5e1',
            }}
          />
          <MoonOutlined style={{ color: isDark ? '#38bdf8' : '#94a3b8', fontSize: 14 }} />
        </Space>
      </div>

      {/* User Profile Info & Logout Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          <Avatar
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            style={{
              color: 'var(--color-text-white, #ffffff)',
              backgroundColor: currentAdmin?.photo ? 'none' : 'var(--color-primary-lime, #84cc16)',
              fontWeight: 800,
              flexShrink: 0,
            }}
            size="default"
          >
            {currentAdmin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--color-text-dark, #0f172a)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentAdmin?.name ? `${currentAdmin.name}` : 'Admin User'}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-muted, #64748b)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentAdmin?.email || 'admin@ginyard.com'}
            </div>
          </div>
        </div>

        <Tooltip title="Log Out">
          <Button
            className="sidebar-logout-btn"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          />
        </Tooltip>
      </div>
    </div>
  );
}
