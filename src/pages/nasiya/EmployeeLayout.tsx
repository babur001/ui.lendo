import { Building, LineChart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { TEmployeePages } from '@/App';
import React from 'react';
import Layout from '@/pages/admin/Layout';

function EmployeeLayout() {
	const { t, i18n } = useTranslation();

	const items: {
		key: TEmployeePages;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			key: 'analytics',
			icon: <LineChart strokeWidth={1.5} className='!h-5' />,
			label: t(`Статистика реализации`),
		},
		{
			key: 'default',
			icon: <Building strokeWidth={1.5} className='!h-5' />,
			label: t(`Рўйхатдан ўтказиш`),
		},
		{
			key: 'applications',
			icon: <Users strokeWidth={1.5} className='!h-5' />,
			label: t(`Список заявлений`),
		},
	];

	return (
		<>
			<Layout items={items}>
				<Outlet />
			</Layout>
		</>
	);
}

export default EmployeeLayout;
