import Header from '@/pages/header/Header.tsx';
import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Segmented, Table, DatePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
/*import { saveAs } from 'file-saver';*/

function BusinessReport() {
	const { RangePicker } = DatePicker;
	const navigate = useNavigate();
	const [filter, setFilter] = useState({
		tab: 'all',
		date: {
			from: '',
			to: '',
		},
	});
	const queryBusinessAnalytics = useQuery({
		queryKey: ['queryBusinessAnalytics', filter.tab, filter.date],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-sale-point-stat`,
				params: {
					dateFrom: filter.date.from,
					dateTo: filter.date.to,
				},
			});
		},
	});
	const data = get(queryBusinessAnalytics, 'data.data.data', []);
	const { t, i18n } = useTranslation();

	const excelDownloadMutation = useMutation({
		mutationKey: ['mutateExcel', filter.date],
		mutationFn: () => {
			return req({
				url: `/excel/get-sale-point-stat`,
				params: {
					dateFrom: filter.date.from,
					dateTo: filter.date.to,
				},
				method: 'GET',
				responseType: 'blob',
			});
		},
	});

	/*	const excelDownload = () => {
		excelDownloadMutation.mutateAsync().then((res) => {
			saveAs(res.data, 'excel.xlsx', { autoBom: true });
		});
	};*/

	const columns: ColumnsType<any> = [
		{
			title: '№',
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t("Do'kon nomi"),
			dataIndex: 'salePointName',
			align: 'center',
		},

		// {
		// 	title: t("Результаты скоринга банка"),
		// 	dataIndex: '',
		// 	children: [
		// 		{
		// 			title: t("Do'kon nomi"),
		// 			dataIndex: 'salePointName',
		// 			align: 'center',
		// 			render(value, record, index) {
						
		// 			},
		// 		},
		// 	]
		// },


		{
			title: t('Харидорлар сони'),
			dataIndex: 'clientCount',
			align: 'center',
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
		},
		{
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
			title: t('Batafsil'),
			dataIndex: '',
			render(value, record, index) {
				return (
					<Button onClick={() => navigate(`/buxgalter/buyers/${record.salePointId}`)}>
						<ArrowRight strokeWidth={1} />
					</Button>
				);
			},
		},
	];

	return (
		<>
			<Text h3>{t('Отчет по реализациям')}</Text>
			<div className='h-[20px]' />
			<RangePicker
				className='w-[250px]'
				placeholder={[t('дан'), t('гача')]}
				onChange={(e) => {
					const fromDate = get(e, '0', moment(new Date()));
					const toDate = get(e, '1', moment(new Date()));

					setFilter({
						...filter,
						date: {
							from: fromDate ? fromDate.format('DD.MM.YYYY') : filter.date.from,
							to: toDate ? toDate.format('DD.MM.YYYY') : filter.date.to,
						},
					});
				}}
			/>

			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columns} />
			<div className='h-[10px]' />
			<div className='flex items-center justify-end w-full'>
				<Button size='large' loading={excelDownloadMutation.isLoading} type='primary'>
					{t('Загрузить в Excel')}
				</Button>
			</div>
		</>
	);
}

export default BusinessReport;
