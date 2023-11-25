import { req } from '@/services/api.ts';
import { Pagination, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker, Spin, Typography, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { DATE_FORMAT, IReceiptsStore, useReceiptsStore } from '@/FiltrStore.tsx';
import { IApplications } from '@/pages/buyers/applicationsList.tsx';
import moment from 'moment/moment';
import { formatNumber } from '@/auth/Scoring.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';

const SIZE = 10;

function BusinessReportScoringDetails() {
	const user = useAuthUser();
	const rolesName = get(user, 'data.data.data.roles.0.name', null);
	const { t, i18n } = useTranslation();
	const { Title } = Typography;
	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const [page, setPage] = useState(1);
	const params = useParams();
	const [search, getCustomerPinfl] = useState<string | undefined>('');
	const { dateFrom, dateTo, setRangeDate } = useReceiptsStore((store) => ({
		dateFrom: store.dateFrom,
		dateTo: store.dateTo,
		setRangeDate: store.setRangeDate,
	}));
	const navigate = useNavigate();


	const queryApplications = useQuery({
		queryKey: ['queryApplications', params.pinfl, search, params.sale_point_id],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/registration/get-applications`,
				params: {
					salePointId: params.sale_point_id,
					pinfl: search ? search : params.pinfl,
					dateFrom: dateFrom,
					dateTo: dateTo,
				},
			});
		},
	});
	const onSearch = (value: any) => {
		const searchField = value.toLowerCase();
		getCustomerPinfl(searchField);
	};

	const data = get(queryApplications, 'data.data.data.content', []);
	const total = get(queryApplications, 'data.data.data.totalElements', []);

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
			title: t('Информация о клиенте'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('ПИНФЛ'),
					dataIndex: 'clientPinfl',
					align: 'center',
				},
				{
					title: t('ФИО'),
					dataIndex: '',
					align: 'center',
					render(value, record, index) {
						const fullName = ''.concat(
							get(record, 'client.firstName', ''),
							' ',
							get(record, 'client.lastName', ''),
							' ',
							get(record, 'client.middleName', ''),
						);
						return <>{fullName}</>;
					},
				},
				{
					title: t('Пол'),
					dataIndex: '',
					render(value, record, index) {
						const gender = get(record, 'client.gender', '');
						if (gender == 'MALE') return t('Муж.');
						return t('Жен.');
					},

					align: 'center',
				},
				{
					title: t('Возвраст'),
					dataIndex: '',
					align: 'center',
				},
				{
					title: t('Номер телефона 1/2'),
					dataIndex: '',
					align: 'center',
					render(value, record, index) {
						const phoneNumber = ''.concat(
							get(record, 'clientProfile.phone1', ''),
							' / ',
							get(record, 'clientProfile.phone2', ''),
						);
						return <>{phoneNumber}</>;
					},
				},
				{
					title: t('Адрес'),
					dataIndex: '',
					align: 'center',
					render(value, record, index) {
						const address = ''.concat(
							get(record, 'clientProfile.regionName', ''),
							', ',
							get(record, 'clientProfile.districtName', ''),
							', ',
							get(record, 'clientProfile.neighborhood', ''),
							' (', t('махалля'), ') ',
							get(record, 'clientProfile.street', ''),
							' (', t('улица'), ') ', t('дом/квартира: '),
							get(record, 'clientProfile.livingAddress', ''),
							'/',
							get(record, 'clientProfile.homeNumber', ''),
						);
						return <>{address}</>;
					},
				},
			],
		},
		{
			title: t('Информация о покупке'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Сумма покупки '),
					dataIndex: 'paymentSumWithVat',
					align: 'center',
				},
				{
					title: t('Сумма рассрочки'),
					dataIndex: 'paymentSumDeferral',
					align: 'center',
				},
				{
					title: t('Сумма аванса'),
					dataIndex: 'paidSum',
					align: 'center',
				},
				{
					title: t('Ежемесячный платеж'),
					dataIndex: 'paymentMonthLy',
					align: 'center',
				},
				{
					title: t('Период рассрочки'),
					dataIndex: 'paymentPeriod',
					align: 'center',
					render(value, record, index): JSX.Element {
						return <div>{value} {t('мес.')}</div>;
					},
				},
				{
					title: t('Количество товара'),
					dataIndex: 'id',
					align: 'center',

					render(value, record, index) {
						return (
							rolesName === 'COMPANY_ADMIN' ?
								(<Button
									onClick={() => navigate(`/company-admin/applications/${value}/${params.sale_point_id}/${params.salePointName}`)}>
									{value}
								</Button>) :
								(<Button
									onClick={() => navigate(`/nasiya/applications/${value}/${params.sale_point_id}/${params.salePointName}`)}>
									{value}
								</Button>)

						);
					},
				},
			],
		},
		{
			title: t('Информация о транзакциях'),
			dataIndex: '',
			align: 'center',
			children: [
				{
					title: t('Номер заявления'),
					dataIndex: 'id',
					align: 'center',
				},
				{
					title: t('Дата создания'),
					dataIndex: 'createdAt',
					align: 'center',
					render(value, record, index) {
						return (
							moment(value).format('DD.MM.YYYY')
						);
					},
				},
				{
					title: t('Продавец'),
					dataIndex: '',
					align: 'center',
					render(value, record, index) {
						return <>{get(record, 'createdBy.fullName', '')}</>;
					},
				},
				{
					title: t('Статус'),
					dataIndex: '',
					align: 'center',
				},
				{
					title: t('Одобренная сумма'),
					dataIndex: '',
					align: 'center',
					render(value, record, index) {
						return <>{formatNumber(get(record, 'clientScoring.scoringSum', ''))}</>;
					},
				},
				{
					title: t('Оплата'),
					dataIndex: '',
					align: 'center',
				},
			],
		},
	];

	return (
		<>

			<div className='flex justify-between'>
				<div>
					{rolesName === 'COMPANY_ADMIN' ?
						(<Button onClick={() => navigate(`/company-admin/business-report-scoring`)}>
							<div className='flex space-x-1 '>
								<div>
									<ArrowLeft strokeWidth={2} />
								</div>
								<div>{t('Nazad')}</div>
							</div>
						</Button>) :
						(<Button onClick={() => navigate(`/nasiya/business-report-scoring`)}>
							<div className='flex space-x-1 '>
								<div>
									<ArrowLeft strokeWidth={2} />
								</div>
								<div>{t('Nazad')}</div>
							</div>
						</Button>)
					}
				</div>
				<div>
					<Title level={3}>
						{t('Информация о объемах реализации магазина')}: "{params.salePointName}"
					</Title>
				</div>
				<div></div>
			</div>

			<div className='h-[20px]' />

			<div className='flex items-center justify-between  w-full'>
				<div className='flex gap-6'>
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
					<Search
						placeholder={t('Поиск по ПИНФЛ')}
						allowClear
						enterButton={t('Найти')}
						size='large'
						onSearch={onSearch}
					/>
				</div>
				<div></div>
			</div>
			<div className='h-[20px]' />
			<Spin spinning={queryApplications.status === 'loading'}>
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

export default BusinessReportScoringDetails;
