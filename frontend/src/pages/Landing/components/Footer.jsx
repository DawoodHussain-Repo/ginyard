export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg-main)', borderTop: '1px solid var(--color-border)', padding: '48px 0 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo-icon.svg" alt="Ledgerly OS" style={{ width: 28, height: 28 }} />
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text-dark)' }}>Ledgerly OS</span>
          </div>

          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--color-text-muted)' }}>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
            <a href="#ai-spotlight" style={{ color: 'inherit', textDecoration: 'none' }}>AI Copilot</a>
            <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderTop: '1px solid var(--color-border)', paddingTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
          <div>© {new Date().getFullYear()} Ledgerly OS / Ginyard AI. All rights reserved.</div>
          <div>Built with precision for autonomous financial intelligence.</div>
        </div>
      </div>
    </footer>
  );
}
