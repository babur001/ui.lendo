import { Checkbox, Select, Typography } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { req } from '@/services/api';
import { get, toPairsIn } from 'lodash';
import { formatNumber } from '@/auth/Scoring';
import AnalyticsByDateLineChart from '@/pages/analytics/AnalyticsByDateLineChart';
import { Description, Spinner, Text } from '@geist-ui/core';
import { useTranslation } from 'react-i18next';
import AdminCards from '@/pages/analytics/AdminCards.tsx';
import useAuthUser from '@/auth/useAuthUser.tsx';
import { Roles } from '@/pages/auth';

export type IAnalyticsByDateTabs = 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

interface IAnalyticsData {
	periodType: IAnalyticsByDateTabs;
	applicationCount: 0;
	summa: 0;
	period: 0;
}

export interface ISalePoints {
	id: number;
	name: string;
	regionName: string;
	regionCode: number;
	districtName: string;
	districtCode: number;
	address: string;
}

function AnalyticsByDate() {
	const { Title } = Typography;
	const { t, i18n } = useTranslation();
	const [year, setYear] = useState({
		year: 2023,
	});

	const [salePointId, setSalePoint] = useState(null);

	const user = useAuthUser();
	const companyId = get(user, 'data.data.data.companyId', null);
	const roleName = get(user, 'data.data.data.roles.0.name', null);

	const querySalePoints = useQuery({
		queryKey: ['querySalePoints', companyId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/company-admin/get-sale-points`,
				params: {
					companyId: companyId,
				},
			});
		},
	});

	const salePointData = get(querySalePoints, 'data.data.data.content', []) as ISalePoints[];
	const total = get(querySalePoints, 'data.data.data.totalElements', 0) as number;

	const [activeFilter, setActiveFilter] = useState<IAnalyticsByDateTabs>('MONTHLY');
	const queryAnalyticsByDate = useQuery({
		queryKey: ['queryAnalyticsByDate', year, salePointId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-this-period-card-stat`,
				params: {
					/*year: year.year,*/
					salePointId: salePointId,
				},
			});
		},
	});

	const stats: Record<
		IAnalyticsByDateTabs,
		{
			title: string;
			children: Array<{ title: string; value: string | number }>;
		}
	> = {
		DAILY: {
			title: t('Кунлар кесимида'),
			children: [],
		},

		MONTHLY: {
			title: t('Ойлар кесимида'),
			children: [],
		},
		QUARTERLY: {
			title: t('Чораклар кесимида'),
			children: [],
		},
		YEARLY: {
			title: t('Йиллар кесимида'),
			children: [],
		},
	};

	((get(queryAnalyticsByDate, 'data.data.data') || []) as IAnalyticsData[]).forEach((analytics) => {
		try {
			const card = stats[analytics.periodType];
			card.children.push(
				...[
					{
						title: t('applicationCount'),
						value: humanizeNumber(analytics.applicationCount, 1, true),
					},
					{
						title: t('payment_summa'),
						value: humanizeNumber(analytics.summa, 1, true),
					},
				]
			);
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<>
			<Title className='flex justify-center' level={2}>
				<div className='text-[#325ecd]'>{t('Статистика')}</div>
			</Title>
			<div className='h-[20px]' />
			<AdminCards />

			<div className='h-[40px]' />
			<div>
				<Title className='flex justify-center' level={2}>
					<div className='text-[#325ecd]'>{t('Analytics')}</div>
				</Title>
				{roleName === Roles.COMPANY_ADMIN ? (
					<div className='col-span-2'>
						<Description
							title={t('Магазины')}
							content={
								<Select
									allowClear
									onChange={setSalePoint}
									placeholder={t('...')}
									className='!w-96'
									options={salePointData.map((salePoint, idx) => {
										return {
											value: salePoint.id,
											label: salePoint.name,
										};
									})}
								/>
							}
						/>
					</div>
				) : (
					<div></div>
				)}

				<div className='h-[20px]' />
				<div className='grid grid-cols-12 !gap-7'>
					<div className='col-span-4 rounded-md border border-gray-200 h-full'>
						{queryAnalyticsByDate.status === 'loading' ? (
							<div className='h-full w-full flex items-center justify-center'>
								<Spinner className='!text-black !h-6' />
							</div>
						) : (
							<div className='px-3 py-3 space-y-3'>
								{toPairsIn(stats).map(([key, stat], idx) => {
									return (
										<div
											key={idx}
											onClick={() => setActiveFilter(key as IAnalyticsByDateTabs)}
											className={classNames({
												'rounded-md p-1 cursor-pointer border border-transparent': true,
												'!border-blue-default/50': activeFilter === key,
											})}
										>
											<Checkbox checked={activeFilter === key}>{stat.title}</Checkbox>
											<div className='h-[5px]' />
											<div className='grid grid-cols-2 gap-2'>
												{stat.children.map((child, idx) => {
													return (
														<div
															key={idx}
															className={classNames({
																'flex flex-col px-2 py-2 rounded-md': true,
																'bg-[#F0F5FF]': idx === 0,
																'bg-[#fff7d8]': idx === 1,
																'bg-[#F0F8E6]': idx === 2,
															})}
														>
															<span className='text-sm text-gray-500'>{child.title}:</span>
															<span
																className={classNames({
																	'font-bold': true,
																	'text-[#325ECD]': idx === 0,
																	'text-[#986a24]': idx === 1,
																	'text-[#77a53b]': idx === 2,
																})}
															>
																{child.value}
															</span>
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div className='col-span-8 h-full rounded-md border border-gray-200'>
						<AnalyticsByDateLineChart type={activeFilter} salePointId={salePointId} />
					</div>
				</div>
			</div>
		</>
	);
}

export function humanizeNumber(num: number, round = 1, log = false) {
	if (num < 1_000_000) {
		return formatNumber(num);
	}

	var units = [
			'к',
			'млн',
			'млрд',
			'трлн',
			'квдрлн',
			'квнтлн',
			'скстлн',
			'Septillion',
			'Octillion',
			'Nonillion',
			'Decillion',
			'Undecillion',
		],
		decimal;

	for (var i = units.length - 1; i >= 0; i--) {
		decimal = Math.pow(1000, i + 1);

		if (num <= -decimal || num >= decimal) {
			return (num / decimal).toFixed(round).concat(` ${units[i]}`);
		}
	}

	return num;
}

export default AnalyticsByDate;
