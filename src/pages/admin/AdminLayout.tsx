import { Building, List, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { TAdminPages } from '@/App';
import Layout from '@/pages/admin/Layout';

function AdminLayout() {
	const { t, i18n } = useTranslation();

	const items: {
		key: `/admin/${TAdminPages}`;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			key: '/admin/business-analytics',
			icon: <Building strokeWidth={1.5} className='!h-5' />,
			label: t(`Бизнес аналитика`),
		},
		{
			key: '/admin/clients',
			icon: <Users strokeWidth={1.5} className='!h-5' />,
			label: t(`Реестр клиентов`),
		},
		{
			key: '/admin/companies',
			icon: <List strokeWidth={1.5} className='!h-5' />,
			label: t(`Реестр кредитующих организации`),
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

export default AdminLayout;
