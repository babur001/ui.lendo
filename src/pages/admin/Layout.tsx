import { Dropdown, MenuProps, Select, Tag, Tooltip } from 'antd';
import { Building, Lamp, Lock, LockIcon, LogOut, User, User2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/Logo';
import clsx from 'clsx';
import useAuthUser from '@/auth/useAuthUser';
import { get } from 'lodash';
import { TLanguages } from '@/auth/i18n';
import { useQuery } from '@tanstack/react-query';
import { req } from '@/services/api';
import { useSyncExternalStore } from 'react';
import { Roles } from '@/pages/auth';

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
	const salePointName = get(user, 'data.data.data.salePoint.name', null);
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
		queryKey: ['queryImage', fileGuid],
		queryFn: () => {
			return req({
				url: `/files/get-file/${fileGuid}`,
				method: 'GET',
				responseType: 'blob',
			});
		},
		enabled: !!fileGuid,
	});
	const image = get(queryImage, 'data.data', null);
	const url = image ? URL.createObjectURL(image) : '';

	const sidebarWidth = 240;
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

										{item.label.length > 22 ? (
											<Tooltip title={item.label}>
												<p className='!my-0 text-sm truncate'>{item.label}</p>
											</Tooltip>
										) : (
											<p className='!my-0 text-sm truncate'>{item.label}</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className='bg-gray-50/20' style={{ width: windowWidth - sidebarWidth }}>
					<header className='flex items-start justify-between border-b border-gray-300 !px-5 !py-1'>
						<div>
							<Tag>
								<div className='flex'>
									<div className='flex gap-2'>
										<User className='mt-0.5' size={15} strokeWidth={1.5} />
										<div className='font-bold mr-1'>{t(rolesName)}</div>
									</div>
									- {name}
								</div>
								<div className='flex'>
									<div className='flex gap-2'>
										<Building className='mt-0.5' size={15} strokeWidth={1.5} />
										<div className='font-bold mr-1'>{t('Органиция')}</div>
									</div>
									- "{companyName}"
									{rolesName === Roles.COMPANY_EMPLOYEE ? (
										<div className='ml-1'>
											{t('(Магазин')}:{salePointName})
										</div>
									) : null}
									``{' '}
								</div>
							</Tag>
						</div>

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
									{queryImage.status === 'loading' ? null : <img className='rounded-full !w-8 !h-8' src={url} alt='image' />}
									{user.data ? <div className='font-medium text-sm'>{name}</div> : null}
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
