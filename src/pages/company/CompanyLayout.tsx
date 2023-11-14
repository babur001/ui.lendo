import { BarChart2, Building, LineChart, Users, BookIcon, ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { TCompanyPages } from '@/App';
import React from 'react';
import Layout from '@/pages/admin/Layout';

function CompanyLayout() {
	const { t, i18n } = useTranslation();

	const items: {
		key: TCompanyPages;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			key: 'analytics',
			icon: <LineChart strokeWidth={1.5} className='!h-5' />,
			label: t(`Статистика реализации`),
		},
		{
			key: 'business-report',
			icon: <BarChart2 strokeWidth={1.5} className='!h-5' />,
			label: t(`Отчет по реализациям`),
		},
		{
			key: 'sale-points',
			icon: <Building strokeWidth={1.5} className='!h-5' />,
			label: t(`Магазины`),
		},
		{
			key: 'company-users',
			icon: <Users strokeWidth={1.5} className='!h-5' />,
			label: t(`Xodim reyesti`),
		},
		{
			key: 'company-buyers',
			icon: <BookIcon strokeWidth={1.5} className='!h-5' />,
			label: t(`Покупатели`),
		},
		{
			key: 'company-applications',
			icon: <ListIcon strokeWidth={1.5} className='!h-5' />,
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

export default CompanyLayout;
