import Header from '@/pages/header/Header.tsx';
import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Button, Segmented, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BusinessReport() {
	const navigate = useNavigate();
	const [filter, setFilter] = useState({
		tab: 'all',
	});
	const queryBusinessAnalytics = useQuery({
		queryKey: ['queryBusinessAnalytics', filter.tab],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-sale-point-stat?dateFrom=01.01.2023&dateTo=01.01.2023`,
				params: {
					//
				},
			});
		},
	});
	const data = get(queryBusinessAnalytics, 'data.data.data', []);
	const { t, i18n } = useTranslation();
	const columns: ColumnsType<any> = [
		{
			title: '',
			dataIndex: '',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('Do\'kon nomi'),
			dataIndex: 'salePointName',
		},
		{
			title: t('Харидорлар сони'),
			dataIndex: 'clientCount',
		},
		{
			title: t('Аризалар сони'),
			dataIndex: 'applicationCount',
		},
		{
			title: t('Маҳсулотлар сони'),
			dataIndex: 'productCount',
		},
		{
			title: t('Харид суммаси'),
			dataIndex: 'summaWithVat',
		}, {
			title: t('Жами сумма (ҚҚС билан)'),
			dataIndex: 'summaWithVat',
		},
		{
			title: t('Количество покупателей (оплоченные)'),
			dataIndex: 'paidBuyersCount',
		},
		{
			title: t('Сумма (оплоченные)'),
			dataIndex: 'paidBuyersSum',
		},
		{
			title: t('Количество покупателей (неоплоченные)'),
			dataIndex: 'unpaidBuyersCount',
		},
		{
			title: t('Сумма (неоплоченные)'),
			dataIndex: 'unpaidBuyersSum',
		},
		{
			title: t("Batafsil"),
			dataIndex: "",
			render(value, record, index) {
				return (
					<Button onClick={() => navigate(`/buxgalter/buyers/${record.salePointId}`)}>
						<ArrowRight strokeWidth={1}/>
					</Button>
				);
			},
		},
	];

	return (
		<>
			<Text h3>{t("Отчет по реализациям")}</Text>
			<div className='h-[20px]' />


			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columns} />
		</>
	);
}

export default BusinessReport;
