import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';
import { req } from '@/services/api';
import { useBuyerStore } from '@/stores/buyer';
import { Card, Description, Dot, Note, Pagination, Spinner, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Segmented, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import React from 'react';
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
	const { t } = useTranslation();
	const { pinfl } = useNewBuyerStore((store) => ({
		pinfl: store.pinfl,
	}));

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
		mutationFn: ({ bankIds, applicationId }: { bankIds: number[]; applicationId: number }) => {
			return req({
				method: 'POST',
				url: '/registration/check-scoring-v2',
				data: {
					pinfl,
					bankIds,
					applicationId,
					main: true,
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

	const results = get(mutateScoreFromBanks, 'data.data.data', []);

	const score = async () => {
		const res = await mutateScoreFromBanks.mutateAsync({ applicationId: 1, bankIds: getValues('bankIds') });
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
								options={[
									{
										label: 'Scoring',
										value: 'scoring',
									},
									{
										label: 'Detailed Scoring',
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
									Send for score
								</Button>
							</div>

							<div className='h-[20px]' />

							<div className='grid grid-cols-3 !gap-5'>
								{results.map((result: any) => {
									return (
										<Card key={result.id}>
											<Text h4 my={0}>
												{result.bankName}
											</Text>

											<div className='h-[10px]' />

											<div>
												<Description title={`Total sum:`} content={<Text h5>{formatNumber(result.scoringSum)}</Text>} />
												<Description title={`Total rate:`} content={<Text h5>{result.scoringRate}</Text>} />
											</div>

											<Button
												block
												type='primary'
												className='flex items-center justify-center !gap-3 !text-base'
												onClick={onFinish}
											>
												{result.bankName} <ArrowRight size={16} />
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
