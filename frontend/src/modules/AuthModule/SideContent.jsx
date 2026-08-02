import { Layout, Typography, Tag } from 'antd';
import { useSelector } from 'react-redux';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { selectAppSettings } from '@/redux/settings/selectors';
import logoLight from '@/assets/logos/logo-light-theme.svg';
import logoDark from '@/assets/logos/logo-dark-theme.svg';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const appSettings = useSelector(selectAppSettings);
  const isDark = appSettings?.app_theme === 'dark';

  // Inverse theme variables for visual side:
  // In Light Mode (isDark=false): Visual side is BLACK (#09090b) with dark logo & white text.
  // In Dark Mode (isDark=true): Visual side is WHITE (#ffffff) with light logo & dark text.
  const logoSrc = isDark ? logoLight : logoDark;
  const titleColor = isDark ? '#0f172a' : '#ffffff';
  const mutedTextColor = isDark ? '#64748b' : '#a1a1aa';
  const cardBg = isDark ? '#ffffff' : '#141417';
  const cardBorder = isDark ? '#e2e8f0' : '#27272a';
  const itemBg = isDark ? '#f8fafc' : '#09090b';
  const iconBg = isDark ? '#ffffff' : '#1e1e24';

  return (
    <Content
      style={{
        padding: '60px 48px',
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        {/* Brand Logo & Headline */}
        <div style={{ marginBottom: 32 }}>
          <img src={logoSrc} alt="Ginyard AI" style={{ height: '44px', maxWidth: '100%', objectFit: 'contain' }} />
        </div>

        <Title level={2} style={{ fontSize: 30, marginTop: 0, marginBottom: 10, color: titleColor, fontWeight: 800, lineHeight: 1.25 }}>
          Financial operations, streamlined.
        </Title>
        <Text style={{ color: mutedTextColor, fontSize: 15, display: 'block', marginBottom: 32, lineHeight: 1.6 }}>
          Automate accounting, monitor cash flow in real-time, and manage enterprise ledgers with precision.
        </Text>

        {/* Premium SaaS Dashboard Showcase Card */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Top Balance Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: mutedTextColor, textTransform: 'uppercase' }}>
                Total Operating Balance
              </Text>
              <div style={{ fontSize: 28, fontWeight: 800, color: titleColor, marginTop: 4 }}>
                $248,920.00
              </div>
            </div>
            <Tag color="green" style={{ margin: 0, fontWeight: 700, fontSize: 12, padding: '4px 10px', borderRadius: 12 }}>
              +18.4% this month
            </Tag>
          </div>

          {/* Monthly Revenue Bar Preview */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 64, marginBottom: 24, paddingBottom: 8, borderBottom: `1px solid ${cardBorder}` }}>
            {[
              { month: 'Jan', val: '40%' },
              { month: 'Feb', val: '55%' },
              { month: 'Mar', val: '48%' },
              { month: 'Apr', val: '70%' },
              { month: 'May', val: '85%' },
              { month: 'Jun', val: '100%' },
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: bar.val,
                    background: i === 5 ? '#84cc16' : (isDark ? '#e2e8f0' : '#27272a'),
                    borderRadius: 4,
                    transition: 'height 300ms ease',
                  }}
                />
                <span style={{ fontSize: 10, color: mutedTextColor, marginTop: 6, fontWeight: 600 }}>{bar.month}</span>
              </div>
            ))}
          </div>

          {/* Recent Live Activity Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ActivityRow
              icon={<ArrowDownOutlined style={{ color: '#84cc16' }} />}
              title="Stripe Payout"
              subtitle="Instant Settlement"
              amount="+$14,250.00"
              positive
              titleColor={titleColor}
              mutedColor={mutedTextColor}
              itemBg={itemBg}
              cardBorder={cardBorder}
              iconBg={iconBg}
            />
            <ActivityRow
              icon={<ArrowUpOutlined style={{ color: '#ef4444' }} />}
              title="AWS Infrastructure"
              subtitle="Auto-Categorized"
              amount="-$340.00"
              titleColor={titleColor}
              mutedColor={mutedTextColor}
              itemBg={itemBg}
              cardBorder={cardBorder}
              iconBg={iconBg}
            />
            <ActivityRow
              icon={<CheckCircleOutlined style={{ color: '#84cc16' }} />}
              title="Acme Corp Invoice #1042"
              subtitle="Paid via Bank Transfer"
              amount="+$8,900.00"
              positive
              titleColor={titleColor}
              mutedColor={mutedTextColor}
              itemBg={itemBg}
              cardBorder={cardBorder}
              iconBg={iconBg}
            />
          </div>
        </div>
      </div>
    </Content>
  );
}

function ActivityRow({ icon, title, subtitle, amount, positive, titleColor, mutedColor, itemBg, cardBorder, iconBg }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: itemBg,
        borderRadius: 10,
        border: `1px solid ${cardBorder}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${cardBorder}`,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: titleColor }}>{title}</div>
          <div style={{ fontSize: 11, color: mutedColor }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: positive ? '#84cc16' : titleColor }}>
        {amount}
      </div>
    </div>
  );
}
