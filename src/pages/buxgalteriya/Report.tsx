import Header from '@/pages/header/Header.tsx';
import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { saveAs } from 'file-saver';
import { DATE_FORMAT, IReceiptsStore, useReceiptsStore } from '@/FiltrStore.tsx';
import dayjs from 'dayjs';

function BusinessReport() {
	const { RangePicker } = DatePicker;
	const navigate = useNavigate();
	const { dateFrom, dateTo, setRangeDate } = useReceiptsStore((store) => ({
		dateFrom: store.dateFrom,
		dateTo: store.dateTo,
		setRangeDate: store.setRangeDate,
	}));

	const queryBusinessAnalytics = useQuery({
		queryKey: ['queryBusinessAnalytics'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-sale-point-stat`,
				params: {
					dateFrom: dateFrom,
					dateTo: dateTo,
				},
			});
		},
	});
	const data = get(queryBusinessAnalytics, 'data.data.data', []);
	const { t, i18n } = useTranslation();

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
			title: t('Do\'kon nomi'),
			dataIndex: 'salePointName',
			align: 'center',
		},

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
					<Button onClick={() => navigate(`/company-admin/applications/${record.salePointId}/${record.salePointName}`)}>
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
			<Table pagination={false} dataSource={data} columns={columns} />
			<div className='h-[10px]' />
			<div className='flex items-center justify-end w-full'>
				<Button size='large' loading={excelDownloadMutation.isLoading} onClick={excelDownload} type='primary'>
					{t('Загрузить в Excel')}
				</Button>
			</div>
		</>
	);
}

export default BusinessReport;
