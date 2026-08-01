import { Space, Button, Card, Row, Col } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardModule from '@/modules/DashboardModule';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      {/* AI Welcome Banner - Adaptive Theme Card */}
      <Card
        className="dashboard-welcome-banner"
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--color-border, #e2e8f0)',
          boxShadow: 'var(--shadow-md)',
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space align="center" style={{ marginBottom: 8 }}>
              <RobotOutlined style={{ fontSize: 32, color: 'var(--color-primary-lime, #84cc16)' }} />
              <h2 style={{ color: 'var(--color-text-dark, #0f172a)', margin: 0, fontWeight: 800, fontSize: 24 }}>
                Welcome to Ginyard AI
              </h2>
            </Space>
            <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 15, margin: 0 }}>
              Real-time financial analytics, transaction tracking, and your AI assistant are active.
            </p>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<RobotOutlined />}
                onClick={() => navigate('/ai-assistant')}
              >
                Open AI Assistant
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Dashboard Stats & Metrics */}
      <DashboardModule />
    </div>
  );
}
