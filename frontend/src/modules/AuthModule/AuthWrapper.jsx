import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Layout, Col, Divider, Typography } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { login, register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import { selectAppSettings } from '@/redux/settings/selectors';
import LoginForm from '@/forms/LoginForm';
import RegisterForm from '@/forms/RegisterForm';
import Loading from '@/components/Loading';
import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import logoLight from '@/assets/logos/logo-light-theme.svg';
import logoDark from '@/assets/logos/logo-dark-theme.svg';

const { Content } = Layout;
const { Title } = Typography;

export default function AuthWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const translate = useLanguage();

  const isRegister = location.pathname === '/register' || location.pathname === '/signup';
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';
  const logoSrc = isDark ? logoDark : logoLight;

  useEffect(() => {
    if (isSuccess) {
      if (isRegister) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isSuccess, isRegister, navigate]);

  const onLoginFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  const onRegisterFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  const formContent = (
    <Content
      style={{
        padding: isRegister ? '40px 30px' : '60px 30px',
        maxWidth: '440px',
        width: '100%',
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

      <Title level={1} style={{ color: 'var(--color-text-dark)', fontWeight: 800, transition: 'all 300ms ease' }}>
        {translate(isRegister ? 'Create an Account' : 'Sign in')}
      </Title>

      <Divider style={{ borderColor: 'var(--color-border)' }} />

      <Loading isLoading={isLoading}>
        {isRegister ? (
          <Form
            key="register_form"
            layout="vertical"
            name="normal_register"
            className="login-form"
            onFinish={onRegisterFinish}
          >
            <RegisterForm />
            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLoading}
                size="large"
                style={{ width: '100%', fontWeight: 700 }}
              >
                {translate('Create Account')}
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ color: 'var(--color-text-muted)', marginRight: 8 }}>
                {translate('Already have an account?')}
              </span>
              <Link to="/login" style={{ color: 'var(--color-primary-lime-hover)', fontWeight: 700 }}>
                {translate('Log in')}
              </Link>
            </div>
          </Form>
        ) : (
          <Form
            key="login_form"
            layout="vertical"
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onLoginFinish}
          >
            <LoginForm />
            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLoading}
                size="large"
                style={{ width: '100%', fontWeight: 700 }}
              >
                {translate('Log in')}
              </Button>
            </Form.Item>
            <Divider plain style={{ margin: '16px 0', color: 'var(--color-text-muted)' }}>
              {translate('OR')}
            </Divider>
            <Button
              type="default"
              size="large"
              onClick={() => dispatch(login({ loginData: { email: 'admin@admin.com', password: 'admin123' } }))}
              loading={isLoading}
              style={{
                width: '100%',
                fontWeight: 600,
                borderRadius: '8px',
                borderColor: 'var(--color-border)',
              }}
            >
              🚀 {translate('Try Demo Account')}
            </Button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ color: 'var(--color-text-muted)', marginRight: 8 }}>
                {translate("Don't have an account?")}
              </span>
              <Link to="/register" style={{ color: 'var(--color-primary-lime-hover)', fontWeight: 700 }}>
                {translate('Create an Account')}
              </Link>
            </div>
          </Form>
        )}
      </Loading>
    </Content>
  );

  return (
    <AuthLayout
      sideContent={<SideContent />}
      formContent={formContent}
      isForRegister={isRegister}
    />
  );
}
