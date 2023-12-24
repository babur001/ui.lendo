import { req } from '@/services/api';
import { Input, Tabs, Text } from '@geist-ui/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import clsx from 'clsx';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';
import Scoring from '@/auth-new/Scoring.tsx';
import { useState } from 'react';

const authManual = z.object({
	pinfl: z.string().length(14, { message: 'PINFL должен состоять из 14 символов.' }),
});

interface IProps {
	onFinish: () => unknown;
}

export const baseUrl = `https://mp-api.techstack.uz/mp-client-api`;

interface IIdentificationForm {
	pinfl: string;
}

function Identification({ onFinish }: IProps) {
	const { t } = useTranslation();
	const { pinfl, setPinfl } = useNewBuyerStore((store) => ({
		pinfl: store.pinfl,
		setPinfl: store.setPinfl,
	}));
	const store = useNewBuyerStore();
	const [scoring, setScoring] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IIdentificationForm>({
		resolver: zodResolver(authManual),
		defaultValues: {
			pinfl: pinfl,
		},
	});

	const mutateUser = useMutation({
		mutationKey: ['queryUser'],
		mutationFn: (pinflParam: string) => {
			return req({
				method: 'GET',
				url: `/registration/get-client-info`,
				params: {
					pinfl: pinflParam,
				},
			});
		},
	});

	const errorMessages = {
		pinfl: get(errors, 'pinfl.message', null),
	};

	const onSubmit = async (values: IIdentificationForm) => {
		// Clear all values
		store.setBank(null);
		store.setApplicationId(null);
		store.setUniqueIds({ clientProfileId: null, clientScoringId: null });
		store.setProducts(null);
		store.setUser(null);
		store.setUserInfo(null);
		setPinfl(values.pinfl);
		setScoring(true);
		/*		onFinish();*/
	};

	return (
		<>
			<>
				<Text h3>1. Проверка и скоринг клиента</Text>
				<div className='h-[15px]' />
				<div className='flex flex-col gap-5 !w-96'>
					<form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
						<Input
							placeholder='...'
							className='!w-full'
							type={errorMessages.pinfl ? 'error' : 'default'}
							{...register('pinfl')}
						>
							<div className='flex items-center justify-between'>
								<span>Введите ПИНФЛ*</span>51704005120013
								<span
									className={clsx({
										'text-[#c50000]': true,
										hidden: !errorMessages.pinfl,
									})}
								>
									{errorMessages.pinfl}
								</span>
							</div>
						</Input>
						<Button type='primary' htmlType='submit' loading={mutateUser.status === 'loading'}>
							{t('Проверить')}
						</Button>
					</form>
				</div>
			</>
			{(() => {
				if (scoring === true) {
					return (
						<>
							<div className='h-[40px]' />
							<Scoring onFinish={onFinish} />
						</>
					);
				}
			})()}
		</>
	);
}

export default Identification;
