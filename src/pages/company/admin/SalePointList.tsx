import AddSalePointModal from '@/pages/company/admin/AddSalePointModal.tsx';
import { req } from '@/services/api';
import { Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, Layout, Select, Segmented, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useState } from 'react';
import Buyers from '@/pages/buyers';
import UsersList from '@/pages/company/admin/UsersList.tsx';

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
	const { Title } = Typography;
	const navigate = useNavigate();
	const { companyId } = useParams();
	const [filter, setFilter] = useState({
		tab: 'sale_points',
	});

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
		/*{
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
		},*/
	];

	return (
		<>
			<div className='w-full flex items-center justify-start'>
				<Segmented
					onChange={(tab) => setFilter({ ...filter, tab: tab as string })}
					value={filter.tab}
					options={[
						{
							label: <div style={{ padding: 4, width: 200 }}>{t('Пункты продаж')}</div>,
							value: 'sale_points',
						},
						{
							label: <div style={{ padding: 4, width: 200 }}>{t('Сотрудники')}</div>,
							value: 'users',
						},
					]}
				/>
			</div>
			{filter.tab === 'sale_points' ? (
				<>
					<div className='w-full flex items-center justify-between'>
						<div></div>
						<Title level={2}>
							{t('Пункты продаж')}
						</Title>
						<div></div>
					</div>
					<div className='w-full flex items-center justify-end'>
						<AddSalePointModal onAdd={() => querySalePoints.refetch()} />
					</div>
					<div className='h-[20px]' />
					<Table pagination={false} dataSource={data} columns={columns} />
				</>
			) : null}

			{filter.tab === 'users' ? <UsersList /> : null}

		</>
	);
}
