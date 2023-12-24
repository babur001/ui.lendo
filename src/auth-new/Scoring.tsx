import { IBankScoringResult, useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';
import { req } from '@/services/api';
import { Card, Description, Spinner, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Segmented, Select } from 'antd';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ITableEDIT {
	//
}

export type TStatus = 'STATUS_NEW' | 'STATUS_PENDING' | 'STATUS_ERROR' | 'STATUS_SUCCESS';

interface IScoringResult {
	id: number;
	clientPinfl: number;
	scoringRate: number;
	scoringSum: number;
	cardMask: number;
	cardExpiry: number;
	cardId: string;
	status: TStatus;
}

interface IProps {
	onFinish: () => unknown;
}

interface IBank {
	id: number;
	createdAt: string;
	updatedAt: string;
	createdUserId?: null;
	updatedUserId?: null;
	bankName: string;
	bankTin: string;
	bankShare: number;
	bankInsurance: number;
	operatorShare: number;
}

function Scoring({ onFinish }: IProps) {
	const [tab, setTab] = useState('scoring');
	const { t } = useTranslation();
	const { pinfl, setBank } = useNewBuyerStore((store) => ({
		pinfl: store.pinfl,
		setBank: store.setBank,
	}));

	const [applicationId, setApplicationId] = useState(null);

	const {
		control,
		register,
		handleSubmit,
		getValues,
		watch,
		formState: { errors },
	} = useForm<{ bankIds: number[] }>();

	const mutateScoreFromBanks = useMutation({
		mutationKey: ['mutateScoreFromBanks'],
		mutationFn: ({ bankIds, applicationId }: { bankIds: number[]; applicationId: any }) => {
			return req({
				method: 'POST',
				url: '/registration/check-scoring-v2',
				data: {
					pinfl,
					bankIds,
					applicationId: tab === 'scoring' ? null : applicationId,
					main: tab === 'scoring' ? false : true,
				},
			});
		},
	});

	const queryBanks = useQuery({
		queryKey: ['queryBanks'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: '/admin/get-banks',
			});
		},
	});

	const banks = get(queryBanks, 'data.data.data', []) as IBank[];

	const status = get(mutateScoreFromBanks, 'data.data.data.status', 'STATUS_NEW') as TStatus;
	const result = get(mutateScoreFromBanks, 'data.data.data', {}) as IScoringResult;
	const bankResults = get(mutateScoreFromBanks, 'data.data.data', []) as IBankScoringResult[];

	useEffect(() => {
		const applicationId = get(bankResults, '0.applicationId', null);
		setApplicationId(applicationId);
	}, [bankResults]);

	const score = async () => {
		const res = await mutateScoreFromBanks.mutateAsync({
			applicationId,
			bankIds: getValues('bankIds'),
		});
	};

	const onBankSelect = (bank: IBankScoringResult) => {
		setBank(bank);

		onFinish();
	};

	return (
		<>
			<Text h3>2. {t('Скоринг тизими')}</Text>

			{(() => {
				if (true) {
					return (
						<div>
							<Segmented
								size='large'
								value={tab}
								onChange={(active) => setTab(active as any)}
								options={[
									{
										label: 'Проверка по клиентам банка',
										value: 'scoring',
									},
									{
										label: 'Скоринг клиента',
										value: 'detailed_scoring',
									},
								]}
							/>
							<div className='h-[20px]' />
							<div className='flex items-center !gap-5'>
								<Controller
									control={control}
									name='bankIds'
									render={({ field }) => {
										return (
											<Select
												allowClear
												loading={queryBanks.status === 'loading'}
												className='w-auto min-w-[200px]'
												mode='multiple'
												options={banks.map((bank) => {
													return {
														value: bank.id,
														label: bank.bankName,
													};
												})}
												{...field}
											/>
										);
									}}
								/>

								<Button type='text' className='bg-gray-100' onClick={score}>
									Проверка
								</Button>
							</div>

							<div className='h-[20px]' />

							<div className='grid grid-cols-3 !gap-5'>
								{bankResults.map((bankResult) => {
									return (
										<Card key={bankResult.id}>
											<Text h4 my={0}>
												{bankResult.bankName}
											</Text>

											<div className='h-[10px]' />

											<div>
												<Description title={`ДОСТУПНЫЙ ЛИМИТ:`} content={<Text h5>{formatNumber(bankResult.scoringSum)}</Text>} />
												<Description title={`Наценка к лимиту`} content={<Text h5>{bankResult.scoringRate}</Text>} />
											</div>

											<Button
												block
												type='primary'
												className='flex items-center justify-center !gap-3 !text-base'
												onClick={() => onBankSelect(bankResult)}
											>
												Пройти идентификацию <ArrowRight size={16} />
											</Button>
										</Card>
									);
								})}
							</div>
						</div>
					);
				}

				if (status === 'STATUS_PENDING' || status === 'STATUS_NEW') {
					return (
						<div className='flex items-center justify-center h-full'>
							<Spinner scale={2} />
						</div>
					);
				}

				if (status === 'STATUS_ERROR') {
					return <Alert message={t('Скоринг тизимидан ўта олмадингиз.')} type='error' showIcon />;
				}

				if (status === 'STATUS_SUCCESS') {
					return (
						<>
							<Alert message={t('Табриклаймиз, скоринг муваффақиятли ўтилди')} type='success' showIcon />

							<div className='h-[20px]' />
							<Description
								title={<div className='text-2xl'>{t('Мавжуд лимит:')}</div>}
								content={<div className='text-2xl'>{formatNumber(get(result, 'scoringSum', 0))}</div>}
								scale={1.25}
							/>

							<div className='h-[20px]' />

							<div className='h-[20px]' />

							<div className='flex items-center justify-end'>
								<Button onClick={onFinish} size='large' type='primary' className='!w-64'>
									{t('Расмийлаштиришга ўтинг')}
								</Button>
							</div>
						</>
					);
				}
			})()}
		</>
	);
}

export function formatNumber(num: number) {
	if (typeof num === 'number') {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	return num;
}

export default Scoring;
