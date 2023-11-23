import { req } from '@/services/api';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input, Button, Table, DatePicker, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { formatNumber } from '@/auth/Scoring.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';


function ApplicationDetails() {

	const navigate = useNavigate();
	const { Title } = Typography;
	const params = useParams();
	const { t, i18n } = useTranslation();
	const user = useAuthUser();
	const rolesName = get(user, 'data.data.data.roles.0.name', null);


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


	const columns: ColumnsType<IApplications> = [
		{
			title: t('№'),
			dataIndex: '',
			render(value, record: any, index) {
				return <div>{index + 1}</div>;

			},
		},

		{
			title: t('Товары'),
			dataIndex: 'items',
			render(value, record: any, index) {
				return record.items.map((item: any, index: any) => {
					return <div><Text className='underline'>{item.name}</Text></div>;
				});
			},
		},
		{
			title: t('Цена'),
			dataIndex: 'items',
			render(value, record: any, index) {
				return record.items.map((item: any, index: any) => {
					return <div><Text className='underline'> {item.price}</Text></div>;
				});
			},
		},
		{
			title: t('НДС'),
			dataIndex: 'items',
			render(value, record: any, index) {
				return record.items.map((item: any, index: any) => {
					if (item.hasVat == 1) {
						return <div><Text className='underline'>Товара с НДС</Text></div>;
					} else return <div><Text className='underline'>Товара без НДС</Text></div>;

				});
			},
		},
		{
			title: t('Цена с НДС'),
			dataIndex: 'items',
			render(value, record: any, index) {
				return record.items.map((item: any, index: any) => {
					return <div><Text className='underline'>{item.priceWithVat}</Text></div>;
				});
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
			dataIndex: 'Дата заявления',
			align: 'center',
			render(value, record, index) {
				return moment(value).format('DD.MM.YYYY');
			},
		},
	];


	return (
		<>
			<div className='flex justify-center'>
				<p>
					<Title level={2}>
						{t('Заявление №')} {params.applicationId}
					</Title>
				</p>
			</div>

			{rolesName === 'COMPANY_ADMIN' ? (<Button onClick={() => navigate(`/company-admin/applications/${params.sale_point_id}/${params.salePointName}`)}>
				<div className='flex space-x-1 '>
					<div>
						<ArrowLeft strokeWidth={2} />
					</div>
					<div>{t('Nazad')}</div>
				</div>
			</Button>) : (<Button onClick={() => navigate(`/nasiya/applications`)}>
				<div className='flex space-x-1 '>
					<div>
						<ArrowLeft strokeWidth={2} />
					</div>
					<div>{t('Nazad')}</div>
				</div>
			</Button>)}


			<Table bordered pagination={false} dataSource={data} columns={columns} />
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
