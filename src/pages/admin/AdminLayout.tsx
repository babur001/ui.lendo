import { Dropdown, MenuProps, Select } from 'antd';
import { Building, List, LogOut, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import Logo from '@/Logo';
import { TAdminPages } from '@/App';
import clsx from 'clsx';
import useAuthUser from '@/auth/useAuthUser';
import { get } from 'lodash';
import { TLanguages } from '@/auth/i18n';

function AdminLayout() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const { page } = useParams();

	const items: {
		key: TAdminPages;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			key: 'business-analytics',
			icon: <Building strokeWidth={1.5} className='!h-5' />,
			label: t(`Бизнес аналитика`),
		},
		{
			key: 'clients',
			icon: <Users strokeWidth={1.5} className='!h-5' />,
			label: t(`Реестр клиентов`),
		},
		{
			key: 'companies',
			icon: <List strokeWidth={1.5} className='!h-5' />,
			label: t(`Реестр кредитующих организации`),
		},
	];

	const user = useAuthUser();

	const name = get(user, 'data.data.data.fullName', null);
	const companyName = get(user, 'data.data.data.company.name', null);
	const rolesName = get(user, 'data.data.data.roles.0.name', null);

	const changeLanguageHandler = (lang: TLanguages) => {
		i18n.changeLanguage(lang);
	};

	const navItems: MenuProps['items'] = [
		{
			label: (
				<Link className='!text-red-500' to={`/logout`}>
					{t('Chiqish')}
				</Link>
			),
			icon: <LogOut size={18} strokeWidth={1.5} className='text-red-500' />,
			key: '1',
		},
	];

	return (
		<>
			<div className='flex h-screen'>
				<div className='w-[320px] border-r border-gray-100 flex-shrink-0'>
					<div className='h-full flex flex-col justify-between'>
						<div className='!px-3'>
							<div className='!py-4 !pt-5'>
								<Logo className='!h-6' />
							</div>

							{items.map((item, idx) => {
								return (
									<div
										key={idx}
										onClick={() => navigate(`/admin/${item.key}`)}
										className={clsx({
											'flex items-center !gap-3 bg-white text-gray-700 !py-3 !px-3 rounded-lg active:scale-95 duration-200 cursor-pointer select-none':
												true,
											'!bg-[#12b855]/10 !text-[#12b855]': window.location.pathname.includes(item.key),
										})}
									>
										{item.icon}
										<p className='!my-0 text-sm'>{item.label}</p>
									</div>
								);
							})}
						</div>

						<div className='space-y-5'>
							<div className='px-3'>
								<Select
									className='w-full'
									defaultValue={'ru'}
									onSelect={(e) => {
										changeLanguageHandler(e as TLanguages);
									}}
									options={
										[
											{
												label: 'Русский',
												value: 'ru',
											},
											{
												label: 'Ўзбекча',
												value: 'uz_kyrl',
											},
											{
												label: "O'zbekcha",
												value: 'uz_latn',
											},
										] satisfies { label: React.ReactNode; value: TLanguages }[]
									}
								/>
							</div>

							<Dropdown menu={{ items: navItems }} trigger={['click']} className='hover:bg-gray-100 px-3 py-3'>
								<div className='flex items-center !gap-3 cursor-pointer'>
									<img
										className='rounded-full w-8 h-8'
										src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
										alt='image'
									/>
									{user.data ? <div className='font-medium text-sm'>{companyName}</div> : null}
								</div>
							</Dropdown>
						</div>
					</div>
				</div>

				<div className='flex-grow py-5 px-5 bg-gray-50/20'>
					<Outlet />
				</div>
			</div>
		</>
	);
}

export default AdminLayout;
