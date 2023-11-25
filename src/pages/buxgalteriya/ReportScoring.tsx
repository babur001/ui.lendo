import { req } from '@/services/api.ts';
import { Pagination, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { DATE_FORMAT, IReceiptsStore, useReceiptsStore } from '@/FiltrStore.tsx';

const SIZE = 20;
function BusinessReportScoring() {
	const { t, i18n } = useTranslation();
	const { RangePicker } = DatePicker;
	const [page, setPage] = useState(1);
	const { dateFrom, dateTo, setRangeDate } = useReceiptsStore((store) => ({
		dateFrom: store.dateFrom,
		dateTo: store.dateTo,
		setRangeDate: store.setRangeDate,
	}));
	const navigate = useNavigate();
	const queryBusinessAnalytics = useQuery({
		queryKey: ['queryBusinessAnalytics', dateFrom, dateTo],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-sale-point-bank-stat`,
				params: {
					dateFrom: dateFrom,
					dateTo: dateTo,
					size: SIZE,
				},
			});
		},
	});
	const data = get(queryBusinessAnalytics, 'data.data.data', []);
	const total = get(queryBusinessAnalytics, 'data.data.data.totalElements', 0) as number;
	const excelDownloadMutation = useMutation({
		mutationKey: ['mutateExcel'],
		mutationFn: () => {
			return req({
				url: `/excel/get-sale-point-stat`,
				params: {
					dateFrom: dateFrom,
					dateTo: dateTo,
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
			title: t("Do'kon nomi"),
			dataIndex: 'salePointName',
			align: 'center',
		},
		{
			title: t('Результаты скоринга банка'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Заявка отказана банком (раз)'),
					dataIndex: 'bankRejectedAppCount',
					align: 'center',
				},
				{
					title: t('Заявка одобрена банком (раз)'),
					dataIndex: 'bankApprovedAppCount',
					align: 'center',
				},
				{
					title: t('Количество указанного в заявках товара'),
					dataIndex: 'approvedProductCount',
					align: 'center',
				},
				{
					title: t('Сумма указанного в заявках товара (сум)'),
					dataIndex: 'approvedSummaWithVat',
					align: 'center',
				},
			],
		},

		{
			title: t('Оплачено банком'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Количество оплаченных заявок банком магазину'),
					dataIndex: '',
					align: 'center',
					children: [
						{
							title: t('ед'),
							dataIndex: 'bankPaidAppCount',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: 'bankPaidAppPercent',
							align: 'center',
						},
					],
				},
				{
					title: t('Количество оплаченного банком товара'),
					dataIndex: '',
					align: 'center',
					children: [
						{
							title: t('ед'),
							dataIndex: 'bankPaidProductCount',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: 'bankPaidProductPercent',
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
							dataIndex: 'bankPaidProductTotal',
							align: 'center',
						},
						{
							title: t('в % к одобренным'),
							dataIndex: 'bankPaidProductTotalPercent',
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
			children: [
				{
					title: t('заявки'),
					dataIndex: 'bankPendingAppCount',
					align: 'center',
				},
				{
					title: t('количество товара'),
					dataIndex: 'bankPendingProductCount',
					align: 'center',
				},
				{
					title: t('сумма'),
					dataIndex: 'bankPendingProductTotal',
					align: 'center',
				},
			],
		},
		{
			title: t('Из них не оплачено более трех рабочих дней'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('заявки'),
					dataIndex: 'bankPending3DaysAppCount',
					align: 'center',
				},
				{
					title: t('сумма'),
					dataIndex: 'bankPending3DaysProductTotal',
					align: 'center',
				},
			],
		},
		{
			title: t('Batafsil'),
			dataIndex: '',
			render(value, record, index) {
				return (
					<Button onClick={() => navigate(`/company-admin/applications/${record.salePointId}/${record.salePointName}`)}>
						<ArrowRight strokeWidth={1} />
					</Button>
				);
			},
		},
	];

	return (
		<>
			<Text h3>{t('Продажи')}</Text>
			<div className='h-[20px]' />
			<div className='flex items-center justify-between  w-full'>
				<div>
					<RangePicker
						format={DATE_FORMAT}
						allowClear={false}
						placeholder={[t('дан'), t('гача')]}
						className='w-full'
						defaultValue={dateFrom ? [dayjs(dateFrom, DATE_FORMAT), dayjs(dateTo, DATE_FORMAT)] : [null, null]}
						onChange={(m) => {
							if (m && m[1] && m[0]) {
								setRangeDate({
									dateFrom: m[0].format(DATE_FORMAT) as IReceiptsStore['dateFrom'],
									dateTo: m[1].format(DATE_FORMAT) as IReceiptsStore['dateTo'],
								});
							}
						}}
					/>
				</div>
				<div></div>
			</div>
			<div className='h-[20px]' />
			<Spin spinning={queryBusinessAnalytics.status === 'loading'}>
				<Table
					size='small'
					bordered
					pagination={false}
					dataSource={data}
					columns={columns}
					rowClassName={(row, idx) => {
						if (idx % 2 === 0) {
							return '';
						}
						return '!bg-gray-50';
					}}
				/>
				<div className='h-[20px]' />

				<div className='flex items-center justify-between'>
					<div className='flex items-center !gap-5'>
						<Pagination count={Math.ceil(total / SIZE)} page={page} onChange={setPage}>
							<Pagination.Previous>{t('Oldin')}</Pagination.Previous>
							<Pagination.Next>{t('Keyin')}</Pagination.Next>
						</Pagination>

						<p className='!my-0'>
							{t('Всего записей')}: {total}
						</p>
					</div>

					<div className='flex items-center justify-end'>
						<Button size='large' loading={excelDownloadMutation.isLoading} onClick={excelDownload} type='primary'>
							{t('Загрузить в Excel')}
						</Button>
					</div>
				</div>
			</Spin>
			<div className='h-[10px]' />
		</>
	);
}

export default BusinessReportScoring;
