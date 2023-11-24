import { req } from '@/services/api.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, message, Modal, Segmented, Spin, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import AddCompanyUsersModal from '@/pages/company/admin/AddCompanyUsersModal.tsx';

import useAuthUser from '@/auth/useAuthUser.tsx';
import moment from 'moment/moment';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Delete } from 'lucide-react';
import React, { useState } from 'react';
import Buyers from '@/pages/buyers';
import { Pagination } from '@geist-ui/core';

interface ICompanyUsers {
	id: string | number;
	pinfl: string;
	fullName: string;
	phone: string;
	username: string;
	password: string;
	createdAt: string;
	roles: {
		id: string;
		name: string;
	}[];
	createdBy: {
		fullName: string;
		roles: {
			name: string;
		}[];
	};
	manager: { fullName: string };
	salePoint: { name: string; regionName: string; districtName: string; address: string };
}

const SIZE = 20;

export default function UsersList() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const user = useAuthUser();
	const companyId = get(user, 'data.data.data.companyId', null);
	const params = useParams();
	const [modalId, setModalId] = useState<string | number | null>(null);
	const { Title } = Typography;
	const [filter, setFilter] = useState({
		tab: 'users',
	});
	const [page, setPage] = useState(1);

	const queryCompanyUsers = useQuery({
		queryKey: ['queryCompanies', companyId, params.salePointId, page],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/auth/get-users-list`,
				params: {
					companyId: companyId,
					salePointId: params.salePointId,
					page: page - 1,
					size: SIZE,
				},
			});
		},
	});
	const data = get(queryCompanyUsers, 'data.data.data.content', []) as ICompanyUsers[];
	const total = get(queryCompanyUsers, 'data.data.data.totalElements', 0) as number;

	const mutateDeleteUser = useMutation({
		mutationKey: ['queryDeleteUser'],
		mutationFn: (user_id: string | number) => {
			return req({
				method: 'POST',
				url: `/auth/disables-users`,
				data: [user_id],
			});
		},
	});

	const onDelete = async () => {
		if (!modalId) {
			return message.error(t(`Маълумотлар топилмади`));
		}

		const res = await mutateDeleteUser.mutateAsync(modalId as string);

		const success = get(res, 'data.success', false);

		if (!success) {
			message.error(t(`Kutilmagan xatolik!`));
			setModalId(null);
		} else {
			message.success(t(`O'chirildi`));
			setModalId(null);
		}
	};

	const columnsUser: ColumnsType<ICompanyUsers> = [
		{
			title: '№',
			dataIndex: 'NONE',
			align: 'center',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('Ходим СТИРи'),
			dataIndex: 'pinfl',
			align: 'center',
		},
		{
			title: t('Ходим ФИШ'),
			dataIndex: 'fullName',
		},
		{
			title: t('Ходим телефон рақами'),
			dataIndex: 'phone',
			align: 'center',
		},
		{
			title: t('Login'),
			dataIndex: 'username',
		},
		{
			title: t('Роль'),
			dataIndex: 'roles',
			render(value, record, index) {
				const role = get(value, '0.name', '-');
				return t(role);
			},
		},
		{
			title: t('Генератор роли'),
			dataIndex: 'createdBy',
			render(value, record, index) {
				const fullName = get(value, 'fullName', '-');
				const role = get(value, 'roles', '-');
				const role_ch = get(role, '0.name', '-');
				return t(fullName) + ' (' + t(role_ch) + ')';
			},
		},
		{
			title: t('Do\'kon nomi'),
			dataIndex: 'salePoint',
			render(value, record, index) {
				const salePointName = get(value, 'name', '-');
				const districtName = get(value, 'districtName', '-');
				const address = get(value, 'address', '-');
				if (salePointName === '-') {
					return '-';
				} else return t(salePointName) + ' (' + districtName + ', ' + address + ')';
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
			title: t('Статус'),
			dataIndex: 'enabled',
			align: 'center',
			render(value, record, index) {
				if (value) return <div>Актив</div>;
				return <div>Неактив</div>;
			},
		},

		{
			title: t('Удалить'),
			dataIndex: '',
			align: 'center',
			render(value, record, index) {
				return (
					<Button type='primary' danger onClick={() => setModalId(record.id)} size='middle'>
						{t('Удалить')}
					</Button>
				);
			},
		},
	];

	return (
		<>
			{!params.salePointName ? (
				<div className='w-full flex items-center justify-between'>
					<div></div>
					<Title level={2}>{t('Сотрудники')}</Title>
					<div></div>
				</div>
			) : null}

			{params.salePointName ? (
				<div className='w-full flex items-center justify-start'>
					<Segmented
						onChange={(tab) => setFilter({ ...filter, tab: tab as string })}
						value={filter.tab}
						options={[
							{
								label: <div style={{ padding: 4, width: 200 }}>{t('Xodim reyesti')}</div>,
								value: 'users',
							},
							{
								label: <div style={{ padding: 4, width: 200 }}>{t('Покупатели')}</div>,
								value: 'buyers',
							},
						]}
					/>
				</div>
			) : null}

			{filter.tab === 'users' ? (
				<>
					<div className='flex justify-between'>
						<div className='pr-400'>
							{params.salePointName ? (
								<Button onClick={() => navigate(`/company-admin/sale-points`)}>
									<div className='flex space-x-1 '>
										<div>
											<ArrowLeft strokeWidth={2} />
										</div>
										<div>{t('Nazad')}</div>
									</div>
								</Button>
							) : null}
						</div>
						{params.salePointName ? (
							<p>
								<Title level={2}>
									{t('Магазин')}: {params.salePointName}
								</Title>
							</p>
						) : null}

						{!params.salePointName ? <AddCompanyUsersModal onAdd={() => queryCompanyUsers.refetch()} /> : <div></div>}
					</div>
					<div className='h-[20px]' />
					<Spin spinning={queryCompanyUsers.status === 'loading'}>
						<Table
							pagination={false}
							dataSource={data}
							columns={columnsUser}
							rowClassName={(row, idx) => {
								if (idx % 2 === 0) {
									return '';
								}
								return '!bg-gray-50';
							}}
						/>
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
			) : null}

			{filter.tab === 'buyers' ? <Buyers /> : null}

			<Modal open={!!modalId} onCancel={() => setModalId(null)} footer={false}>
				<div className='h-[20px]' />
				<p className='flex justify-center'>
					<Title level={4}>{t('Уверены что хотите удалить из системы !')}</Title>
				</p>
				<div className='h-[20px]' />
				<div className='flex justify-between gap-5'>
					<Button
						className='w-full'
						type='primary'
						onClick={() => onDelete()}
						loading={mutateDeleteUser.status === 'loading'}
					>
						{t('Да')}
					</Button>

					<Button className='w-full' type='primary' onClick={() => setModalId(null)} danger>
						{t('Нет')}
					</Button>
				</div>
			</Modal>
		</>
	);
}
