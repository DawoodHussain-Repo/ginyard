import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { Form, Button } from 'antd';
import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import RegisterForm from '@/forms/RegisterForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_register"
          className="login-form"
          onFinish={onFinish}
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
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Create an Account" isForRegister={true} />;
};

export default RegisterPage;
