import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import AddCompanyUsersModal from '@/pages/company/admin/AddCompanyUsersModal.tsx';

import useAuthUser from '@/auth/useAuthUser.tsx';
import moment from 'moment/moment';

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

	const user = useAuthUser();
	const companyId = get(user, 'data.data.data.companyId', null);
	const queryCompanyUsers = useQuery({
		queryKey: ['queryCompanies'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/auth/get-users-list`,
				params: {
					companyId: companyId,
				},
			});
		},
	});

	const data = get(queryCompanyUsers, 'data.data.data.content', []) as ICompanyUsers[];
	const total = get(queryCompanyUsers, 'data.data.data.totalElements', 0) as number;

	const columnsUser: ColumnsType<ICompanyUsers> = [
		{
			title: '№',
			dataIndex: 'NONE',
			render(value, record, index) {
				return <>{1 + index}</>;
			},
		},
		{
			title: t('Ходим СТИРи'),
			dataIndex: 'pinfl',
		},
		{
			title: t('Ходим ФИШ'),
			dataIndex: 'fullName',
		},
		{
			title: t('Ходим телефон рақами'),
			dataIndex: 'phone',
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
			title: t('Создатель'),
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
			render(value, record, index) {
				return moment(value).format('DD.MM.YYYY');
			},
		},
		{
			title: t("Do'kon nomi"),
			dataIndex: 'salePoint',
			render(value, record, index) {
				const salePointName = get(value, 'name', '-');
				const regionName = get(value, 'regionName', '-');
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
			<Text h3>{t('Xodim reyesti')}</Text>
			<div className='w-full flex items-center justify-end'>
				<AddCompanyUsersModal onAdd={() => queryCompanyUsers.refetch()} />
				<div className='w-[40px]' />
			</div>
			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columnsUser} />
		</>
	);
}
