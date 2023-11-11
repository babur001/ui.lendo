import AddSalePointModal from '@/pages/company/admin/AddSalePointModal.tsx';
import { req } from '@/services/api';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, Layout, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

export interface ICompany {
	createdAt: string;
	updatedAt: string;
	createdBy: CreatedByOrUpdatedBy;
	updatedBy: CreatedByOrUpdatedBy;
	companyId: number;
	id: number;
	latitude: string;
	longitude: string;
	name: string;
	regionName: string;
	regionCode: number;
	districtName: string;
	districtCode: number;
	address: string;
}

export interface CreatedByOrUpdatedBy {
	id: number;
	companyId: number;
}

export default function SalePointList() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { companyId } = useParams();

	const querySalePoints = useQuery({
		queryKey: ['querySalePoints', companyId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/company-admin/get-sale-points`,
				params: {
					companyId: companyId,
					page: 0,
					size: 20,
				},
			});
		},
	});




	const data = get(querySalePoints, 'data.data.data.content', []) as ICompany[];
	const total = get(querySalePoints, 'data.data.data.totalElements', 0) as number;

	const columns: ColumnsType<ICompany> = [
		{
			title: '№',
			dataIndex: 'NONE',
			align: 'center',
			render(value, record, index) {
				return <>{index + 1}</>;
			},
		},
		{
			title: t('Do\'kon nomi'),
			dataIndex: 'name',
			align: 'center',
		},
		{
			title: t('Do\'kon joylashgan viloyat'),
			dataIndex: 'regionName',
			align: 'center',
		},
		{
			title: t('Do\'kon joylashgan tuman'),
			dataIndex: 'districtName',
			align: 'center',
		},
		{
			title: t('Do\'kon joylashgan manzil'),
			dataIndex: 'address',
			align: 'center',
		},
		{
			title: t('Дата регистрации'),
			dataIndex: 'created_at',
			align: 'center',
			render(value, record, index) {
				return (
					moment(value).format('DD.MM.YYYY')
				);
			},
		},
		{
			title: t('Batafsil'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return (
					<Button onClick={() => navigate(`/company-admin/sale-points/${record.id}/${record.name}`)}>
						<ArrowRight strokeWidth={1} />
					</Button>
				);
			},
		},
	];

	return (
		<>
			<Text h3>{t('Реестр магазинов')}</Text>
			<div className='w-full flex items-center justify-end'>
				<AddSalePointModal onAdd={() => querySalePoints.refetch()} />
			</div>
			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columns} />


		</>
	);
}
