import { IAnalyticsByDateTabs, humanizeNumber } from '@/pages/analytics';
import { req } from '@/services/api';
import { Spinner } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

interface IAnalyticsChartData {
	periodType: IAnalyticsByDateTabs;
	period: number;
	applicationCount: 0;
	summa: 0;
}

function AnalyticsByDateLineChart({ type, salePointId }: { type: IAnalyticsByDateTabs, salePointId: any }) {
	const { t, i18n } = useTranslation();
	const [year, setYear] = useState({
		year: 2023,
	});

	const now = new Date();

	const queryChart = useQuery({
		queryKey: ['queryChart--AnalyticsByDate', type, year, salePointId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-card-stat`,
				params: {
					year: year.year,
					periodType: type,
					month: now.getMonth() + 1,
					salePointId: salePointId,
				},
			});
		},
	});
	const data = get(queryChart, 'data.data.data', []) as IAnalyticsChartData[];

	const periodTypeNames = (type: string, value: any) => {
		switch (type) {
			case 'DAILY':
				return `${value}-день`;
			case 'MONTHLY':
				switch (value) {
					case 1:
						return 'Январь';
					case 2:
						return 'Февраль';
					case 3:
						return 'Март';
					case 4:
						return 'Апрель';
					case 5:
						return 'Май';
					case 6:
						return 'Июнь';
					case 7:
						return 'Июль';
					case 8:
						return 'Август';
					case 9:
						return 'Сентябрь';
					case 10:
						return 'Октябрь';
					case 11:
						return 'Ноябрь';
					case 12:
						return 'Декабрь';
					default:
						return 'месяц';
				}
				break;
			case 'QUARTERLY':
				return `${value}-квартал`;
			case 'YEARLY':
				return `${value}-год`;
			default:
				return `${value}-день`;
		}
	};
	const periodNames = data.map((stat) => periodTypeNames(type, stat.period));
	const series = [
		{
			name: t(`payment_summa`),
			data: data.map((stat) => stat.summa),
		},
	];

	return (
		<>
			{queryChart.status === 'loading' ? (
				<div className='h-[350px] flex items-center justify-center'>
					<Spinner className='!text-black !h-6' />
				</div>
			) : (
				<div className='w-full rounded-lg h-full min-h-[350px] !pb-3 !relative'>
					<div className='h-[10px]' />
					<div className='flex items-center justify-center'>{year.year}-год</div>
					<div className='h-[10px]' />
					<Chart
						options={{
							tooltip: {
								enabled: true,
								shared: true,
								intersect: false,
								followCursor: true,
								y: {
									formatter(val: any, opts: any) {
										return String(humanizeNumber(+val));
									},
								},
							},
							plotOptions: {
								bar: {
									borderRadius: 4,
								},
							},
							markers: {
								size: 5,
							},
							colors: ['#0150CD', '#EA981E', '#9FC46D'],
							chart: {
								height: 350,
								toolbar: {
									show: false,
								},
								zoom: {
									enabled: false,
								},
							},
							dataLabels: {
								enabled: false,
							},

							xaxis: {
								position: 'bottom',
								categories: periodNames,
							},
							yaxis: {
								labels: {
									formatter: (value) => {
										return String(humanizeNumber(value));
									},
								},
							},
						}}
						series={series}
						type='bar'
						width={`100%`}
						height={`100%`}
					/>
				</div>
			)}
		</>
	);
}

export default AnalyticsByDateLineChart;
