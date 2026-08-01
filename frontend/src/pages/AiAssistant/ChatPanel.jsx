import { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Typography, Spin, Tag } from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  SendOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { request } from '@/request';

const { Paragraph, Text } = Typography;

const SUGGESTED_QUESTIONS = [
  'How much did I spend this month?',
  'Which clients haven\'t paid me yet?',
  'Am I spending more than I\'m making?',
  'What are my top vendors by spend?',
  'How much income did I earn last quarter?',
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I\'m your Ginyard AI financial assistant. Ask me anything about your finances — I\'ll look up the real numbers from your accounting data.\n\nTry something like "How much did I spend on software this month?" or "Which clients haven\'t paid me?"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolCalls, setToolCalls] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);
    setToolCalls([]);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await request.post({
        entity: 'ai/chat',
        jsonData: { messages: apiMessages },
      });

      if (res.success && res.result) {
        const assistantMessage = {
          role: 'assistant',
          content: res.result.content || 'I couldn\'t find an answer for that.',
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (res.result.tool_calls) {
          setToolCalls(res.result.tool_calls);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Error: ${res.message || 'Failed to get response'}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Connection error: ${err.message || 'Failed to connect to AI server'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: 1,
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
            }}
          >
            <Avatar
              size={32}
              style={{ backgroundColor: 'var(--color-primary-lime)', color: '#ffffff', flexShrink: 0 }}
              icon={<RobotOutlined style={{ color: '#ffffff' }} />}
            />
            <div
              style={{
                background: 'var(--color-bg-main)',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid var(--color-border)',
              }}
            >
              <Spin size="small" />
              <Text type="secondary" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                Looking up your financial data...
              </Text>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Tool calls indicator */}
      {toolCalls.length > 0 && (
        <div style={{ padding: '4px 0 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <ToolOutlined style={{ color: 'var(--color-primary-lime-hover)', fontSize: 12, marginTop: 4 }} />
          {toolCalls.map((tool, idx) => (
            <Tag
              key={idx}
              color="lime"
              style={{ fontSize: 11, borderRadius: 8 }}
            >
              {tool.replace(/_/g, ' ')}
            </Tag>
          ))}
        </div>
      )}

      {/* Suggested questions */}
      {messages.length <= 2 && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            padding: '8px 0',
          }}
        >
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <Button
              key={idx}
              size="small"
              type="dashed"
              style={{
                borderRadius: 16,
                fontSize: 12,
              }}
              onClick={() => sendMessage(q)}
              disabled={loading}
            >
              {q}
            </Button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 0 4px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your finances..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={loading}
          style={{
            borderRadius: 12,
            resize: 'none',
            fontSize: 14,
          }}
          id="ai-chat-input"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => sendMessage()}
          loading={loading}
          style={{
            borderRadius: 12,
            height: 40,
            width: 40,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          id="ai-chat-send"
        />
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        flexDirection: isUser ? 'row-reverse' : 'row',
        padding: '0 4px',
      }}
    >
      <Avatar
        size={32}
        style={{
          backgroundColor: isUser ? 'var(--color-bg-hover)' : 'var(--color-primary-lime)',
          color: isUser ? 'var(--color-text-dark)' : '#ffffff',
          flexShrink: 0,
        }}
        icon={isUser ? <UserOutlined /> : <RobotOutlined style={{ color: '#ffffff' }} />}
      />
      <div
        style={{
          maxWidth: '75%',
          background: isUser ? 'var(--color-primary-lime)' : 'var(--color-bg-main)',
          color: isUser ? '#ffffff' : 'var(--color-text-dark)',
          fontWeight: isUser ? 600 : 400,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          padding: '12px 16px',
          border: isUser ? 'none' : '1px solid var(--color-border)',
        }}
      >
        <Paragraph
          style={{
            margin: 0,
            color: 'inherit',
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.content}
        </Paragraph>
      </div>
    </div>
  );
}
