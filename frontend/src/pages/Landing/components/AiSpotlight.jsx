import { Tag, Button } from 'antd';
import { RobotOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SAMPLE_PROMPTS = [
  "How much did I spend on software this month?",
  "Which clients haven't paid me yet?",
  "Show me the latest quotation I added",
  "Record a $500 cash payment for Acme Corp",
];

export default function AiSpotlight() {
  const navigate = useNavigate();

  return (
    <section id="ai-spotlight" style={{ padding: '80px 0', background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <Tag color="teal" style={{ padding: '4px 12px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              <ThunderboltOutlined /> Powered by Groq Tool-Use LLM
            </Tag>
            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Talk to Your Financial Ledger Like a Human
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
              Ginyard AI doesn't make up numbers or guess. It reads your actual database using Mongoose tool definitions and generates action proposals with visual confirmation modals before applying changes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
                <CheckCircleOutlined style={{ color: 'var(--color-primary-lime)' }} />
                <span>Zero hallucination — 100% data-driven accuracy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
                <CheckCircleOutlined style={{ color: 'var(--color-primary-lime)' }} />
                <span>Visual approval modals before database mutations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
                <CheckCircleOutlined style={{ color: 'var(--color-primary-lime)' }} />
                <span>Multi-turn context memory & automatic error logging</span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<RobotOutlined />}
              style={{
                height: 46,
                padding: '0 28px',
                borderRadius: 8,
                backgroundColor: 'var(--color-primary-lime)',
                borderColor: 'var(--color-primary-lime)',
                fontWeight: 600,
              }}
              onClick={() => navigate('/onboarding')}
            >
              Try Ginyard AI Copilot
            </Button>
          </div>

          <div style={{ background: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
              Try Asking Ginyard AI:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    padding: '14px 18px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                  }}
                  onClick={() => navigate('/onboarding')}
                >
                  <span>💬 "{prompt}"</span>
                  <Tag color="cyan">Execute Tool</Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
