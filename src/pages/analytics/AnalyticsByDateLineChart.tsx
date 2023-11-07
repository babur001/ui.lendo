import {IAnalyticsByDateTabs, humanizeNumber} from '@/pages/analytics';
import {req} from '@/services/api';
import {Spinner} from '@geist-ui/core';
import {useQuery} from '@tanstack/react-query';
import {get, last} from 'lodash';
import {useState} from 'react';
import Chart from 'react-apexcharts';
import {useTranslation} from "react-i18next";

interface IAnalyticsChartData {
    periodType: IAnalyticsByDateTabs;
    period: number;
    applicationCount: 0;
    summa: 0;
}

function AnalyticsByDateLineChart({type}: { type: IAnalyticsByDateTabs }) {

	const {t, i18n} = useTranslation();
    const [year, setYear] = useState({
        year: 2023,
    });
    const queryChart = useQuery({
        queryKey: ['queryChart--AnalyticsByDate', type, year],
        queryFn: () => {
            return req({
                method: 'GET',
                url: `/stat/get-card-stat`,
                params: {
                    year: year.year,
                    periodTypeNo: type,
                },
            });
        },
    });
    const data = get(queryChart, 'data.data.data', []) as IAnalyticsChartData[];

    const cash = data.map((stat) => stat.summa);
    const periodNames = data.map((stat) => stat.period);

    return (
        <>
            {queryChart.status === 'loading' ? (
                <div className='h-[350px] flex items-center justify-center'>
                    <Spinner className='!text-black !h-6'/>
                </div>
            ) : (
                <div className='w-full rounded-lg h-full min-h-[350px] !pb-3 !relative'>
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
                        series={[

                            {
                                name: t(`payment_summa`),
                                data: cash,
                            },

                        ]}
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
