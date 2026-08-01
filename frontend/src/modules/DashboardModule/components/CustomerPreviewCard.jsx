import { Statistic, Progress, Divider, Row, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();
  return (
    <Row className="gutter-row">
      <div className="whiteBox shadow" style={{ height: 458, width: '100%' }}>
        <div
          className="pad20"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ color: 'var(--color-text-dark)', marginBottom: 32, marginTop: 15, fontSize: '18px', fontWeight: 800 }}>
            {translate('Customers')}
          </h3>

          {isLoading ? (
            <Spin />
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <Progress
                type="dashboard"
                percent={newCustomer}
                size={148}
                strokeColor="var(--color-primary-lime)"
                trailColor="var(--color-border)"
              />
              <p style={{ color: 'var(--color-text-muted)', marginTop: 12 }}>{translate('New Customer this Month')}</p>
              <Divider style={{ borderColor: 'var(--color-border)' }} />
              <Statistic
                title={<span style={{ color: 'var(--color-text-muted)' }}>{translate('Active Customer')}</span>}
                value={activeCustomer}
                precision={2}
                valueStyle={{ color: 'var(--color-text-dark)', fontWeight: 800 }}
                prefix={
                  activeCustomer > 0 ? (
                    <ArrowUpOutlined style={{ color: 'var(--color-primary-lime-hover)' }} />
                  ) : activeCustomer < 0 ? (
                    <ArrowDownOutlined style={{ color: 'var(--color-danger-red)' }} />
                  ) : null
                }
                suffix="%"
              />
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
