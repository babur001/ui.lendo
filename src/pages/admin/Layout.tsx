import { Dropdown, MenuProps, Select, Tag } from 'antd';
import { Lamp, Lock, LockIcon, LogOut, User, User2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/Logo';
import { TAdminPages } from '@/App';
import clsx from 'clsx';
import useAuthUser from '@/auth/useAuthUser';
import { get } from 'lodash';
import { TLanguages } from '@/auth/i18n';
import { useQuery } from '@tanstack/react-query';
import { req } from '@/services/api';
import TotalSingleProduct from '@/auth/TotalSingleProduct.tsx';
import { useSyncExternalStore } from 'react';

interface IProps {
	items: {
		key: string;
		icon: React.ReactNode;
		label: string;
	}[];
	children: React.ReactNode;
}

function Layout({ items, children }: IProps) {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const user = useAuthUser();

	const name = get(user, 'data.data.data.fullName', null);
	const companyName = get(user, 'data.data.data.company.name', null);
	const rolesName = get(user, 'data.data.data.roles.0.name', null);

	const fileGuid = get(user, 'data.data.data.fileGuid', null);

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
	const queryImage = useQuery({
		queryKey: ['queryImage'],
		queryFn: () => {
			return req({
				url: `/files/get-file/${fileGuid}`,
				method: 'GET',
			});
		},
	});

	const sidebarWidth = 320;
	const windowWidth = useSyncExternalStore(
		(cb) => {
			window.addEventListener('resize', cb);

			return () => window.removeEventListener('resize', cb);
		},
		() => window.innerWidth
	);

	return (
		<>
			<div className='flex h-screen'>
				<div style={{ width: sidebarWidth }} className='border-r border-gray-100 flex-shrink-0'>
					<div className='h-full flex flex-col justify-between'>
						<div className='!px-3'>
							<div className='!py-4 !pt-5'>
								<Logo className='!h-6' />
							</div>

							{items.map((item, idx) => {
								return (
									<div
										key={idx}
										onClick={() => navigate(item.key)}
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
					</div>
				</div>

				<div className='bg-gray-50/20' style={{ width: windowWidth - sidebarWidth }}>
					<header className='flex items-center justify-between border-b border-gray-300 !px-5 !py-1'>
						<Tag className='flex items-center justify-center !gap-2'>
							<User size={15} />
							{t(rolesName)} - {name}
							{''} {t('Органиция')}- "{companyName}"
						</Tag>

						<div className='space-x-5 flex items-center justify-end'>
							<div className='px-3'>
								<Select
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
					</header>

					<div className='py-5 px-5'>{children}</div>
				</div>
			</div>
		</>
	);
}

export default Layout;
