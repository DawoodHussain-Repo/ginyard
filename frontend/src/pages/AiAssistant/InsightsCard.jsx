import { useState, useEffect } from 'react';
import { Card, Typography, Space, Spin, Button, Tag, Empty, Statistic, Row, Col } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import { request } from '@/request';

const { Text, Paragraph } = Typography;

const INSIGHT_ICONS = {
  warning: <WarningOutlined style={{ color: 'var(--color-warning, #d97706)' }} />,
  success: <CheckCircleOutlined style={{ color: 'var(--color-primary-lime-hover, #65a30d)' }} />,
  info: <InfoCircleOutlined style={{ color: '#0284c7' }} />,
};

const INSIGHT_COLORS = {
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  success: { bg: '#f7fee7', border: '#bef264', text: '#4d7c0f' },
  info: { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
};

export default function InsightsCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await request.get({ entity: 'ai/insights' });
      if (res.success && res.result) {
        setData(res.result);
      } else {
        throw new Error(res.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          gap: 12,
        }}
      >
        <Spin size="medium" />
        <Text type="secondary" style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 13 }}>
          Analyzing financial data...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px 0' }}>
        <Empty
          description={
            <Space direction="vertical" align="center">
              <Text type="secondary" style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 13 }}>
                Could not load insights.
              </Text>
              <Text type="secondary" style={{ fontSize: 12, color: 'var(--color-danger-red, #ef4444)' }}>
                {error}
              </Text>
            </Space>
          }
        >
          <Button
            type="primary"
            onClick={fetchInsights}
            icon={<ReloadOutlined style={{ color: '#ffffff' }} />}
            style={{ background: 'var(--color-primary-lime, #84cc16)', borderColor: 'var(--color-primary-lime, #84cc16)', fontWeight: 700 }}
            id="insights-retry"
          >
            Retry
          </Button>
        </Empty>
      </div>
    );
  }

  if (!data) return null;

  const { insights, summary } = data;

  return (
    <div>
      {/* Summary stats grid - Unsquished */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24}>
          <Card
            style={{
              borderRadius: 12,
              background: 'var(--color-bg-main, #f8fafc)',
              border: '1px solid var(--color-border, #e2e8f0)',
            }}
            styles={{ body: { padding: '12px 16px' } }}
          >
            <Statistic
              title={<Text style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>Monthly Income</Text>}
              value={summary.current_month_income || 0}
              prefix={<DollarOutlined style={{ color: 'var(--color-primary-lime-hover, #65a30d)' }} />}
              precision={2}
              valueStyle={{ color: 'var(--color-primary-lime-hover, #65a30d)', fontSize: 18, fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={12}>
          <Card
            style={{
              borderRadius: 12,
              background: 'var(--color-bg-main, #f8fafc)',
              border: '1px solid var(--color-border, #e2e8f0)',
            }}
            styles={{ body: { padding: '12px 16px' } }}
          >
            <Statistic
              title={<Text style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>Expenses</Text>}
              value={summary.current_month_expenses || 0}
              prefix={<DollarOutlined style={{ color: 'var(--color-danger-red, #ef4444)' }} />}
              precision={2}
              valueStyle={{ color: 'var(--color-danger-red, #ef4444)', fontSize: 15, fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={12}>
          <Card
            style={{
              borderRadius: 12,
              background: 'var(--color-bg-main, #f8fafc)',
              border: '1px solid var(--color-border, #e2e8f0)',
            }}
            styles={{ body: { padding: '12px 16px' } }}
          >
            <Statistic
              title={<Text style={{ color: 'var(--color-text-muted, #64748b)', fontSize: 11, fontWeight: 600 }}>Net Cash</Text>}
              value={Math.abs(summary.net_cash_flow || 0)}
              prefix={
                summary.net_cash_flow >= 0 ? (
                  <span style={{ color: 'var(--color-primary-lime-hover, #65a30d)' }}>
                    <ArrowUpOutlined /> $
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-danger-red, #ef4444)' }}>
                    <ArrowDownOutlined /> -$
                  </span>
                )
              }
              precision={2}
              valueStyle={{
                color: summary.net_cash_flow >= 0 ? 'var(--color-primary-lime-hover, #65a30d)' : 'var(--color-danger-red, #ef4444)',
                fontSize: 15,
                fontWeight: 800,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Insight cards */}
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ color: 'var(--color-text-dark, #0f172a)', fontSize: 13 }}>
            Key Financial Signals
          </Text>
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: 'var(--color-primary-lime-hover, #65a30d)' }} />}
            onClick={fetchInsights}
            size="small"
            style={{ color: 'var(--color-primary-lime-hover, #65a30d)', fontWeight: 600, fontSize: 12 }}
            id="insights-refresh"
          >
            Refresh
          </Button>
        </div>

        {insights.map((insight, idx) => {
          const colors = INSIGHT_COLORS[insight.type] || INSIGHT_COLORS.info;
          return (
            <Card
              key={idx}
              style={{
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.bg,
              }}
              styles={{ body: { padding: '12px 14px' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <Space align="center" style={{ marginBottom: 2 }}>
                    {INSIGHT_ICONS[insight.type]}
                    <Text strong style={{ color: colors.text, fontSize: 13 }}>
                      {insight.title}
                    </Text>
                  </Space>
                  <Paragraph style={{ margin: 0, color: '#475569', fontSize: 12, lineHeight: 1.4 }}>
                    {insight.description}
                  </Paragraph>
                </div>
                {insight.metric && (
                  <Tag
                    style={{
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      border: `1px solid ${colors.border}`,
                      background: '#ffffff',
                      color: colors.text,
                    }}
                  >
                    {insight.metric}
                  </Tag>
                )}
              </div>
            </Card>
          );
        })}
      </Space>
    </div>
  );
}
