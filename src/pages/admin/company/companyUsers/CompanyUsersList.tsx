import { req } from '@/services/api.ts';
import { Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Button, Layout, Select, Table, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

interface ICompanyUsers {
	id: string | number;
	pinfl: string;
	fullName: string;
	phone: string;
	username: string;
	password: string;
	roles: {
		id: string;
		name: string;
	}[];
}

export default function CompanyUsersList() {
	const { t } = useTranslation();
	const params = useParams();

	const queryCompanyUsers = useQuery({
		queryKey: ['queryCompanies', params.companyId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/auth/get-users-list`,
				params: {
					companyId: params.companyId,
				},
			});
		},
	});

	const navigate = useNavigate();
	const data = get(queryCompanyUsers, 'data.data.data.content', []) as ICompanyUsers[];
	const total = get(queryCompanyUsers, 'data.data.data.totalElements', 0) as number;

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
			align: 'center',
		},
		{
			title: t('Ходим телефон рақами'),
			dataIndex: 'phone',
			align: 'center',
		},
		{
			title: t('Login'),
			dataIndex: 'username',
			align: 'center',
		},
		{
			title: t('Роль'),
			dataIndex: 'roles',
			align: 'center',
			render(value, record, index) {
				const role = get(value, '0.name', '-');
				return t(role);
			},
		},
		{
			title: t('Генератор роли'),
			dataIndex: 'roles',
			align: 'center',
			render(value, record, index) {
				const role = get(value, '0.name', '-');
				return t(role);
			},
		},
		{
			title: t("Дата регистрации"),
			dataIndex: "created_at",
			align: 'center',
			render(value, record, index) {
				return (
					moment(value).format("DD.MM.YYYY")
				);
			},
		},
	];

	return (
		<>
			<Text h3>{t('Xodim reyesti')}</Text>
			<div className='h-[20px]' />
			<div>
				<Button onClick={() => navigate(`/admin/clients`)}>
					<div className='flex space-x-1'>
						<div><ArrowLeft strokeWidth={2} /></div>
							<div>{t('Nazad')}</div>
						</div>

				</Button>
			</div>
			<div className='w-full flex items-center justify-end'>
				<div className='w-[40px]' />
			</div>
			<div className='h-[20px]' />
			<Table pagination={false} dataSource={data} columns={columnsUser} />
		</>
);
}
