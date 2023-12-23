import { req } from '@/services/api';
import { useBuyerStore } from '@/stores/buyer';
import { Card, Description, Dot, Note, Pagination, Spinner, Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Segmented, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import React from 'react';
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

function Scoring({ onFinish }: IProps) {
	const { t, i18n } = useTranslation();
	const { clientScoringId } = useBuyerStore((store) => ({
		clientScoringId: store.clientScoringId,
	}));

	const queryScoring = useQuery({
		queryKey: ['queryScoring', clientScoringId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: '/registration/get-scoring-status',
				params: {
					scoringId: clientScoringId,
				},
			});
		},
		refetchInterval: 5000,
	});

	const status = get(queryScoring, 'data.data.data.status', 'STATUS_NEW') as TStatus;
	const result = get(queryScoring, 'data.data.data', {}) as IScoringResult;

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
								<Select
									className='w-auto min-w-[200px]'
									mode='multiple'
									allowClear
									options={[
										{
											label: 'Agrobank',
											value: 'Agrobank',
										},
										{
											label: 'Kapitalbank',
											value: 'Kapitalbank',
										},
										{
											label: 'Hamkorbank',
											value: 'Hamkorbank',
										},
									]}
								/>

								<Button type='text' className='bg-gray-100'>
									Send for score
								</Button>
							</div>

							<div className='h-[20px]' />

							<div className='grid grid-cols-3 !gap-5'>
								<Card>
									<Text h4 my={0}>
										Agrobank
									</Text>

									<div className='h-[10px]' />

									<Button block type='primary' className='flex items-center justify-center !gap-3 !text-base'>
										{formatNumber(24122000)} <ArrowRight size={16} />
									</Button>
								</Card>
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
