import { formatNumber } from '@/auth/Scoring';
import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Segmented, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function BusinessAnalytics() {
	const { t, i18n } = useTranslation();

	const [filter, setFilter] = useState({
		tab: 'all',
	});

	const queryBusinessAnalytics = useQuery({
		queryKey: ['queryBusinessAnalytics', filter.tab],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-analytic-stat-monthly`,
				params: {
					//
				},
			});
		},
	});

	const columns: ColumnsType<any> = [
		{
			title: '№',
			dataIndex: '',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('Савдо белгиси (бренд)'),
			dataIndex: 'companyBrand',
		},
		{
			title: t('Харидорлар сони'),
			dataIndex: 'consumerCnt',
		},
		{
			title: t('Аризалар сони'),
			dataIndex: 'applicationCnt',
		},
		{
			title: t('Маҳсулотлар сони'),
			dataIndex: 'productCnt',
		},
		{
			title: t('Харид суммаси'),
			dataIndex: 'purchaseSum',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Хизмат кўрсатувчи банк'),
			dataIndex: 'bankName',
		},
		{
			title: t('Оператор улуши'),
			dataIndex: 'operatorShare',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Оператор фойдаси'),
			dataIndex: 'operatorProfit',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
	];

	const data = get(queryBusinessAnalytics, 'data.data.data', []);

	return (
		<>
			<Text h3>Бизнес аналитика</Text>

			<div className='h-[20px]' />

			<div className='w-full flex items-center justify-start'>
				<Segmented
					onChange={(tab) => setFilter({ ...filter, tab: tab as string })}
					value={filter.tab}
					options={[
						{
							label: t('Фаолият бошидан'),
							value: 'all',
						},
						{
							label: t('Жорий ой'),
							value: 'current_month',
						},
					]}
				/>
			</div>

			<div className='h-[20px]' />

			<Spin spinning={queryBusinessAnalytics.status === 'loading'}>
				<Table pagination={false} dataSource={data} columns={columns} />
			</Spin>
		</>
	);
}

export default BusinessAnalytics;
