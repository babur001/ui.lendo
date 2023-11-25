import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { req } from '@/services/api';
import Logo from '@/Logo';
import { useTranslation } from 'react-i18next';
import { Lock, User2 } from 'lucide-react';

interface ILogin {
	username: string;
	password: string;
}

enum Roles {
	SUPER_ADMIN = 'SUPER_ADMIN',
	COMPANY_ADMIN = 'COMPANY_ADMIN',
	COMPANY_EMPLOYEE = 'COMPANY_EMPLOYEE',
	COMPANY_ACCOUNTANT = 'COMPANY_ACCOUNTANT',
	COMPANY_MANAGER = 'COMPANY_MANAGER',
	SALE_POINT_ADMIN = 'SALE_POINT_ADMIN',
}

function Login() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const mutateLogin = useMutation({
		mutationKey: ['mutateLogin'],
		mutationFn: (authParams: ILogin) => {
			return req({
				method: 'POST',
				url: `/auth/login`,
				data: {
					...authParams,
				},
			});
		},
	});

	const onFinish = async (values: ILogin) => {
		try {
			const res = await mutateLogin.mutateAsync(values);

			const accessToken = get(res, 'data.data.accessToken', null);
			const refreshToken = get(res, 'data.data.refreshToken', null);

			localStorage.setItem('token', accessToken);
			localStorage.setItem('refresh_token', refreshToken);

			const role = get(res, 'data.data.data.roles.0.name', {}) as Roles;

			switch (Roles[role]) {
				case Roles.SUPER_ADMIN:
					navigate('/admin');
					break;
				case Roles.COMPANY_EMPLOYEE:
					navigate('/nasiya');
					break;
				case Roles.COMPANY_ACCOUNTANT:
					navigate('/buxgalter');
					break;
				case Roles.COMPANY_MANAGER:
					navigate('/buxgalter');
					break;
				case Roles.COMPANY_ADMIN:
					navigate('/company-admin');
					break;
				case Roles.SALE_POINT_ADMIN:
					navigate('/company-admin');
					break;
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex items-center justify-center h-screen'>
			<div className='shadow-xl shadow-gray-600/10 rounded-lg !px-5 w-1/4'>
				<Form
					name='normal_login'
					className='w-full flex flex-col !gap-y-1'
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
				>
					<div className='h-[15px]' />

					<Logo className='h-8' />

					<div className='h-[15px]' />

					<Form.Item
						name='username'
						rules={[
							{
								required: true,
								message: t('Please input your Username!'),
							},
						]}
					>
						<Input
							size='large'
							prefix={<User2 strokeWidth={1.5} className='!mr-2' size={20} />}
							placeholder={t('Имя пользователя')}
						/>
					</Form.Item>
					<Form.Item
						name='password'
						rules={[
							{
								required: true,
								message: t('Please input your Password!'),
							},
						]}
					>
						<Input.Password
							size='large'
							prefix={<Lock strokeWidth={1.5} className='!mr-2' size={20} />}
							type='password'
							placeholder={t('Пароль')}
						/>
					</Form.Item>

					<Form.Item>
						<Button loading={mutateLogin.status === 'loading'} size='large' type='primary' htmlType='submit' block>
							{t('Авторизоваться')}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}

export default Login;
