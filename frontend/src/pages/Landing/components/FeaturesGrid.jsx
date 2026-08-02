import {
  RobotOutlined,
  FileTextOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const FEATURES = [
  {
    icon: <RobotOutlined />,
    title: 'Ginyard AI Copilot',
    description:
      'Query expenses, income, cashflow, or create invoices and quotes using conversational plain English tool-use execution.',
  },
  {
    icon: <FileTextOutlined />,
    title: 'Instant Invoicing & Quotes',
    description:
      'Create, convert, and customize invoices and quotes with real-time tax variants, multi-currency support, and PDF exports.',
  },
  {
    icon: <DollarOutlined />,
    title: 'Expense & Payment Modes',
    description:
      'Track category spending, monitor top vendors, and record payments effortlessly with customizable payment methods.',
  },
  {
    icon: <UsergroupAddOutlined />,
    title: 'Customer CRM',
    description:
      'Manage client profiles, contact history, and transaction ledgers in a clean, unified customer database.',
  },
  {
    icon: <LineChartOutlined />,
    title: 'Real-Time Financial Dashboard',
    description:
      'Interactive progress bars, customer growth charts, overdue payment alerts, and net profit breakdowns at a glance.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Multi-Tenant Security',
    description:
      'Enterprise-grade security with strict tenant isolation, JWT authentication, and automated error logging.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" style={{ padding: '60px 0', background: 'var(--color-bg-main)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Everything You Need to Scale Your Business
        </h2>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 640, margin: '0 auto 48px' }}>
          Combine powerful ERP core accounting with autonomous AI tool execution to automate day-to-day operations.
        </p>

        <div className="features-grid">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-box">{feature.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{feature.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
