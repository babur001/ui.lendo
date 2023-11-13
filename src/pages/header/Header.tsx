import { Button, Layout, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TLanguages } from '@/auth/i18n.ts';
import i18n from 'i18next';
import useAuthUser from '@/auth/useAuthUser';
import { get } from 'lodash';

export default function Header() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const changeLanguageHandler = (lang: TLanguages) => {
		i18n.changeLanguage(lang);
	};
	const logout = () => {
		localStorage.removeItem('token');
		navigate('/auth');
	};

	const user = useAuthUser();

	const name = get(user, 'data.data.data.fullName', null);
	const companyName = get(user, 'data.data.data.company.name', null);
	const rolesName = get(user, 'data.data.data.roles.0.name', null);

	console.log(user.data);

	return (
		<header className='py-3'>
			<div className='flex items-center justify-between'>
				<div />
				<div className='px-3 flex items-center justify-end gap-5'>
					{user.data ? (
						<div className='font-bold italic'>
							{t(rolesName)} - {name}
							{''} {t('Органиция')}- "{companyName}"
						</div>
					) : null}

					<Select
						className='w-40'
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

					<Button className='flex items-center' danger onClick={logout}>
						{t('Chiqish')}
						<LogOut strokeWidth={1.5} size={14} className='!ml-4' />
					</Button>
				</div>
			</div>
		</header>
	);
}
