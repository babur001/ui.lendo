import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { saveAs } from 'file-saver';

function BusinessReportScoring() {
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
				url: `/stat/get-sale-point-bank-stat`,
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

	const excelDownload = () => {
		excelDownloadMutation.mutateAsync().then((res) => {
			saveAs(res.data, 'excel.xlsx', { autoBom: true });
		});
	};

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
			title: t('Do\'kon nomi'),
			dataIndex: 'salePointName',
			align: 'center',
		},

		{
			title: t('Результаты скоринга банка'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Заявка отказана банком (раз'),
					dataIndex: '',
					align: 'center',
				},
				{
					title: t('Заявка одобрена банком (раз)'),
					dataIndex: '',
					align: 'center',
				},
				{
					title: t('Количество товара указанного в заявках'),
					dataIndex: '',
					align: 'center',
				},
				{
					title: t('Сумма товара указанного в заявках (сум)'),
					dataIndex: '',
					align: 'center',
				},
			],
		},


		{
			title: t('Оплочено банком'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Количество оплоченных заявок банком магазину'),
					dataIndex: '',
					align: 'center',
					children: [
						{
							title: t('ед'),
							dataIndex: '',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: '',
							align: 'center',
						},
					],
				},
				{
					title: t('Количество оплаченного банком товара '),
					dataIndex: '',
					align: 'center',
					children: [
						{
							title: t('ед'),
							dataIndex: '',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: '',
							align: 'center',
						},
					],
				},
				{
					title: t('Сумма оплоченных банком товаров'),
					dataIndex: '',
					align: 'center',
					children: [
						{
							title: t('сум'),
							dataIndex: '',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: '',
							align: 'center',
						},
					],
				},
			],
		},
		{
			title: t('В процессе оплаты'),
			dataIndex: '',
			align: 'center',
			children: [{
				title: t('заявки'),
				dataIndex: '',
				align: 'center',
			}, {
				title: t('количество товара'),
				dataIndex: '',
				align: 'center',
			}, {
				title: t('сумма'),
				dataIndex: '',
				align: 'center',
			},
			],
		},
		{
			title: t('Из них не оплачено более трех рабочих дней'),
			dataIndex: '',
			align: 'center',
			children: [{
				title: t('заявки'),
				dataIndex: '',
				align: 'center',
			}, {
				title: t('сумма'),
				dataIndex: '',
				align: 'center',
			}],
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
			<Text h3>{t('Отчет по скорингу')}</Text>
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

export default BusinessReportScoring;
