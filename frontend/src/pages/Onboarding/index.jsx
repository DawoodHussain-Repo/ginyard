import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Steps, Form, Input, Button, Card, Select, InputNumber, Row, Col, Typography, Space, message } from 'antd';
import { BankOutlined, DollarOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import * as actionTypes from '@/redux/auth/types';
import { request } from '@/request';
import { currencyFlag } from '@/utils/currencyList';
import logoLight from '@/style/images/logo-light-theme.svg';

const { Title, Text } = Typography;
const { Option } = Select;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: currentAdmin?.name ? `${currentAdmin.name}'s Company` : '',
    company_email: currentAdmin?.email || '',
    company_address: '',
    company_phone: '',
    default_currency_code: 'USD',
    tax_rate: 0,
  });

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = { ...formData, ...values };
      setFormData(updatedData);

      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final Step: Submit Onboarding Data
        handleFinish(updatedData);
      }
    } catch (err) {
      // Form validation error
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async (finalData) => {
    setLoading(true);
    try {
      const response = await request.post({
        entity: 'admin/onboarding/finish',
        jsonData: finalData,
      });

      if (response.success) {
        // Update local auth state in localStorage & Redux
        const updatedAdmin = {
          ...currentAdmin,
          onboarding_completed_at: response.result.onboarding_completed_at,
          onboarding_step: 3,
        };

        const authState = {
          current: updatedAdmin,
          isLoggedIn: true,
          isLoading: false,
          isSuccess: true,
        };
        window.localStorage.setItem('auth', JSON.stringify(authState));

        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          payload: updatedAdmin,
        });

        message.success('Onboarding complete! Welcome to your workspace.');
        navigate('/', { replace: true });
      } else {
        message.error(response.message || 'Failed to complete onboarding.');
      }
    } catch (error) {
      message.error(error.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const stepItems = [
    { title: 'Company Profile', icon: <BankOutlined /> },
    { title: 'Financials & Tax', icon: <DollarOutlined /> },
    { title: 'Launch', icon: <RocketOutlined /> },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-main, #f8fafc)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: 680, width: '100%' }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logoLight} alt="Logo" style={{ height: 48, marginBottom: 12 }} />
          <Title level={2} style={{ color: 'var(--color-text-dark, #0f172a)', margin: 0, fontWeight: 800 }}>
            Welcome to Ledgerly
          </Title>
          <Text style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 15 }}>
            Let's set up your workspace in just 2 minutes.
          </Text>
        </div>

        {/* Progress Steps */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            border: '1px solid var(--color-border, #e2e8f0)',
            marginBottom: 24,
          }}
        >
          <Steps current={currentStep} items={stepItems} labelPlacement="horizontal" style={{ marginBottom: 32 }} />

          <Form form={form} layout="vertical" initialValues={formData}>
            {/* Step 1: Company Profile */}
            {currentStep === 0 && (
              <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                  🏢 Company Profile
                </Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Company Name"
                      name="company_name"
                      rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                      <Input size="large" placeholder="Acme Corp" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Company Email"
                      name="company_email"
                      rules={[
                        { required: true, message: 'Please enter company email' },
                        { type: 'email', message: 'Enter a valid email' },
                      ]}
                    >
                      <Input size="large" placeholder="info@acme.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Company Address" name="company_address">
                  <Input.TextArea rows={2} placeholder="123 Business St, Suite 400" />
                </Form.Item>

                <Form.Item label="Phone Number" name="company_phone">
                  <Input size="large" placeholder="+1 (555) 000-0000" />
                </Form.Item>
              </div>
            )}

            {/* Step 2: Financial Setup */}
            {currentStep === 1 && (
              <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                  💰 Financials & Currency
                </Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Default Currency"
                      name="default_currency_code"
                      rules={[{ required: true, message: 'Please select currency' }]}
                    >
                      <Select size="large" showSearch placeholder="Select Currency">
                        {currencyFlag.map((cur) => (
                          <Option key={cur.currency_code} value={cur.currency_code}>
                            {cur.flag} {cur.currency_code}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Default Tax Rate (%)" name="tax_rate">
                      <InputNumber
                        size="large"
                        min={0}
                        max={100}
                        style={{ width: '100%' }}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 3: Launch Confirmation */}
            {currentStep === 2 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircleOutlined style={{ fontSize: 56, color: '#84cc16', marginBottom: 16 }} />
                <Title level={3} style={{ marginBottom: 8 }}>
                  You're all set!
                </Title>
                <Text style={{ color: 'var(--color-text-muted)', fontSize: 15, display: 'block', marginBottom: 24 }}>
                  Your tenant workspace details have been configured. Click below to launch your workspace.
                </Text>

                <Card
                  style={{
                    textAlign: 'left',
                    background: '#f8fafc',
                    borderRadius: 12,
                    marginBottom: 24,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <Text type="secondary">Company:</Text> <strong>{formData.company_name}</strong>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Email:</Text> <strong>{formData.company_email}</strong>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Currency:</Text> <strong>{formData.default_currency_code}</strong>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Default Tax Rate:</Text> <strong>{formData.tax_rate}%</strong>
                    </Col>
                  </Row>
                </Card>
              </div>
            )}

            {/* Step Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              {currentStep > 0 ? (
                <Button size="large" onClick={handlePrev} disabled={loading}>
                  Previous
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                loading={loading}
                icon={currentStep === 2 ? <RocketOutlined /> : undefined}
                style={{ fontWeight: 700, paddingLeft: 28, paddingRight: 28 }}
              >
                {currentStep === 2 ? 'Launch Workspace' : 'Continue'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
