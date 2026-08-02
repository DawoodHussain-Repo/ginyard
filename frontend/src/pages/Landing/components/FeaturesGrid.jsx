import { Tag, Button } from 'antd';
import {
  RobotOutlined,
  FileTextOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function FeaturesGrid() {
  const navigate = useNavigate();

  return (
    <section id="features" style={{ padding: '60px 0 80px', background: 'var(--color-bg-main)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <Tag color="teal" style={{ padding: '6px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          ✨ Magic UI Bento Grid
        </Tag>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Engineered for Autonomous Operations
        </h2>
        <p style={{ fontSize: 17, color: 'var(--color-text-muted)', maxWidth: 680, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Replace fragmented spreadsheet workflows with a unified financial OS powered by conversational AI tool execution.
        </p>

        {/* Bento Grid Showcase */}
        <div className="bento-grid">
          {/* Card 1: AI Copilot Sandbox (Span 2) */}
          <div className="bento-card col-span-2">
            <div>
              <span className="bento-tag">
                <RobotOutlined /> Autonomous AI Engine
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, textAlign: 'left' }}>
                Conversational Financial Copilot
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'left', marginBottom: 20 }}>
                Query your database in plain English. Ginyard AI parses your schemas, executes read/write tools, and generates action proposals with approval modals.
              </p>
            </div>

            <div style={{
              background: 'var(--color-bg-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-lime)' }}>
                  <ThunderboltOutlined /> Live Tool Execution Sandbox
                </span>
                <Tag color="green">Mongoose Tool Execution</Tag>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-dark)', marginBottom: 8 }}>
                💬 <code>"What's my net cash flow this month?"</code>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <CheckCircleFilled style={{ color: '#52c41a', marginRight: 6 }} />
                Executing <code>get_cash_flow_summary(start_date: "2026-08-01")</code> ➔ Net Cash Flow: <strong>+$45,200.00</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Radar (Span 1) */}
          <div className="bento-card">
            <div>
              <span className="bento-tag">
                <DollarOutlined /> Real-time Analytics
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, textAlign: 'left' }}>
                Financial Health Radar
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'left', marginBottom: 20 }}>
                Track live revenue, active client ledgers, and expense breakdowns at a glance.
              </p>
            </div>

            <div style={{ background: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Monthly Revenue</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary-lime)', margin: '4px 0' }}>$340,500</div>
              <Tag color="cyan">99.9% Uptime SLA</Tag>
            </div>
          </div>

          {/* Card 3: Instant Invoices & Quotes (Span 1) */}
          <div className="bento-card">
            <div>
              <span className="bento-tag">
                <FileTextOutlined /> Invoicing Engine
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, textAlign: 'left' }}>
                Invoices & Quotations
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'left', marginBottom: 20 }}>
                Create, convert, and customize invoices with tax variants, multi-currency support, and instant PDF downloads.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', textAlign: 'left' }}>
              <Tag color="green">GST 18%</Tag>
              <Tag color="blue">Card Tax 5%</Tag>
              <Tag color="gold">Multi-Currency (USD/PKR/EUR)</Tag>
            </div>
          </div>

          {/* Card 4: Customer CRM Matrix (Span 2) */}
          <div className="bento-card col-span-2">
            <div>
              <span className="bento-tag">
                <UsergroupAddOutlined /> Customer CRM
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, textAlign: 'left' }}>
                Unified Client Ledger & Payment Modes
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'left', marginBottom: 20 }}>
                Maintain client profiles, view transaction histories, and record payments across Bank Transfer, Cash, or Credit Card.
              </p>
            </div>

            <div style={{ background: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-lime-light)', color: 'var(--color-primary-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>AC</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Acme Corporation</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Payment Mode: Bank Transfer</div>
                </div>
              </div>
              <Tag color="purple">Record Payment of $1,200</Tag>
            </div>
          </div>

          {/* Card 5: Enterprise Security (Span 3) */}
          <div className="bento-card col-span-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ textAlign: 'left', maxWidth: 700 }}>
                <span className="bento-tag">
                  <SafetyCertificateOutlined /> Enterprise Security
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  Strict Multi-Tenant Isolation & JWT Auth
                </h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
                  Every database query automatically scopes data to your authenticated workspace tenant. Zero cross-tenant leaks guaranteed.
                </p>
              </div>

              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{
                  height: 44,
                  padding: '0 24px',
                  borderRadius: 8,
                  backgroundColor: 'var(--color-primary-lime)',
                  borderColor: 'var(--color-primary-lime)',
                  fontWeight: 600,
                }}
                onClick={() => navigate('/onboarding')}
              >
                Explore All Capabilities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
