import { useState } from 'react';
import { Button, Switch } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 19,
    annualPrice: 15,
    description: 'Perfect for freelancers and solo business owners.',
    features: [
      'Up to 50 Invoices / mo',
      'Basic Expense Tracking',
      'Client Management (CRM)',
      'PDF Export & Taxes',
      'Community Support',
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Autonomous financial intelligence for growing teams.',
    features: [
      'Unlimited Invoices & Quotes',
      'Full Ginyard AI Copilot',
      'Multi-Currency & Tax Variants',
      'Payment Recording & Modes',
      'Priority Support 24/7',
    ],
    popular: true,
    cta: 'Get Started with Pro',
  },
  {
    name: 'Enterprise',
    monthlyPrice: 149,
    annualPrice: 119,
    description: 'Custom accounting controls for larger businesses.',
    features: [
      'Everything in Professional',
      'Custom Role & Access Control',
      'Dedicated Audit Logs & History',
      'Custom API & Webhooks',
      'Dedicated Account Manager',
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();

  return (
    <section id="pricing" style={{ padding: '80px 0', background: 'var(--color-bg-main)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Simple, Transparent Pricing
        </h2>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32 }}>
          Start with a 14-day free trial. No credit card required.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: 15, fontWeight: annual ? 400 : 700 }}>Monthly</span>
          <Switch checked={annual} onChange={(checked) => setAnnual(checked)} />
          <span style={{ fontSize: 15, fontWeight: annual ? 700 : 400 }}>
            Annual <span style={{ color: 'var(--color-primary-lime)', fontWeight: 700 }}>(Save 20%)</span>
          </span>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan, idx) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div key={idx} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <span className="popular-tag">Most Popular</span>}

                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'left' }}>{plan.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, textAlign: 'left', minHeight: 40 }}>
                  {plan.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28, textAlign: 'left' }}>
                  <span style={{ fontSize: 40, fontWeight: 800 }}>${price}</span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, flex: 1, textAlign: 'left' }}>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <CheckOutlined style={{ color: 'var(--color-primary-lime)' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Button
                  type={plan.popular ? 'primary' : 'default'}
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontWeight: 600,
                    backgroundColor: plan.popular ? 'var(--color-primary-lime)' : undefined,
                    borderColor: plan.popular ? 'var(--color-primary-lime)' : 'var(--color-border)',
                  }}
                  onClick={() => navigate('/onboarding')}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
