import { req } from '@/services/api';
import { Description, Spinner, Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';


export interface IBuyer {
	pinfl: number;
	clientProfileId: number;
	paymentPeriod: number;
	initialPayment: number;
	paymentSum: number;
	paymentDayOfMonth: number;
	clientScoringId: number;
	clientPaymentConfirmationId?: null;
	items?: ItemsEntity[] | null;
	client: Client;
	clientProfile: ProfilesEntityOrActiveProfileOrClientProfile;
	clientPaymentConfirmation?: null;
}

export interface ItemsEntity {
	name: string;
	amount: number;
	price?: null;
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

function CompanyBuyers() {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const { companyId } = useParams();
	const queryBuyers = useQuery({
		queryKey: ['queryBuyers'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/home/get-clients`,
				params: {
					companyId: companyId,
				},
			});
		},
	});
	const data = get(queryBuyers, 'data.data.data.content', []);
	const total = get(queryBuyers, 'data.data.data.totalElements', []);

	const columns: ColumnsType<IBuyer> = [
		{
			title: '№',
			dataIndex: 'NONE',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('ПИНФЛ'),
			dataIndex: 'pinfl',
		},
		{
			title: t('ФИО'),
			dataIndex: '',
			render(value, record, index) {
				const fullName = ''.concat(
					get(record, 'firstName', ''),
					' ',
					get(record, 'lastName', ''),
					' ',
					get(record, 'middleName', ''),
				);

				return <>{fullName}</>;
			},
		},

		{
			title: t("Количество сделок"),
			dataIndex: "applicationCount",
		},
		{
			title: t("Рассрочка суммаси"),
			dataIndex: "paymentSum",
		},
		{
			title: t("Епилган сумма"),
			dataIndex: "paidSum",  //ШЕР
		},
		{
			title: t('Batafsil'),
			dataIndex: '',
			render(value, record, index) {
				return (
					<Button onClick={() => navigate(`/admin/buyers/${record.pinfl}`)}>
						<ArrowRight strokeWidth={1} />
					</Button>
				);
			},
		},
	];
	return (
		<>


			<div className='h-[20px]' />

			<Text h3>{t('Ҳаридорлар рўйхати')}</Text>

			<div className='h-[20px]' />

			<Table pagination={false} dataSource={data} columns={columns} />
		</>
	);
}

export default CompanyBuyers;
