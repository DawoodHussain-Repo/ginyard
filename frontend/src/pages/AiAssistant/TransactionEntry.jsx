import { useState } from 'react';
import {
  Input,
  Button,
  Card,
  Typography,
  Space,
  Select,
  DatePicker,
  InputNumber,
  message,
  Result,
  Divider,
  Tag,
  Alert,
} from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  SendOutlined,
  LoadingOutlined,
  CloseOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { request } from '@/request';

const { Text } = Typography;

const CATEGORIES = [
  'Software & Subscriptions',
  'Marketing',
  'Office Supplies',
  'Travel',
  'Professional Services',
  'Utilities',
  'Equipment',
  'Miscellaneous',
];

const EXAMPLE_ENTRIES = [
  'Paid $340 to Fiverr for logo design yesterday',
  'Spent $49.99 on Notion subscription today',
  'AWS bill for $127.50 on cloud hosting',
  'Received $2,500 from Acme Corp for consulting',
];

export default function TransactionEntry() {
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const parseTransaction = async (text) => {
    const toProcess = text || inputText;
    if (!toProcess.trim()) return;

    setParsing(true);
    setParsed(null);
    setSaved(false);

    try {
      const data = await request.post({
        entity: 'ai/parse-transaction',
        jsonData: { text: toProcess },
      });

      if (!data.success || !data.result) {
        message.error(data.message || 'Could not parse transaction');
        return;
      }

      if (data.result.error) {
        message.error(`Could not parse: ${data.result.error}`);
        return;
      }

      setParsed(data.result);
      setEditMode(false);
    } catch (error) {
      message.error(`Parsing failed: ${error.message || 'Unknown error'}`);
    } finally {
      setParsing(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsed) return;
    setSaving(true);

    try {
      if (parsed.type === 'expense') {
        const result = await request.create({
          entity: 'expense',
          jsonData: {
            vendor: parsed.vendor,
            amount: parsed.amount,
            category: parsed.category || 'Miscellaneous',
            date: parsed.date,
            description: parsed.description || '',
          },
        });

        if (result.success) {
          setSaved(true);
          message.success('Expense saved successfully!');
        } else {
          message.error('Failed to save expense');
        }
      } else {
        message.info(
          'Income entries create invoices — use the Invoice page for full invoice creation.'
        );
      }
    } catch (error) {
      message.error(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setParsed(null);
    setSaved(false);
    setInputText('');
    setEditMode(false);
  };

  const updateField = (field, value) => {
    setParsed((prev) => ({ ...prev, [field]: value }));
  };

  if (saved) {
    return (
      <div style={{ padding: '40px 0' }}>
        <Result
          status="success"
          title={<span style={{ color: 'var(--color-primary-lime, #84cc16)', fontWeight: 800 }}>Transaction Saved!</span>}
          subTitle={`${parsed.vendor} — $${parsed.amount?.toFixed(2)} on ${parsed.date}`}
          extra={[
            <Button
              key="another"
              type="primary"
              onClick={handleReset}
            >
              Log Another Transaction
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 0' }}>
      <Alert
        message={<span style={{ fontWeight: 700, color: 'var(--color-text-dark)' }}>Smart Entry</span>}
        description={<span style={{ color: 'var(--color-text-muted)' }}>Describe a transaction in plain English. The AI will parse it into structured data for your review before saving.</span>}
        type="info"
        showIcon
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: 'var(--color-bg-main)',
          border: '1px solid var(--color-border)',
        }}
      />

      {/* Input area */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Input.TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='e.g. "Paid $340 to Fiverr for logo design yesterday"'
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{
            borderRadius: 12,
            fontSize: 14,
          }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              parseTransaction();
            }
          }}
          disabled={parsing}
          id="ai-transaction-input"
        />
        <Button
          type="primary"
          icon={parsing ? <LoadingOutlined /> : <SendOutlined />}
          onClick={() => parseTransaction()}
          loading={parsing}
          style={{
            borderRadius: 12,
            height: 'auto',
            minHeight: 56,
          }}
          id="ai-transaction-parse"
        >
          Parse
        </Button>
      </div>

      {/* Example chips */}
      {!parsed && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <Text type="secondary" style={{ fontSize: 12, width: '100%', marginBottom: 4, color: 'var(--color-text-muted)' }}>
            Try an example:
          </Text>
          {EXAMPLE_ENTRIES.map((ex, idx) => (
            <Button
              key={idx}
              size="small"
              type="dashed"
              style={{
                borderRadius: 16,
                fontSize: 12,
              }}
              onClick={() => {
                setInputText(ex);
                parseTransaction(ex);
              }}
              disabled={parsing}
            >
              {ex}
            </Button>
          ))}
        </div>
      )}

      {/* Confirmation Card */}
      {parsed && (
        <Card
          title={
            <Space>
              <CheckCircleOutlined style={{ color: 'var(--color-primary-lime, #84cc16)' }} />
              <span style={{ color: 'var(--color-text-dark)', fontWeight: 700 }}>Confirm Transaction</span>
              <Tag color={parsed.type === 'expense' ? 'red' : 'green'}>
                {parsed.type?.toUpperCase()}
              </Tag>
            </Space>
          }
          extra={
            <Button
              type="text"
              icon={editMode ? <CloseOutlined /> : <EditOutlined />}
              onClick={() => setEditMode(!editMode)}
              size="small"
              style={{ color: 'var(--color-primary-lime-hover)', fontWeight: 600 }}
            >
              {editMode ? 'Done' : 'Edit'}
            </Button>
          }
          style={{
            borderRadius: 14,
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-card)',
          }}
          styles={{
            header: {
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
            },
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FieldRow label="Vendor" editing={editMode}>
              {editMode ? (
                <Input
                  value={parsed.vendor}
                  onChange={(e) => updateField('vendor', e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Text strong style={{ fontSize: 16, color: 'var(--color-text-dark)' }}>
                  {parsed.vendor}
                </Text>
              )}
            </FieldRow>

            <FieldRow label="Amount" editing={editMode}>
              {editMode ? (
                <InputNumber
                  value={parsed.amount}
                  onChange={(val) => updateField('amount', val)}
                  prefix="$"
                  style={{ width: '100%', borderRadius: 8 }}
                  precision={2}
                />
              ) : (
                <Text strong style={{ fontSize: 24, color: 'var(--color-primary-lime-hover)' }}>
                  ${parsed.amount?.toFixed(2)}
                </Text>
              )}
            </FieldRow>

            <FieldRow label="Category" editing={editMode}>
              {editMode ? (
                <Select
                  value={parsed.category}
                  onChange={(val) => updateField('category', val)}
                  style={{ width: '100%' }}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              ) : (
                <Tag
                  style={{ fontSize: 13, padding: '2px 12px', borderRadius: 12 }}
                >
                  {parsed.category}
                </Tag>
              )}
            </FieldRow>

            <FieldRow label="Date" editing={editMode}>
              {editMode ? (
                <DatePicker
                  value={parsed.date ? dayjs(parsed.date) : null}
                  onChange={(d) =>
                    updateField('date', d ? d.format('YYYY-MM-DD') : null)
                  }
                  style={{ width: '100%', borderRadius: 8 }}
                />
              ) : (
                <Text style={{ color: 'var(--color-text-dark)' }}>
                  {parsed.date
                    ? dayjs(parsed.date).format('MMMM D, YYYY')
                    : 'Not specified'}
                </Text>
              )}
            </FieldRow>

            <FieldRow label="Description" editing={editMode}>
              {editMode ? (
                <Input
                  value={parsed.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Text type="secondary" style={{ color: 'var(--color-text-muted)' }}>{parsed.description || '—'}</Text>
              )}
            </FieldRow>
          </div>

          <Divider style={{ margin: '16px 0', borderColor: 'var(--color-border)' }} />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={handleReset} icon={<SwapOutlined />} id="ai-transaction-reset">
              Start Over
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={saving}
              icon={<CheckCircleOutlined />}
              id="ai-transaction-confirm"
            >
              Confirm & Save
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function FieldRow({ label, children, editing }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: editing ? 'flex-start' : 'center',
        gap: 16,
      }}
    >
      <Text
        type="secondary"
        style={{ width: 100, flexShrink: 0, fontSize: 13, paddingTop: editing ? 6 : 0, color: 'var(--color-text-muted)' }}
      >
        {label}
      </Text>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
