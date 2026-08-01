import { Input, Form, Select } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function GeneralSettingForm() {
  const translate = useLanguage();

  return (
    <div>
      <Form.Item
        label={translate('Date Format')}
        name="idurar_app_date_format"
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
            { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
            { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={translate('Company Email')}
        name="idurar_app_company_email"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <Input placeholder="company@domain.com" />
      </Form.Item>
    </div>
  );
}
