import { req } from '@/services/api.ts';
import { useQuery } from '@tanstack/react-query';
import { Button, Segmented, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import AddCompanyUsersModal from '@/pages/company/admin/AddCompanyUsersModal.tsx';

import useAuthUser from '@/auth/useAuthUser.tsx';
import moment from 'moment/moment';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Buyers from '@/pages/buyers';
import { Text } from '@geist-ui/core';

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

export default function UsersList() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const user = useAuthUser();
	const companyId = get(user, 'data.data.data.companyId', null);
	const params = useParams();
	const { Title } = Typography;
	const [filter, setFilter] = useState({
		tab: 'users',
	});
	const queryCompanyUsers = useQuery({
		queryKey: ['queryCompanies', companyId, params.salePointId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/auth/get-users-list`,
				params: {
					companyId: companyId,
					salePointId: params.salePointId,
				},
			});
		},
	});

	const data = get(queryCompanyUsers, 'data.data.data.content', []) as ICompanyUsers[];
	const total = get(queryCompanyUsers, 'data.data.data.totalElements', 0) as number;

	const [visible, setVisible] = useState(false);

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
			title: t('createdAt'),
			dataIndex: 'createdAt',
			align: 'center',
			render(value, record, index) {
				return moment(value).format('DD.MM.YYYY');
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
	];

	return (
		<>

			{!params.salePointName ? (
				<p>
					<Text h3>{t('Xodim reyesti')}</Text>
				</p>
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


			<div className='h-[20px]' />

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

						<AddCompanyUsersModal onAdd={() => queryCompanyUsers.refetch()} />
					</div>
					<div className='h-[20px]' />
					<Table pagination={false} dataSource={data} columns={columnsUser} />
				</>
			) : null}

			{filter.tab === 'buyers' ? <Buyers /> : null}
		</>
	);
}
