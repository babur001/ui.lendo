import { req } from '@/services/api';
import { useBuyerStore } from '@/stores/buyer';
import { Description, Note, Pagination, Spinner, Text } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ITableEDIT {
	//
}

export type TStatus =
	| 'STATUS_NEW'
	| 'STATUS_PENDING'
	| 'STATUS_ERROR'
	| 'STATUS_SUCCESS';

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

	const status = get(
		queryScoring,
		'data.data.data.status',
		'STATUS_NEW',
	) as TStatus;
	const result = get(queryScoring, 'data.data.data', {}) as IScoringResult;

	const columns: ColumnsType<ITableEDIT> = [
		{
			title: t('Ой'),
			dataIndex: 'month',
		},
		{
			title: t('Минимал сумма'),
			dataIndex: 'min_sum',
		},
		{
			title: t('Maksimal summa'),
			dataIndex: 'max_sum',
		},
	];

	return (
		<>
			<Text h3>3. {t('Скоринг тизими')}</Text>

			{(() => {
				if (status === 'STATUS_PENDING' || status === 'STATUS_NEW') {
					return (
						<div className='flex items-center justify-center h-full'>
							<Spinner scale={2} />
						</div>
					);
				}

				if (status === 'STATUS_ERROR') {
					return (
						<Alert
							message={t('Скоринг тизимидан ўта олмадингиз.')}
							type='error'
							showIcon
						/>
					);
				}

				if (status === 'STATUS_SUCCESS') {
					return (
						<>
							<Alert
								message={t('Табриклаймиз, скоринг муваффақиятли ўтилди')}
								type='success'
								showIcon
							/>

							<div className='h-[20px]' />
								<Description
									title={<div className='text-2xl'>{t('Мавжуд лимит:')}</div>}
									content={<div className='text-2xl'>{formatNumber(get(result, 'scoringSum', 0))}</div>}
									scale={1.25}
								/>

							<div className='h-[20px]' />

							<div className='h-[20px]' />

							<div className='flex items-center justify-end'>
								<Button
									onClick={onFinish}
									size='large'
									type='primary'
									className='!w-64'
								>
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
