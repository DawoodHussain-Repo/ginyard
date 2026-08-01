import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function RegisterForm() {
  const translate = useLanguage();
  return (
    <div>
      <Form.Item
        label={translate('Full Name')}
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your full name!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="John Doe"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('email')}
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email address!',
          },
          {
            type: 'email',
            message: 'Please enter a valid email address!',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="name@company.com"
          type="email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('password')}
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          {
            min: 6,
            message: 'Password must be at least 6 characters!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="At least 6 characters"
          size="large"
        />
      </Form.Item>
    </div>
  );
}
