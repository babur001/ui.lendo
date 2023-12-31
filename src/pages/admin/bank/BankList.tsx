import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import AddBankModal from '@/pages/admin/bank/AddBankModal.tsx';
import moment from 'moment';
import { formatNumber } from '@/auth/Scoring';

interface IBank {
	id: string | number;
	bankName: string | number;
	bankTin: string | number;
	bankShare: string | number;
	bankInsurance: string | number;
	operatorShare: string | number;
	createdAt: string | number;
}

export default function BankList() {
	const { t } = useTranslation();

	const queryBanks = useQuery({
		queryKey: ['queryBanks'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/admin/get-banks`,
				params: {
					//
				},
			});
		},
	});
	const data = get(queryBanks, 'data.data.data', []) as IBank[];
	const total = get(queryBanks, 'data.data.data.totalElements', 0) as number;

	const columns: ColumnsType<IBank> = [
		{
			title: '№',
			dataIndex: 'NONE',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('bankTin'),
			dataIndex: 'bankTin',
			align: 'center',
		},
		{
			title: t('bankName'),
			dataIndex: 'bankName',
			align: 'center',
		},
		{
			title: t('bankShare'),
			dataIndex: 'bankShare',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('bankInsurance'),
			dataIndex: 'bankInsurance',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('operatorShare'),
			dataIndex: 'operatorShare',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('createdAt'),
			dataIndex: 'createdAt',
			align: 'center',
			render(value, record, index) {
				return moment(value).format('DD.MM.YYYY');
			},
		},
	];

	return (
		<>
			<Text h3>{t('Реестр кредитующих организации')}</Text>
			<div className='h-[20px]' />
			<div className='w-full flex items-center justify-end'>
				<AddBankModal onAdd={() => queryBanks.refetch()} />
			</div>
			<div className='h-[20px]' />
			<Spin spinning={queryBanks.status === 'loading'}>
				<Table pagination={false} dataSource={data} columns={columns} />
			</Spin>
		</>
	);
}
