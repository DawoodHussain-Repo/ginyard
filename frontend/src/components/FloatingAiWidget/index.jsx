import { useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import ChatPanel from '@/pages/AiAssistant/ChatPanel';

export default function FloatingAiWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button - Hides when panel is open */}
      {!open && (
        <Tooltip title="Ask Ginyard AI" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<RobotOutlined style={{ fontSize: 24, color: 'var(--color-text-dark, #0f172a)' }} />}
            onClick={() => setOpen(true)}
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 9999,
              width: 58,
              height: 58,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-primary-lime, #84cc16)',
              borderColor: 'transparent',
              boxShadow: 'var(--shadow-lime-hover, 0 8px 24px rgba(132, 204, 22, 0.4))',
              cursor: 'pointer',
              transition: 'all var(--transition-smooth, 200ms ease-in-out)',
            }}
            id="floating-ai-button"
          />
        </Tooltip>
      )}

      {/* Floating Chat Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RobotOutlined style={{ color: 'var(--color-primary-lime, #84cc16)', fontSize: 22 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text-dark, #0f172a)' }}>Ginyard AI Assistant</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted, #64748b)', fontWeight: 400 }}>
                Powered by Groq Function Calling
              </div>
            </div>
          </div>
        }
        placement="right"
        width={440}
        onClose={() => setOpen(false)}
        open={open}
        mask={false}
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
          borderLeft: '1px solid var(--color-border, #e2e8f0)',
        }}
        styles={{
          header: {
            borderBottom: '1px solid var(--color-border, #e2e8f0)',
            padding: '16px 20px',
            background: 'var(--color-bg-card, #ffffff)',
          },
          body: {
            padding: '12px 20px',
            overflow: 'hidden',
            background: 'var(--color-bg-card, #ffffff)',
          },
        }}
      >
        <ChatPanel />
      </Drawer>
    </>
  );
}
