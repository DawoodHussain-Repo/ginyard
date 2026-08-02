import { Collapse } from 'antd';

const FAQ_ITEMS = [
  {
    key: '1',
    label: 'How does Ginyard AI handle database security?',
    children:
      'Ginyard AI enforces strict multi-tenant isolation by passing req.admin._id to every database query. The AI model has no direct database access; it runs through strict Mongoose tool definitions.',
  },
  {
    key: '2',
    label: 'Can I export invoices and quotes to PDF?',
    children:
      'Yes! You can view, download, or print professionally formatted invoices and quotes with single-click PDF generation.',
  },
  {
    key: '3',
    label: 'Does Ginyard AI make changes without my confirmation?',
    children:
      'No. Whenever Ginyard AI prepares to create an invoice, record a payment, or add a client, it generates an interactive action proposal modal. Changes are only saved when you click Approve.',
  },
  {
    key: '4',
    label: 'Can I customize tax rates and payment modes?',
    children:
      'Absolutely. Ledgerly OS allows you to register default tax rates, cash/card tax variants, and custom payment methods for your workspace.',
  },
  {
    key: '5',
    label: 'Is there a free trial available?',
    children:
      'Yes, all new users get a 14-day full-access trial of Ledgerly OS with Ginyard AI features included.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" style={{ padding: '80px 0', background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 40 }}>
          Got questions? We have answers.
        </p>

        <Collapse
          accordion
          items={FAQ_ITEMS}
          style={{
            background: 'var(--color-bg-main)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            textAlign: 'left',
          }}
        />
      </div>
    </section>
  );
}
