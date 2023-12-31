import { Description } from '@geist-ui/core';
import { Controller, useForm } from 'react-hook-form';

import { Button, Modal, Select, message, Upload } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { req } from '@/services/api.ts';
import { get } from 'lodash';
import { PatternFormat } from 'react-number-format';
import { Input as AntdInput } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { UploadIcon } from 'lucide-react';
import FileUpload from '@/pages/admin/company/FileUpload';

interface IProps {
	onAdd?: () => unknown;
}

interface ICompanyForm {
	tin: string;
	name: string;
	address: string;
	brandName: string;
	directorName: string;
	contact: string;
	bankId: string;
	operatorShare: string;
	user: {
		pinfl: string;
		fullName: string;
		username: string;
		password: string;
		phone: string;
		fileGuid: string;
	};
}

interface IBank {
	id: string | number;
	bankName: string | number;
}

function AddCompanyModal({ onAdd }: IProps) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const { handleSubmit, control, setValue } = useForm<ICompanyForm>();

	const mutateAddCompany = useMutation({
		mutationKey: ['mutateAddCompany'],
		mutationFn: (companyForm: ICompanyForm) => {
			return req({
				method: 'POST',
				url: `/admin/create-company`,
				data: {
					...companyForm,
					role: ['COMPANY_ADMIN'],
				},
			});
		},
	});

	const onSubmit = async (values: ICompanyForm) => {
		if (!values) {
			return message.error(t(`Маълумотлар топилмади`));
		}

		const res = await mutateAddCompany.mutateAsync(values);
		const success = get(res, 'data.success', false);
		if (!success) {
			message.error(t(`Kutilmagan xatolik!`));
		} else {
			message.success(t(`Qoshildi`));
			onAdd && onAdd();
			setIsOpen(false);
		}
	};

	const queryBanks = useQuery({
		queryKey: ['queryBanks'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/admin/get-banks`,
				params: {
					//
				},
			});
		},
		enabled: isOpen,
	});

	const bankData = get(queryBanks, 'data.data.data', []) as IBank[];
	return (
		<>
			<Button onClick={() => setIsOpen(true)} type='primary'>
				{t("Korxona qo'shish")}
			</Button>

			<Modal open={isOpen} onCancel={() => setIsOpen(false)} title={t("Korxona qo'shish")} footer={false}>
				<div className='h-[20px]' />
				<div className='flex flex-col gap-5'>
					<div className='col-span-2'>
						<Description
							title={t('Korxona STIRi')}
							content={
								<Controller
									control={control}
									name='tin'
									render={({ field }) => {
										return (
											<PatternFormat
												placeholder='...'
												format='##############'
												mask={' '}
												customInput={AntdInput}
												{...field}
											/>
										);
									}}
								/>
							}
						/>
					</div>
					<div className='col-span-2'>
						{t('Korxona nomi')}
						<Controller
							control={control}
							name='name'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						{t('BrandName')}
						<Controller
							control={control}
							name='brandName'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						{t('DirectorName')}
						<Controller
							control={control}
							name='directorName'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						<Description
							title={t('Contact')}
							content={
								<Controller
									control={control}
									name='contact'
									render={({ field }) => {
										return (
											<PatternFormat
												format='## ### ## ##'
												mask={' '}
												placeholder='...'
												customInput={AntdInput}
												addonBefore='+998'
												{...field}
											/>
										);
									}}
								/>
							}
						/>
					</div>
					<div className='col-span-2'>
						{t('Address company')}
						<Controller
							control={control}
							name='address'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						<Description
							title={t('Main Adminstrator JShShIRi')}
							content={
								<Controller
									control={control}
									name='user.pinfl'
									render={({ field }) => {
										return (
											<PatternFormat
												placeholder='...'
												format='##############'
												mask={' '}
												customInput={AntdInput}
												{...field}
											/>
										);
									}}
								/>
							}
						/>
					</div>
					<div className='col-span-2'>
						{t('Main Adminstrator FISh')}
						<Controller
							control={control}
							name='user.fullName'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						<Description
							title={t('Main Adminstrator telefon nomeri')}
							content={
								<Controller
									control={control}
									name='user.phone'
									render={({ field }) => {
										return (
											<PatternFormat
												format='## ### ## ##'
												mask={' '}
												placeholder='...'
												customInput={AntdInput}
												addonBefore='+998'
												{...field}
											/>
										);
									}}
								/>
							}
						/>
					</div>
					<div className='col-span-2'>
						{t('Login')}
						<Controller
							control={control}
							name='user.username'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						{t('Пароль')}
						<Controller
							control={control}
							name='user.password'
							render={({ field }) => {
								return <AntdInput className='!w-full' size='middle' {...field} />;
							}}
						/>
					</div>
					<div className='col-span-2'>
						{t('Обслуживающий банк')}
						<Controller
							control={control}
							name='bankId'
							render={({ field }) => {
								return (
									<Select
										{...field}
										placeholder={t('...')}
										className='!w-full'
										defaultValue={field.value}
										options={bankData.map((bank, idx) => {
											return {
												value: bank.id,
												label: bank.bankName,
											};
										})}
									/>
								);
							}}
						/>
					</div>
					<div className='col-span-2'>
						<Description
							title={t('Оператор улуши')}
							content={
								<Controller
									control={control}
									name='operatorShare'
									render={({ field }) => {
										return <PatternFormat placeholder='...' format='###' customInput={AntdInput} {...field} />;
									}}
								/>
							}
						/>
					</div>

					<div className='col-span-1'>
						<FileUpload
							type='CLIENT_PHOTO'
							accept={'image/png, image/gif, image/jpeg, image/jpg'}
							onUpload={(pkey) => setValue('user.fileGuid', pkey)}
						/>
					</div>

					<Button type='primary' onClick={handleSubmit(onSubmit)} loading={mutateAddCompany.status === 'loading'}>
						{t("Qo'shish")}
					</Button>
				</div>
			</Modal>
		</>
	);
}

export default AddCompanyModal;
