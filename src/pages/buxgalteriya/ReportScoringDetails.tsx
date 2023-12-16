import { req } from '@/services/api.ts';
import { Pagination, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker, Spin, Typography, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { DATE_FORMAT, IReceiptsStore, useReceiptsStore } from '@/FiltrStore.tsx';
import moment from 'moment/moment';
import { formatNumber } from '@/auth/Scoring.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';
import { ICompanyUsers } from '@/pages/admin/company/companyUsers/CompanyUsersList.tsx';
import { Roles } from '@/pages/auth';


const SIZE = 10;

function BusinessReportScoringDetails() {
	const user = useAuthUser();
	const rolesName = get(user, 'data.data.data.roles.0.name', null);
	const companyId = get(user, 'data.data.data.companyId', null);
	const { t, i18n } = useTranslation();
	const { Title } = Typography;
	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const [page, setPage] = useState(1);
	const [employeeId, setUser] = useState(null);
	const [appStatus, setStatus] = useState(null);
	const params = useParams();
	const [search, getCustomerPinfl] = useState<string | undefined>('');
	const { dateFrom, dateTo, setRangeDate } = useReceiptsStore((store) => ({
		dateFrom: store.dateFrom,
		dateTo: store.dateTo,
		setRangeDate: store.setRangeDate,
	}));
	const setUserSelect = (value: any) => {
		setUser(value);
	};

	const setStatusSelect = (value: any) => {
		setStatus(value);
	};

	const navigate = useNavigate();

	const queryApplications = useQuery({
		queryKey: ['queryApplications', params.pinfl, search, params.sale_point_id, employeeId, appStatus],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/registration/get-applications`,
				params: {
					employeeId: employeeId,
					appStatus: appStatus,
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

	const queryCompanyUsers = useQuery({
		queryKey: ['queryCompanies', companyId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/auth/get-users-list`,
				params: {
					companyId: companyId,
					salePointId: params.salePointId,
					role: Roles.COMPANY_EMPLOYEE,
				},
			});
		},
		enabled: rolesName === Roles.COMPANY_ADMIN,
	});

	const dataUsers = get(queryCompanyUsers, 'data.data.data.content', []) as ICompanyUsers[];

	const columns: ColumnsType<any> = [
		{
			title: '№',
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				if (record.id === 0) return <></>;
				return <>{0 + index}</>;
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
					render(value, record, index) {
						if (record.id === 0) {
							return <div className='font-bold'>{t('Всего')}</div>;
						}
						return <>{value}</>;
					},
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
						if (record.id === 0) return <></>;
						return <>{fullName}</>;
					},
				},
				{
					title: t('Пол'),
					dataIndex: '',
					render(value, record, index) {
						const gender = get(record, 'client.gender', '');
						if (gender == 'MALE') return t('Муж.');
						if (record.id === 0) return <></>;
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
						if (record.id === 0) return <></>;
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
							' (',
							t('махалля'),
							') ',
							get(record, 'clientProfile.street', ''),
							' (',
							t('улица'),
							') ',
							t('дом/квартира: '),
							get(record, 'clientProfile.livingAddress', ''),
							'/',
							get(record, 'clientProfile.homeNumber', ''),
						);
						if (record.id === 0) return <></>;
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
					title: t('Результат скоринга'),
					dataIndex: 'applicationStatus',
					align: 'center',
					render(value, record, index): JSX.Element {
						if (record.id === 0) return <></>;
						if (value === 'SCORING_ERROR' || value === 'NEW' ||
							value === 'SCORING_SUCCESS' || value === 'CLIENT_APPROVED') {
							return <div>{t(value)}</div>;
						}
						return <div>{t('CLIENT_APPROVED')}</div>;
					},
					filterDropdown: () => {
						return (
							<Select
								onChange={setStatusSelect}
								allowClear
								placeholder={t('...')}
								className='!w-96'
								options={[
									{ value: 'NEW', label: t('NEW') },
									{ value: 'SCORING_ERROR', label: t('SCORING_ERROR') },
									{ value: 'SCORING_SUCCESS', label: t('SCORING_SUCCESS') },
									{ value: 'CLIENT_APPROVED', label: t('CLIENT_APPROVED') },
								]}
							/>
						);
					},
				},
				{
					title: t('Сумма покупки'),
					dataIndex: 'paymentSumWithVat',
					align: 'center',
					render(value, record, index) {
						if (record.id === 0) return <div className='font-bold'>{formatNumber(value)}</div>;
						return formatNumber(value);
					},
				},
				{
					title: t('Сумма рассрочки'),
					dataIndex: 'paymentSumDeferral',
					align: 'center',
					render(value, record, index) {
						if (record.id === 0) return <div className='font-bold'>{formatNumber(value)}</div>;
						return formatNumber(value);
					},
				},
				{
					title: t('Сумма аванса'),
					dataIndex: 'initialPayment',
					align: 'center',
					render(value, record, index) {
						if (record.id === 0) return <div className='font-bold'>{formatNumber(value)}</div>;
						return formatNumber(value);
					},
				},
				{
					title: t('Ежемесячный платеж'),
					dataIndex: 'paymentMonthLy',
					align: 'center',
					render(value, record, index) {
						if (record.id === 0) return <div className='font-bold'>{formatNumber(value)}</div>;
						return formatNumber(value);
					},
				},
				{
					title: t('Период рассрочки'),
					dataIndex: 'paymentPeriod',
					align: 'center',
					render(value, record, index): JSX.Element {
						if (record.id === 0) return <></>;
						if (record.id === 0) return <div className='font-bold'>{formatNumber(value)} {t('мес.')}</div>;
						return (
							<div>
								{formatNumber(value)} {t('мес.')}
							</div>
						);
					},
				},
				{
					title: t('Количество товара'),
					dataIndex: 'itemsCount',
					align: 'center',

					render(value, record, index) {
						if (record.id === 0) return <div className='font-bold'>{value}</div>;
						return rolesName === 'COMPANY_ADMIN' ? (
							<Button
								onClick={() =>
									navigate(`/company-admin/applications/${record.id}/${params.sale_point_id}/${params.salePointName}`)
								}
							>
								{value}
							</Button>
						) : (
							<Button
								onClick={() => navigate(`/nasiya/applications/${record.id}`)}
							>
								{value}
							</Button>
						);
					},
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
							render(value, record, index) {
								if (record.id === 0) return <></>;
								return value;
							},
						},
						{
							title: t('Дата создания'),
							dataIndex: 'createdAt',
							align: 'center',
							render(value, record, index) {
								if (record.id === 0) return <></>;
								return moment(value).format('DD.MM.YYYY');
							},
						},
						{
							title: t('Продавец'),
							dataIndex: '',
							align: 'center',
							render(value, record, index) {
								if (record.id === 0) return <></>;
								return <>{get(record, 'createdBy.fullName', '')}</>;
							},
							filterDropdown: () => {
								if (rolesName === Roles.COMPANY_ADMIN) {
									return (
										<Select
											onChange={setUserSelect}
											allowClear
											placeholder={t('...')}
											className='!w-96'
											options={dataUsers.map((user, idx) => {
												return {
													value: user.id,
													label: user.fullName,
												};
											})}
										/>
									);
								} else {
									return (
										<Select
											style={{ width: 120 }}
											options={[
												{
													value: null,
													label: null,
												},
											]}
										/>
									);
								}
							},
						},
						{
							title: t('Статус'),
							dataIndex: 'applicationStatus',
							align: 'center',
							render(value, record, index): JSX.Element {
								if (record.id === 0) return <></>;
								if (value === 'BANK_PAID') return <div>{t(value)}</div>;
								return <div>{t('не оплачено')}</div>;
							},
						},
						{
							title: t('Одобренная сумма'),
							dataIndex: '',
							align: 'center',
							render(value, record, index) {
								if (record.id === 0) return <></>;
								return <>{formatNumber(get(record, 'clientScoring.scoringSum', ''))}</>;
							},
						},
						{
							title: t('Оплата'),
							dataIndex: 'applicationStatus',
							align: 'center',
							render(value, record, index): JSX.Element {
								if (record.id === 0) return <></>;
								if (value === 'SEND_BANK' || value === 'BANK_ERROR' ||
									value === 'BANK_APPROVED' || value === 'BANK_PAID') {
									return <div>{t(value)}</div>;
								}
								return <div></div>;
							},
							filterDropdown: () => {
								return (
									<Select
										onChange={setStatusSelect}
										allowClear
										placeholder={t('...')}
										className='!w-96'
										options={[
											{ value: 'SEND_BANK', label: t('SEND_BANK') },
											{ value: 'BANK_ERROR', label: t('BANK_ERROR') },
											{ value: 'BANK_APPROVED', label: t('BANK_APPROVED') },
											{ value: 'BANK_PAID', label: t('BANK_PAID') },
										]}
									/>
								);
							},

						},
					],
				},
			],
		},
	];
	/*	if (rolesName === Roles.COMPANY_ADMIN) {
		 columns.push();
	 }*/

	return (
		<>
			<div className='flex justify-between'>
				<div>
					{rolesName === 'COMPANY_ADMIN' ? (
						<Button onClick={() => navigate(`/company-admin/business-report-scoring`)}>
							<div className='flex space-x-1 '>
								<div>
									<ArrowLeft strokeWidth={2} />
								</div>
								<div>{t('Nazad')}</div>
							</div>
						</Button>
					) : null}
				</div>
				<div>
					{rolesName === 'COMPANY_ADMIN' ? (
						<Title level={3}>
							{t('Информация об объемах реализации магазина')}: "{params.salePointName}"
						</Title>
					) : (
						<Title level={3}>{t('Информация об объемах реализации')}</Title>
					)}
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
					<Search placeholder={t('Поиск по ПИНФЛ')} allowClear enterButton={t('Найти')} size='large'
									onSearch={onSearch} />
				</div>
				<div></div>
			</div>
			<div className='h-[20px]' />
			<Spin spinning={queryApplications.status === 'loading'}>
				<Table
					size='small'
					scroll={{ x: 2400 }}
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