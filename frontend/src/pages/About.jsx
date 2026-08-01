import { Row, Col, Card, Typography, Space, Tag, Button } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
  GithubOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: 28, color: 'var(--color-primary-lime, #84cc16)' }} />,
      title: 'Conversational Accounting',
      description:
        'Query expenses, outstanding invoices, cash flows, and top vendors using natural language powered by Groq function calling.',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 28, color: 'var(--color-primary-lime, #84cc16)' }} />,
      title: 'Smart Transaction Entry',
      description:
        'Describe expenses in plain English and automatically parse vendor names, amounts, categories, and dates with one click.',
    },
    {
      icon: <LineChartOutlined style={{ fontSize: 28, color: 'var(--color-primary-lime, #84cc16)' }} />,
      title: 'Proactive Intelligence',
      description:
        'Real-time financial ratios, overdue payment flags, and net cash flow insights calculated dynamically from live records.',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: 'var(--color-primary-lime, #84cc16)' }} />,
      title: 'Production ERP Core',
      description:
        'Robust multi-currency invoicing, quote generation, client relationship tracking, and payment reconciliation engine.',
    },
  ];

  const techStack = [
    'React 18',
    'Vite',
    'Node.js Express',
    'MongoDB & Mongoose',
    'Groq AI Function Calling',
    'Ant Design 5',
    'Redux Toolkit',
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '12px 0 40px' }}>
      {/* Theme Adaptive Hero Card */}
      <Card
        style={{
          borderRadius: 20,
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--color-border, #e2e8f0)',
          marginBottom: 32,
          boxShadow: 'var(--shadow-md)',
        }}
        styles={{ body: { padding: '40px 48px' } }}
      >
        <Row align="middle" justify="space-between" gutter={[32, 24]}>
          <Col xs={24} md={16}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <RobotOutlined style={{ fontSize: 36, color: 'var(--color-primary-lime, #84cc16)' }} />
              <h1 style={{ color: 'var(--color-text-dark, #0f172a)', margin: 0, fontWeight: 800, fontSize: 32 }}>
                Ginyard AI
              </h1>
            </Space>
            <Paragraph style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 16, lineHeight: 1.6, margin: '12px 0 20px' }}>
              The next-generation AI-native financial SaaS. Bridging enterprise accounting operations with autonomous tool-calling intelligence for modern businesses.
            </Paragraph>
            <Space wrap>
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                onClick={() => navigate('/ai-assistant')}
              >
                Launch AI Assistant
              </Button>
              <Button
                size="large"
                icon={<GithubOutlined />}
                href="https://github.com/DawoodHussain-Repo/LedgerLy-Ai"
                target="_blank"
              >
                GitHub Repository
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Card
              style={{
                borderRadius: 16,
                background: 'var(--color-bg-main, #f8fafc)',
                border: '1px solid var(--color-border, #e2e8f0)',
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Text style={{ color: 'var(--color-primary-lime, #84cc16)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Platform Status
              </Text>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-dark, #0f172a)', margin: '8px 0' }}>
                v1.0.0 Stable
              </div>
              <Space align="center">
                <CheckCircleOutlined style={{ color: 'var(--color-primary-lime, #84cc16)' }} />
                <Text style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 13 }}>Groq Tool-Calling Online</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Feature Highlights Grid */}
      <Title level={3} style={{ marginBottom: 20, color: 'var(--color-text-dark, #0f172a)', fontWeight: 800 }}>
        Core Capabilities
      </Title>
      <Row gutter={[20, 20]} style={{ marginBottom: 36 }}>
        {features.map((feat, idx) => (
          <Col xs={24} sm={12} key={idx}>
            <Card
              style={{
                borderRadius: 16,
                background: 'var(--color-bg-card, #ffffff)',
                border: '1px solid var(--color-border, #e2e8f0)',
                height: '100%',
                boxShadow: 'var(--shadow-md)',
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Space direction="vertical" size={12}>
                {feat.icon}
                <Text strong style={{ fontSize: 17, color: 'var(--color-text-dark, #0f172a)' }}>
                  {feat.title}
                </Text>
                <Paragraph style={{ margin: 0, color: 'var(--color-text-muted, #64748b)', fontSize: 14, lineHeight: 1.6 }}>
                  {feat.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tech Stack */}
      <Card
        style={{
          borderRadius: 16,
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--color-border, #e2e8f0)',
          boxShadow: 'var(--shadow-md)',
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Title level={4} style={{ margin: '0 0 16px', color: 'var(--color-text-dark, #0f172a)', fontWeight: 700 }}>
          Technology Architecture
        </Title>
        <Space wrap size={[10, 10]}>
          {techStack.map((tech, idx) => (
            <Tag
              key={idx}
              style={{
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                background: 'var(--color-primary-lime-light, #f7fee7)',
                color: 'var(--color-primary-lime-hover, #4d7c0f)',
                border: '1px solid var(--color-primary-lime-border, #bef264)',
              }}
            >
              {tech}
            </Tag>
          ))}
        </Space>
      </Card>
    </div>
  );
}
