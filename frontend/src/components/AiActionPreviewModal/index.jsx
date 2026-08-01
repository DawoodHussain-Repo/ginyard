import { useState } from 'react';
import { Modal, Table, Typography, Tag, Button, Input, Space, Divider, message, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, RocketOutlined, AlertOutlined } from '@ant-design/icons';
import { request } from '@/request';

const { Title, Text } = Typography;

export default function AiActionPreviewModal({ open, proposal, onClose, onRefineProposal, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!proposal) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (proposal.action_type === 'CREATE_INVOICE') {
        const payload = {
          client: proposal.client_name,
          items: proposal.items,
          notes: proposal.notes || '',
          taxRate: proposal.taxRate || 0,
        };

        const res = await request.create({
          entity: 'invoice',
          jsonData: payload,
        });

        if (res.success) {
          message.success(`Invoice created successfully for ${proposal.client_name}!`);
          if (onSuccess) onSuccess(res.result);
          onClose();
        } else {
          message.error(res.message || 'Failed to create invoice.');
        }
      } else if (proposal.action_type === 'CREATE_CLIENT') {
        const payload = {
          name: proposal.name,
          email: proposal.email,
          phone: proposal.phone,
          address: proposal.address,
        };

        const res = await request.create({
          entity: 'client',
          jsonData: payload,
        });

        if (res.success) {
          message.success(`Client "${proposal.name}" created successfully!`);
          if (onSuccess) onSuccess(res.result, proposal);
          onClose();
        } else {
          message.error(res.message || 'Failed to create client.');
        }
      } else if (proposal.action_type === 'CREATE_QUOTE') {
        const payload = {
          client: proposal.client_name,
          items: proposal.items,
          notes: proposal.notes || '',
          taxRate: proposal.taxRate || 0,
        };

        const res = await request.create({
          entity: 'quote',
          jsonData: payload,
        });

        if (res.success) {
          message.success(`Quote created successfully for ${proposal.client_name}!`);
          if (onSuccess) onSuccess(res.result);
          onClose();
        } else {
          message.error(res.message || 'Failed to create quote.');
        }
      }
    } catch (err) {
      message.error(err.message || 'An error occurred during creation.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = () => {
    if (!feedback.trim()) return;
    if (onRefineProposal) {
      onRefineProposal(feedback);
      setFeedback('');
    }
  };

  const columns = [
    { title: 'Item', dataIndex: 'itemName', key: 'itemName' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', align: 'center', width: 70 },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (val) => `${proposal.currency || 'USD'} ${Number(val).toLocaleString()}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (val) => <strong>{proposal.currency || 'USD'} {Number(val).toLocaleString()}</strong>,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={640}
      title={
        <Space>
          <RocketOutlined style={{ color: 'var(--color-primary-lime, #0f766e)', fontSize: 20 }} />
          <span style={{ fontWeight: 800 }}>AI Proposed Action Preview</span>
          <Tag color="blue">{proposal.action_type?.replace('_', ' ')}</Tag>
        </Space>
      }
      footer={[
        <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={onClose} disabled={loading}>
          Reject Action
        </Button>,
        <Button
          key="approve"
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={loading}
          onClick={handleApprove}
          style={{ fontWeight: 700 }}
        >
          Approve & Create
        </Button>,
      ]}
    >
      <div style={{ paddingTop: 8 }}>
        {/* Title / Description */}
        <Title level={4} style={{ marginBottom: 4 }}>
          {proposal.preview_title || 'Proposed Action'}
        </Title>

        {/* Client Status Notice */}
        {proposal.client_name && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Client Name: </Text>
            <Text strong style={{ fontSize: 15 }}>{proposal.client_name}</Text>{' '}
            {proposal.client_exists === false ? (
              <Tag color="orange" style={{ marginLeft: 8 }}>
                <AlertOutlined /> Will Auto-Create Client
              </Tag>
            ) : (
              <Tag color="green" style={{ marginLeft: 8 }}>
                Existing Client Found
              </Tag>
            )}
          </div>
        )}

        {/* Items Table */}
        {proposal.items && proposal.items.length > 0 && (
          <Table
            dataSource={proposal.items}
            columns={columns}
            rowKey={(r, idx) => idx}
            pagination={false}
            size="small"
            bordered
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Financial Totals */}
        {proposal.total !== undefined && (
          <Card size="small" style={{ background: 'var(--color-bg-main)', borderColor: 'var(--color-border)', borderRadius: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary">Subtotal:</Text>
              <Text>{proposal.currency || 'USD'} {Number(proposal.subTotal || proposal.total).toLocaleString()}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary">Tax Rate:</Text>
              <Text>{proposal.taxRate || 0}%</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16 }}>Total Amount:</Text>
              <Text strong style={{ fontSize: 18, color: 'var(--color-primary-lime, #0f766e)' }}>
                {proposal.currency || 'USD'} {Number(proposal.total).toLocaleString()}
              </Text>
            </div>
          </Card>
        )}

        {/* What needs fixing / Modification Input */}
        <div style={{ background: 'var(--color-bg-hover)', padding: 14, borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
            <EditOutlined /> What needs fixing? (Optional adjustment prompt)
          </Text>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              placeholder='e.g. "Change price to 950 PKR" or "Add email info@acme.com"'
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              onPressEnter={handleRefine}
            />
            <Button onClick={handleRefine} disabled={!feedback.trim()}>
              Update Preview
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
