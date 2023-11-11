import { req } from '@/services/api';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import moment from 'moment/moment';
import { useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

function CompanyApplications() {
	const { companyId } = useParams();
	const { t, i18n } = useTranslation();
	const queryApplications = useQuery({
		queryKey: ['queryApplications'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/registration/get-applications`,
				params: {
					companyId: companyId,
				},
			});
		},
	});

	const data = get(queryApplications, 'data.data.data.content', []);
	const total = get(queryApplications, 'data.data.data.totalElements', []);


	const excelDownloadMutation = useMutation({
		mutationKey: ['mutateExcel'],
		mutationFn: () => {
			return req({
				url: `/excel/get-applications`,
				params: {
				/*	'dateFrom': '01.01.2022',
					'dateTo': '01.01.2024',*/
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
		},

		{
			title: t('Рассрочка суммаси'),
			dataIndex: '',
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
		}, {
			title: t('Batafsil'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return (
					<Button>
						<ArrowRight strokeWidth={1} />
					</Button>
				);
			},
		},
	];
	return (
		<>
			<div className='h-[20px]' />
			<Text h3>{t('Список заявлений')}</Text>
			<div className='flex items-center justify-end w-full'>
				<Button size='large' loading={excelDownloadMutation.isLoading} onClick={excelDownload} type='primary'>
					{t('Загрузить в Excel')}
				</Button>
			</div>
			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columns} />
		</>
	);
}

export interface IApplications {
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
