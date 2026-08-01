import { Row, Col, Typography, Space, Card, Tag } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

import ChatPanel from './ChatPanel';
import TransactionEntry from './TransactionEntry';
import InsightsCard from './InsightsCard';

const { Title, Text } = Typography;

export default function AiAssistant() {
  return (
    <div style={{ width: '100%', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Space align="center">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--color-primary-lime, #84cc16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lime, 0 4px 16px rgba(132, 204, 22, 0.3))',
            }}
          >
            <RobotOutlined style={{ fontSize: 24, color: 'var(--color-text-white, #ffffff)' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'var(--color-text-dark, #0f172a)', fontWeight: 800 }}>
              Ginyard AI Financial Assistant
            </Title>
            <Text style={{ fontSize: 13, color: 'var(--color-text-muted, #64748b)' }}>
              Autonomous accounting assistant powered by Groq real-time tool calling
            </Text>
          </div>
        </Space>
        <Space>
          <Tag color="lime" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 12, background: 'var(--color-primary-lime-light, #f7fee7)', color: 'var(--color-primary-lime-hover, #4d7c0f)', borderColor: 'var(--color-primary-lime-border, #bef264)' }}>
            ● System Online
          </Tag>
        </Space>
      </div>

      {/* Main SaaS Split Layout */}
      <Row gutter={[20, 20]}>
        {/* Left Column: Full-Height Interactive Chat Interface */}
        <Col xs={24} lg={14} xl={15}>
          <Card
            style={{
              borderRadius: 16,
              background: 'var(--color-bg-card, #ffffff)',
              border: '1px solid var(--color-border, #e2e8f0)',
              boxShadow: 'var(--shadow-md)',
              height: 'calc(100vh - 160px)',
              minHeight: 620,
              display: 'flex',
              flexDirection: 'column',
            }}
            styles={{
              body: {
                padding: '20px 24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <ChatPanel />
          </Card>
        </Col>

        {/* Right Column: Smart Entry & Insights Sidebar */}
        <Col xs={24} lg={10} xl={9}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: 4 }}>
            {/* Insights Card */}
            <Card
              title={
                <Space align="center">
                  <LineChartOutlined style={{ color: 'var(--color-primary-lime, #84cc16)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--color-text-dark, #0f172a)' }}>Real-time Insights</span>
                </Space>
              }
              style={{
                borderRadius: 16,
                background: 'var(--color-bg-card, #ffffff)',
                border: '1px solid var(--color-border, #e2e8f0)',
                boxShadow: 'var(--shadow-md)',
              }}
              styles={{
                header: { borderBottom: '1px solid var(--color-border, #f1f5f9)' },
                body: { padding: '16px 20px' },
              }}
            >
              <InsightsCard />
            </Card>

            {/* Smart Transaction Entry */}
            <Card
              title={
                <Space align="center">
                  <ThunderboltOutlined style={{ color: 'var(--color-primary-lime, #84cc16)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--color-text-dark, #0f172a)' }}>Smart Transaction Entry</span>
                </Space>
              }
              style={{
                borderRadius: 16,
                background: 'var(--color-bg-card, #ffffff)',
                border: '1px solid var(--color-border, #e2e8f0)',
                boxShadow: 'var(--shadow-md)',
              }}
              styles={{
                header: { borderBottom: '1px solid var(--color-border, #f1f5f9)' },
                body: { padding: '16px 20px' },
              }}
            >
              <TransactionEntry />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
