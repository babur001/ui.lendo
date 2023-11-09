import { Description, Input, Text } from '@geist-ui/core';
import { Controller, useForm } from 'react-hook-form';
import regions from '@/data/ns10.json';
import tumans from '@/data/ns11.json';
import { Button, Modal, Select, message } from 'antd';
import { IUserInfo, useBuyerStore } from '@/stores/buyer.ts';
import { useMutation } from '@tanstack/react-query';
import { req } from '@/services/api.ts';
import { find, get } from 'lodash';
import { PatternFormat } from 'react-number-format';
import { Input as AntdInput } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

interface IProps {
	onAdd?: () => unknown;
}

interface ICompanyForm {
	latitude: string;
	longitude: string;
	name: string;
	regionName: string;
	regionCode: string;
	districtName: string;
	districtCode: string;
	address: string;
	user: {};
}

function AddSalePointModal({ onAdd }: IProps) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const { setValue, handleSubmit, control, watch } = useForm<ICompanyForm>();

	const forms: {
		title: React.ReactNode;
		name: 'name' | 'address';
		format?: string;
	}[] = [
		{
			title: t("Do'kon nomi"),
			name: 'name',
		},
		{
			title: t("Do'kon joylashgan manzil"),
			name: 'address',
		},
	];

	const mutateAddSalePoint = useMutation({
		mutationFn: (data: ICompanyForm) => {
			return req({
				method: 'POST',
				url: `/company-admin/save-sale-point`,
				data: data,
			});
		},
	});

	const onSubmit = async (values: ICompanyForm) => {
		if (!values) {
			return message.error(t(`Маълумотлар топилмади`));
		}

		const regionObj = find(regions, (region) => {
			return region.CODE === values.regionCode;
		});
		const tumanObj = find(tumans, (tuman) => {
			return tuman.DISTRICT_CODE === values.districtCode;
		});

		const data = {
			...values,
			regionName: get(regionObj, 'NAME_UZ', '-'),
			districtName: get(tumanObj, 'NAME_UZ', '-'),
		};

		const res = await mutateAddSalePoint.mutateAsync(data);
		const success = get(res, 'data.success', false);
		if (!success) {
			message.error(t(`Kutilmagan xatolik!`));
		} else {
			message.success(t(`Qoshildi`));
			onAdd && onAdd();
			setIsOpen(false);
		}
	};

	return (
		<>
			<Button size='large' onClick={() => setIsOpen(true)} type='primary'>
				{t("Qo'shish")}
			</Button>

			<Modal open={isOpen} onCancel={() => setIsOpen(false)} title={t("Do'kon qo'shish")} footer={false}>
				<div className='h-[20px]' />

				<div className='flex flex-col gap-5'>
					{forms.map((form) => {
						return (
							<Description
								title={form.title}
								className='!w-full'
								content={
									<Controller
										control={control}
										name={form.name}
										render={({ field }) => {
											return <AntdInput className='!w-full' size='middle' {...field} />;
										}}
									/>
								}
							/>
						);
					})}

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
							name='districtCode'
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
					<div>
						<YMaps>
							<Map height={300} width={`100%`} defaultState={{ center: [41.2995, 69.2401], zoom: 9 }}>
								<Placemark
									geometry={[41.2995, 69.2401]}
									options={{ draggable: true }}
									onDragEnd={(e: any) => {
										const coordinates = e.get('target').geometry.getCoordinates();
										const [latitude, longitude] = coordinates;

										setValue('latitude', latitude);
										setValue('longitude', longitude);
									}}
								/>
							</Map>
						</YMaps>
					</div>

					<Button type='primary' onClick={handleSubmit(onSubmit)} loading={mutateAddSalePoint.status === 'loading'}>
						{t("Qo'shish")}
					</Button>
				</div>
			</Modal>
		</>
	);
}

export default AddSalePointModal;
