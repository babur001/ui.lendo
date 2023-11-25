import { req } from '@/services/api';
import { Pagination, Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Button, Table, DatePicker, Typography, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { concat, get } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatNumber } from '@/auth/Scoring.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';
import moment from 'moment/moment';

const SIZE = 10;

function ApplicationDetails() {
	const navigate = useNavigate();
	const { Title } = Typography;
	const params = useParams();
	const { t, i18n } = useTranslation();
	const user = useAuthUser();
	const rolesName = get(user, 'data.data.data.roles.0.name', null);
	const [page, setPage] = useState(1);

	const queryApplications = useQuery({
		queryKey: ['queryApplications', params.applicationId],

		queryFn: () => {
			return req({
				method: 'GET',
				url: `/registration/get-applications`,
				params: {
					id: params.applicationId,
				},
			});
		},
	});
	const data = get(queryApplications, 'data.data.data.content', []);
	const total = get(queryApplications, 'data.data.data.totalElements', []);
	const createdAtApplication = get(queryApplications, 'data.data.data.content.0.createdAt', []);
	const createdByApplication = get(queryApplications, 'data.data.data.content.0.createdBy.fullName', []);
	const createdByPinflApplication = get(queryApplications, 'data.data.data.content.0.createdBy.pinfl', []);
	const client = get(queryApplications, 'data.data.data.content.0.client', []);
	const clientPinfl = get(queryApplications, 'data.data.data.content.0.client.pinfl', []);
	const clientFio = concat(get(client, 'firstName', ''), ' ',
		get(client, 'lastName', ''), ' ', get(client, 'middleName', ''));

	const paymentSumWithVat = get(queryApplications, 'data.data.data.content.0.paymentSumWithVat', []);
	const paymentSumDeferral = get(queryApplications, 'data.data.data.content.0.paymentSumDeferral', []);
	const paymentPeriod = get(queryApplications, 'data.data.data.content.0.paymentPeriod', []);


	const columns: ColumnsType<any> = [
		{
			title: t('№'),
			dataIndex: '',
			render(value, record: any, index) {
				return <div>{index + 1}</div>;
			},
			align: 'center',
		},

		{
			title: t('Наименование товара'),
			dataIndex: 'name',
			align: 'center',
		},
		{
			title: t('Цена'),
			dataIndex: 'price',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('НДС на 1 ед.товара'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return formatNumber(record.price / record.amount);
			},
		},
		{
			title: t('Цена с НДС'),
			dataIndex: 'priceWithVat',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Количество'),
			dataIndex: 'amount',
			align: 'center',
			render(value, record, index) {
				return formatNumber(value);
			},
		},
		{
			title: t('Сумма всей покупки'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return formatNumber(paymentSumWithVat);
			},
		},
		{
			title: t('Сумма рассрочки'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return formatNumber(paymentSumDeferral);
			},
		},
		{
			title: t('Период рассрочки'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return <div>{paymentPeriod} {t('мес.')}</div>;
			},
		},
	];
	return (
		<>
			<div className='flex justify-center'>
				<div></div>
				<div>
					<div><Title level={4}>Информация о покупке</Title></div>
					<div>{t('Заявление №')} {params.applicationId}</div>
					<div>{t('Дата создания заявки')}: {moment(createdAtApplication).format('DD.MM.YYYY')}
					</div>
					<div>Покупатель: {clientFio}, {clientPinfl}</div>
					<div>Продавец: {createdByApplication}, {createdByPinflApplication}</div>
				</div>
				<div></div>
			</div>
			<div className='h-[20px]' />

			{rolesName === 'COMPANY_ADMIN' ? (
				<Button
					onClick={() => navigate(`/company-admin/business-report-scoring-details/${params.sale_point_id}/${params.salePointName}`)}>
					<div className='flex space-x-1 '>
						<div>
							<ArrowLeft strokeWidth={2} />
						</div>
						<div>{t('Nazad')}</div>
					</div>
				</Button>
			) : (
				<Button
					onClick={() => navigate(`/nasiya/business-report-scoring-details/${params.sale_point_id}/${params.salePointName}`)}>
					<div className='flex space-x-1 '>
						<div>
							<ArrowLeft strokeWidth={2} />
						</div>
						<div>{t('Nazad')}</div>
					</div>
				</Button>
			)}
			<Spin spinning={queryApplications.status === 'loading'}>
				<Table bordered
							 pagination={false}
							 dataSource={get(data, '0.items', [])}
							 columns={columns}
							 rowClassName={(row, idx) => {
								 if (idx % 2 === 0) {
									 return '';
								 }
								 return '!bg-gray-50';
							 }} />
				<div className='h-[20px]' />
				<div className='flex gap-5'>
					<div>
						<Pagination count={Math.ceil(total / SIZE)} page={page} onChange={setPage}>
							<Pagination.Previous>{t('Oldin')}</Pagination.Previous>
							<Pagination.Next>{t('Keyin')}</Pagination.Next>
						</Pagination>
					</div>
					<div className='mr-10 pt-1.5'>{t('Всего записей')}: {total}</div>
				</div>
			</Spin>
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
	paymentSumDeferral: number;
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

export default ApplicationDetails;
