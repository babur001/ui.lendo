import AddSalePointModal from '@/pages/company/admin/AddSalePointModal.tsx';
import { req } from '@/services/api';
import { Pagination } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Table, Segmented, Typography, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useState } from 'react';
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

const SIZE = 10;

export default function SalePointList() {
	const { t } = useTranslation();
	const { Title } = Typography;
	const { companyId } = useParams();
	const [page, setPage] = useState(1);
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
			title: t("Do'kon nomi"),
			dataIndex: 'name',
			align: 'center',
		},
		{
			title: t("Do'kon joylashgan viloyat"),
			dataIndex: 'regionName',
			align: 'center',
		},
		{
			title: t("Do'kon joylashgan tuman"),
			dataIndex: 'districtName',
			align: 'center',
		},
		{
			title: t("Do'kon joylashgan manzil"),
			dataIndex: 'address',
			align: 'center',
		},
		{
			title: t('Дата регистрации'),
			dataIndex: 'created_at',
			align: 'center',
			render(value, record, index) {
				return moment(value).format('DD.MM.YYYY');
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

			<div className='h-[20px]' />

			{filter.tab === 'sale_points' ? (
				<>
					<div className='w-full flex items-center justify-between'>
						<Title level={2} my-0>
							{t('Пункты продаж')}
						</Title>
						<AddSalePointModal onAdd={() => querySalePoints.refetch()} />
					</div>

					<Spin spinning={querySalePoints.status === 'loading'}>
						<Table
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
						<div>
							<div className='h-[20px]' />
							<div className='flex gap-5'>
								<div>
									<Pagination count={Math.ceil(total / SIZE)} page={page} onChange={setPage}>
										<Pagination.Previous>{t('Oldin')}</Pagination.Previous>
										<Pagination.Next>{t('Keyin')}</Pagination.Next>
									</Pagination>
								</div>
								<div className='mr-10 pt-1.5'>
									{t('Всего записей')}: {total}
								</div>
							</div>
						</div>
					</Spin>
				</>
			) : null}

			{filter.tab === 'users' ? <UsersList /> : null}
		</>
	);
}
