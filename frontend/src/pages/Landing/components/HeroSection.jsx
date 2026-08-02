import { Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, RobotOutlined, CheckCircleFilled } from '@ant-design/icons';

export default function HeroSection({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <section id="hero" className="landing-hero">
      <div className="landing-badge">
        <RobotOutlined style={{ fontSize: 16 }} />
        <span>Ginyard AI Financial OS 2.0</span>
      </div>

      <h1 className="landing-hero-title">
        Autonomous Financial Intelligence <br />
        Built for Modern Enterprises
      </h1>

      <p className="landing-hero-subtitle">
        Automate invoices, track expenses, and manage client relations with plain-English AI tool execution. 
        Get real data from your ledger and propose live accounting actions instantly.
      </p>

      <div className="landing-hero-actions">
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          style={{
            height: 48,
            padding: '0 32px',
            borderRadius: 8,
            backgroundColor: 'var(--color-primary-lime)',
            borderColor: 'var(--color-primary-lime)',
            fontWeight: 600,
            fontSize: 16,
          }}
          onClick={() => navigate(isLoggedIn ? '/dashboard' : '/onboarding')}
        >
          {isLoggedIn ? 'Launch ERP Dashboard' : 'Start 14-Day Free Trial'}
        </Button>

        <Button
          size="large"
          style={{
            height: 48,
            padding: '0 28px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-dark)',
          }}
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
      </div>

      {/* Hero Mockup Preview */}
      <div className="hero-mockup-container">
        <div className="mockup-header-bar">
          <div className="mockup-dot red"></div>
          <div className="mockup-dot yellow"></div>
          <div className="mockup-dot green"></div>
          <div style={{ margin: '0 auto', fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Ledgerly OS — Financial Command Center
          </div>
        </div>

        <div className="mockup-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'var(--color-bg-main)', padding: 16, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Monthly Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary-lime)', marginTop: 4 }}>$340,500.00</div>
              <Tag color="green" style={{ marginTop: 8 }}>+18.4% vs last month</Tag>
            </div>
            <div style={{ background: 'var(--color-bg-main)', padding: 16, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Active Clients</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>1,240</div>
              <Tag color="blue" style={{ marginTop: 8 }}>+42 new this week</Tag>
            </div>
            <div style={{ background: 'var(--color-bg-main)', padding: 16, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Pending Quotations</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>12 Quotes</div>
              <Tag color="gold" style={{ marginTop: 8 }}>$45,200 total value</Tag>
            </div>
          </div>

          {/* AI Chat Interaction Preview */}
          <div style={{
            background: 'var(--color-bg-hover)',
            borderRadius: 12,
            padding: 20,
            border: '1px dashed var(--color-primary-lime-border)',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 600, color: 'var(--color-primary-lime)' }}>
              <RobotOutlined /> Ginyard AI Copilot
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-dark)', marginBottom: 8 }}>
              💬 <strong>User:</strong> "Show me the latest quotation and create an invoice for Acme Corp if approved."
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', padding: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <CheckCircleFilled style={{ color: '#52c41a', marginRight: 6 }} />
              <strong>Ginyard AI:</strong> Found Quote #104 ($1,200 for Acme Corp). Action proposed: <code>CREATE_INVOICE</code> with 1-click confirmation preview modal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
