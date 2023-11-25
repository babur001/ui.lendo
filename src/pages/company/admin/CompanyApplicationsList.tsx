import { req } from '@/services/api';
import { Text } from '@geist-ui/core';
	import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, DatePicker, Input, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import moment from 'moment/moment';
import { useNavigate, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { formatNumber } from '@/auth/Scoring.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';
import { DATE_FORMAT, IReceiptsStore, useReceiptsStore } from '@/FiltrStore.tsx';
import dayjs from 'dayjs';

function CompanyApplications() {
	const user = useAuthUser();
	const rolesName = get(user, 'data.data.data.roles.0.name', null);
	const navigate = useNavigate();
	const { Search } = Input;
	const { RangePicker } = DatePicker;
	const params = useParams();
	const { t, i18n } = useTranslation();
	const { Title } = Typography;
	const { dateFrom, dateTo, setRangeDate } = useReceiptsStore((store) => ({
		dateFrom: store.dateFrom,
		dateTo: store.dateTo,
		setRangeDate: store.setRangeDate,
	}));
	const [search, getCustomerPinfl] = useState<string | undefined>('');


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
	const data = get(queryApplications, 'data.data.data.content', []);
	const total = get(queryApplications, 'data.data.data.totalElements', []);

	const excelDownloadMutation = useMutation({
		mutationKey: ['mutateExcel', params.pinfl, search, params.sale_point_id],
		mutationFn: () => {
			return req({
				url: `/excel/get-applications`,
				params: {
					salePointId: params.sale_point_id,
					pinfl: search ? search : params.pinfl,
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
	const onSearch = (value: any) => {
		const searchField = value.toLowerCase();
		getCustomerPinfl(searchField);
	};

	const columns: ColumnsType<IApplications> = [
		{
			title: '№',
			dataIndex: 'NONE',
			align: 'center',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
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
			title: t('Суммаси всего товара'),
			dataIndex: 'paymentSumWithVat',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Рассрочка суммаси'),
			dataIndex: 'paymentSumDeferral',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Период рассрочки'),
			dataIndex: 'paymentPeriod',
			align: 'center',
			render(value, record, index) {
				return value + ' ' + 'мес.';
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
		{
			title: t('Номер заявления'),
			dataIndex: 'id',
			align: 'center',
			render(value, record, index) {
				return '№: ' + value;
			},

		},
		{
			title: t('Batafsil'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				if (rolesName === 'COMPANY_ADMIN') {
					return (
						<Button onClick={() => navigate(`/company-admin/applications/${record.id}/${params.sale_point_id}/${params.salePointName}`)}>
							<ArrowRight strokeWidth={1} />
						</Button>
					);
				} else {
					return (
						<Button onClick={() => navigate(`/nasiya/applications/${record.id}`)}>
							<ArrowRight strokeWidth={1} />
						</Button>
					);
				}

			},
		},
	];
	return (
		<>
			<div className='h-[20px]' />
			<Text h3>{t('Список заявлений')}</Text>
			<div className='flex justify-between'>
				{params.salePointName ? (
					<Button onClick={() => navigate(`/company-admin/business-report-scoring`)}>
						<div className='flex space-x-1 '>
							<div>
								<ArrowLeft strokeWidth={2} />
							</div>
							<div>{t('Nazad')}</div>
						</div>
					</Button>
				) : null}
				{params.salePointName ? (
					<Title level={2}>
						{t('Магазин')}: {params.salePointName}
					</Title>
				) : null}
				<div></div>
			</div>


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
				<Button size='large' loading={excelDownloadMutation.isLoading} onClick={excelDownload} type='primary'>
					{t('Загрузить в Excel')}
				</Button>
			</div>
			<div className='h-[20px]' />

			<Table bordered pagination={false} dataSource={data} columns={columns} />
		</>
	);
}

export interface IApplications {
	id: number;
	clientPinfl: number;
	paymentPeriod: number;
	paymentSum: number;
	paymentDayOfMonth: number;
	clientScoringId: number;
	paidSum: number;
	lastPaymentDate?: null;
	items?: ItemsEntity[] | null;
	client: Client;
	clientProfile: ProfilesEntityOrActiveProfileOrClientProfile;
	clientPaymentConfirmation?: null;
	createdAt: string | number;
}

export interface ItemsEntity {
	name: string;
	amount: number;
	price?: null;
	hasVat?: null;
	priceWithVat?: null;
}

export interface Client {
	pinfl: number;
	firstName: string;
	lastName: string;
	middleName: string;
	passportSerial: string;
	passportNumber: string;
	passportGivenBy: string;
	gender: string;
	citizenship: string;
	createdAt?: null;
	updatedAt?: null;
	fileId?: null;
	profiles?: ProfilesEntityOrActiveProfileOrClientProfile[] | null;
	activeProfile: ProfilesEntityOrActiveProfileOrClientProfile;
}

export interface ProfilesEntityOrActiveProfileOrClientProfile {
	id: number;
	phone1: string;
	phone2: string;
	livingAddress: string;
	country: string;
	regionCode: number;
	regionName: string;
	district_code: number;
	districtName: string;
	neighborhood: string;
	street: string;
	homeNumber: string;
	flatNumber: string;
	clientPinfl: number;
	createdAt?: null;
	updatedAt?: null;
}

export default CompanyApplications;
