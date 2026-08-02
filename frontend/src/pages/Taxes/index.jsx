import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';
import useLanguage from '@/locale/useLanguage';

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';

  const searchConfig = {
    displayLabels: ['taxName'],
    searchFields: 'taxName',
    outputValue: '_id',
  };

  const deleteModalLabels = ['taxName'];

  const dataTableColumns = [
    {
      title: translate('Tax Name'),
      dataIndex: 'taxName',
    },
    {
      title: translate('Tax Value'),
      dataIndex: 'taxValue',
      render: (val) => `${val}%`,
    },
    {
      title: translate('Default'),
      dataIndex: 'isDefault',
      render: (isDefault) => (isDefault ? 'Yes' : 'No'),
    },
  ];

  const readColumns = [
    {
      title: translate('Tax Name'),
      dataIndex: 'taxName',
    },
    {
      title: translate('Tax Value'),
      dataIndex: 'taxValue',
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('tax_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<TaxForm />}
      updateForm={<TaxForm isUpdateForm />}
      config={config}
    />
  );
}
