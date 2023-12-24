import { Description, Text } from '@geist-ui/core';
import { Controller, useForm } from 'react-hook-form';
import regions from '@/data/ns10.json';
import tumans from '@/data/ns11.json';
import { Button, Select, message } from 'antd';
import { IUserInfo, useBuyerStore } from '@/stores/buyer';
import { useMutation } from '@tanstack/react-query';
import { req } from '@/services/api';
import { find, get } from 'lodash';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Input as AntdInput } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';

interface IProps {
	onFinish: () => unknown;
}

interface IAdditionApiParam {
	livingAddress: string;
	country: string;
	regionName: string;
	districtName: string;
	clientPinfl: string | number;
}

interface IScoringParams {
	cardNumber: string;
	cardExpiry: string;
	pinfl: string | number;
	loanAmount: string | number;
	applicationId: string | number;
}

function Info({ onFinish }: IProps) {
	const { t, i18n } = useTranslation();
	const { pinfl, user, userInfo, setUserInfo, setUniqueIds } = useNewBuyerStore((store) => ({
		user: store.user,
		pinfl: store.pinfl,
		userInfo: store.userInfo,
		setUserInfo: store.setUserInfo,
		setUniqueIds: store.setUniqueIds,
	}));

	const store = useNewBuyerStore();
	console.log(store);

	const { register, handleSubmit, control, watch } = useForm<IUserInfo>({
		defaultValues: userInfo ? userInfo : {},
	});

	const mutateAddUserInfo = useMutation({
		mutationKey: ['mutateAddUserInfo'],
		mutationFn: (userInfoParams: IUserInfo & IAdditionApiParam & { pinfl: string | null }) => {
			return req({
				method: 'POST',
				url: `/registration/create-profile`,
				data: {
					...userInfoParams,
				},
			});
		},
	});

	const onSubmit = async (values: IUserInfo) => {
		try {
			const regionObj = find(regions, (region) => {
				return region.CODE === values.regionCode;
			});
			const tumanObj = find(tumans, (tuman) => {
				return tuman.DISTRICT_CODE === values.district_code;
			});

			const resUser = await mutateAddUserInfo.mutateAsync({
				...values,
				pinfl,
				livingAddress: values.homeNumber || values.flatNumber,
				country: t('UZBEKISTAN'),
				regionName: get(regionObj, 'NAME_UZ', '-'),
				districtName: get(tumanObj, 'NAME_UZ', '-'),
				clientPinfl: get(user, 'pinfl', ''),
			});

			const userSuccess = get(resUser, 'data.success', false);

			const clientProfileId = get(resUser, 'data.data.id', false);

			if (userSuccess) {
				setUserInfo(values);
				setUniqueIds({ clientProfileId, clientScoringId: null });

				onFinish();
			}

			if (!userSuccess) {
				message.error(t('Xatolik yuz berdi!'));
			}
		} catch (error) {
			message.error(t('Xatolik yuz berdi!'));
		}
	};

	return (
		<>
			<Text h3>2. {t('Ҳаридор маълумотлари')}</Text>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-5 w-full'>
					<>
						<Text h4 my={0}>
							{t('Телефон рақамлари')}
						</Text>

						<Description
							title={t('Телефон рақам №1*')}
							content={
								<Controller
									control={control}
									name='phone1'
									render={({ field }) => {
										return (
											<PatternFormat
												format='## ### ## ##'
												mask={' '}
												customInput={AntdInput}
												addonBefore='+998'
												{...field}
											/>
										);
									}}
								/>
							}
						/>

						<Description
							title={t('Телефон рақам №2*')}
							content={
								<Controller
									control={control}
									name='phone2'
									render={({ field }) => {
										return (
											<PatternFormat
												format='## ### ## ##'
												mask={' '}
												customInput={AntdInput}
												addonBefore='+998'
												{...field}
											/>
										);
									}}
								/>
							}
						/>
					</>

					<>
						<Text h4 my={0}>
							{t('Банк маълумотлари')}
						</Text>

						<div className='flex items-center !w-full !gap-3'>
							<Description
								title={t('Банк карта рақами*')}
								className='!w-1/2'
								content={
									<Controller
										control={control}
										name='card'
										render={({ field }) => {
											return (
												<PatternFormat
													format='#### #### #### ####'
													mask={' '}
													customInput={AntdInput}
													className='!w-full'
													size='middle'
													{...field}
												/>
											);
										}}
									/>
								}
							/>

							<Description
								title={t('Амал қилиш муддати*')}
								className='!w-1/2'
								content={
									<Controller
										control={control}
										name='card_date'
										render={({ field }) => {
											return (
												<PatternFormat
													format='##/##'
													mask={' '}
													customInput={AntdInput}
													className='!w-full'
													size='middle'
													{...field}
												/>
											);
										}}
									/>
								}
							/>
						</div>
					</>

					<>
						<Text h4 my={0}>
							{t('Манзили')}
						</Text>

						<div className='flex items-center !gap-3'>
							<Controller
								control={control}
								name='regionCode'
								render={({ field }) => {
									return (
										<Select
											{...field}
											placeholder={t('Вилоят')}
											className='!w-1/2'
											defaultValue={field.value}
											options={regions.map((region, idx) => {
												return {
													value: region.CODE,
													label: region.NAME_UZ,
												};
											})}
										/>
									);
								}}
							/>

							<Controller
								control={control}
								name='district_code'
								render={({ field }) => {
									const selectedRegionCode = watch('regionCode');

									const tumansOptions = tumans
										.filter((tuman) => {
											return tuman.NS10_CODE === selectedRegionCode;
										})
										.map((tuman) => {
											return {
												value: tuman.DISTRICT_CODE,
												label: tuman.NAME_UZ,
											};
										});

									return (
										<Select
											className='!w-1/2'
											placeholder={t('Туман')}
											defaultValue={field.value}
											options={tumansOptions}
											disabled={!selectedRegionCode}
											{...field}
										/>
									);
								}}
							/>
						</div>

						<div className='grid grid-cols-3 gap-3'>
							<Description
								title={t('Махалла номи*')}
								className='!col-span-1'
								content={
									<Controller
										control={control}
										name='neighborhood'
										render={({ field }) => {
											return <AntdInput className='!w-full' {...field} />;
										}}
									/>
								}
							/>

							<Description
								title={t('Кўча номи*')}
								className='!col-span-1'
								content={
									<Controller
										control={control}
										name='street'
										render={({ field }) => {
											return <AntdInput className='!w-full' {...field} />;
										}}
									/>
								}
							/>

							<div className='grid grid-cols-2 col-span-1 gap-3'>
								<Description
									title={t('Уй рақами*')}
									className='!col-span-1'
									content={
										<Controller
											control={control}
											name='homeNumber'
											render={({ field }) => {
												return <NumericFormat customInput={AntdInput} className='!w-full' {...field} />;
											}}
										/>
									}
								/>

								<Description
									title={t('Xонодон рақами*')}
									className='!col-span-1'
									content={
										<Controller
											control={control}
											name='flatNumber'
											render={({ field }) => {
												return <NumericFormat customInput={AntdInput} className='!w-full' {...field} />;
											}}
										/>
									}
								/>
							</div>
						</div>

						<Button type='primary' block htmlType='submit'>
							{t('Сақлаш')}
						</Button>

						<div className='h-[15px]' />
					</>
				</div>
			</form>
		</>
	);
}

export default Info;
