import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { Roles } from '@/pages/auth';
import { get } from 'lodash';
import useAuthUser from '@/auth/useAuthUser.tsx';
import { useQuery } from '@tanstack/react-query';
import { req } from '@/services/api.ts';
import { humanizeNumber } from '@/services/HumanizeNumber.tsx';
import { Spin } from 'antd';

export interface ICards {
	appCount: number,
	sompanyId: number,
	statType: string,
	paymentSum: number,
	salePointId: number,
	salePointName: string,
	periodType: string
}

function AdminCards() {
	const { t, i18n } = useTranslation();
	const user = useAuthUser();

	const queryStatMain = useQuery({
		queryKey: ['queryStatMain'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/stat/get-stat-main`,
				params: {},
			});
		},
	});

	const zeroElement = {
		appCount: 0,
		sompanyId: 0,
		statType: null,
		paymentSum: 0,
		salePointId: 0,
		salePointName: '0',
		periodType: null,
	};

	const data = get(queryStatMain, 'data.data.data', []) as ICards[];
	const totalData = [zeroElement, ...data.filter(item => item.statType === 'TOTAL')];
	const highestSaleData = [zeroElement, ...data.filter(item => item.statType === 'HIGHEST_SALE')];
	const salePointData = [zeroElement, ...data.filter(item => item.statType === 'SALE_POINT')];

	const rolesName = get(user, 'data.data.data.roles.0.name', null);
	const titles = [t('Вчера'), t('С начала месяца'), t('С начала года')];
	return (
		<>
			<Spin spinning={queryStatMain.status === 'loading'}>
				<div className='space-y-3 bg-[#F6F6F7] rounded-lg px-2 py-2'>
					<div className='grid grid-cols-4 gap-5'>
						<div />
						{titles.map((title) => {
							return (
								<div
									className='col-span-1 | bg-[#fff] text-[#325ecd] flex items-center justify-center py-2 rounded-lg shadow-md text-2xl font-bold'>
									{title}:
								</div>
							);
						})}
					</div>
					<div className='grid grid-cols-4 gap-5'>
						<div
							className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-md rounded-xl text-2xl text-[#9c4a09] font-bold'>
							{t('Продажи в рассрочку')}
						</div>
						{totalData.map((item, index) => (
							<div key={index}
									 className=' bg-[#fff]  !text-center !px-3 py2  shadow-md rounded-xl flex items-center justify-center gap-4 text-1xl'>
								<div>
									<div className='flex'>
										<div className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>{item?.appCount}</div>
										<div className='mt-6 font-bold font-mono text-[#1f3864]'>{t('ta')}</div>
									</div>
									<div className='text-[#70ad47] italic mt-1.5'>
										<ArrowUp strokeWidth={2} />
										+5.3%
									</div>
								</div>
								<div>
									<div className='flex'>
										<div
											className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>{humanizeNumber(item?.paymentSum, 1, true, 'mt-6 font-bold text-xs text-[#1f3864]')}</div>
									</div>
									<div className='text-[#70ad47] italic mt-1.5'>
										<ArrowUp strokeWidth={2} />
										+5.3%
									</div>
								</div>
							</div>
						))}
						{/*				{new Array(3).fill('').map(() => {
					return (
						<div
							className=' bg-[#fff]  !text-center !px-3 py2  shadow-md rounded-xl flex items-center justify-center gap-4 text-1xl'>
							<div>
								<div className='flex'>
									<div className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>{totalData?.appCount}</div>
									<div className='mt-6 font-bold font-mono text-[#1f3864]'>ta</div>
								</div>
								<div className='text-[#70ad47] italic mt-1.5'>
									<ArrowUp strokeWidth={2} />
									+5.3%
								</div>
							</div>
							<div>
								<div className='flex'>
									<div className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>{totalData?.paymentSum}</div>
									<div className='mt-6 font-bold text-xs text-[#1f3864]'>mln.sum</div>
								</div>
								<div className='text-[#70ad47] italic mt-1.5'>
									<ArrowUp strokeWidth={2} />
									+5.3%
								</div>
							</div>
						</div>
					);
				})}*/}
					</div>

					{rolesName === Roles.COMPANY_ADMIN ? (
						<div className='grid grid-cols-4 gap-5'>
							<div
								className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-md !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
								<div>
									{t('Лидер продаж')}
									<div className='text-yellow-500 font-normal'> (магазин)</div>
								</div>
							</div>
							{highestSaleData.map((item, index) => (
								<div key={index} className='bg-[#fff] shadow-md rounded-xl'>
									<div className='!text-center !px-3 py2 flex items-center justify-center gap-6 mt-2'>
										<div>
											<div className='flex'>
												<div className='text-[#70ad47] text-4xl mr-2 font-bold'>{item?.appCount}</div>
												<div className='mt-4 font-bold text-[#1f3864]'>{t('ta')}</div>
											</div>
											<div className='text-[#70ad47] italic mt-1.5'>
												<ArrowUp strokeWidth={2} />
												+5.3%
											</div>
										</div>
										<div>
											<div className='flex'>
												<div
													className='text-[#70ad47] text-4xl mr-2 font-bold'>{humanizeNumber(item?.paymentSum, 1, true, 'mt-6 font-bold text-xs text-[#1f3864]')}</div>
											</div>
											<div className='text-[#70ad47] italic mt-1.5'>
												<ArrowUp strokeWidth={2} />
												+5.3%
											</div>
										</div>
									</div>
									<div className='mt-1 text-yellow-500 text-center text-2xl'>({item?.salePointName})</div>
								</div>
							))}
							{/*					{new Array(3).fill('').map(() => {
						return (
							<div className='bg-[#fff] shadow-md rounded-xl'>
								<div className='!text-center !px-3 py2 flex items-center justify-center gap-6 mt-2'>
									<div>
										<div className='flex'>
											<div className='text-[#70ad47] text-4xl mr-2 font-bold'>12</div>
											<div className='mt-4 font-bold text-[#1f3864]'>ta</div>
										</div>
										<div className='text-[#70ad47] italic mt-1.5'>
											<ArrowUp strokeWidth={2} />
											+5.3%
										</div>
									</div>
									<div>
										<div className='flex'>
											<div className='text-[#70ad47] text-4xl mr-2 font-bold'>390</div>
											<div className='mt-4 font-bold text-[#1f3864]'>mln.sum</div>
										</div>
										<div className='text-[#70ad47] italic mt-1.5'>
											<ArrowUp strokeWidth={2} />
											+5.3%
										</div>
									</div>
								</div>
								<div className='mt-1 text-yellow-500 text-center text-2xl'>(Qoratosh)</div>
							</div>
						);
					})}*/}
						</div>) : null}

					<div className='grid grid-cols-4 gap-5'>
						<div
							className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-md !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
							{t('Самая крупная покупка')}:
						</div>
						{salePointData.map((item, index) => (
							<div key={index} className='col-span-1 | bg-[#fff] shadow-md rounded-xl flex items-center justify-center'>
								<div className='text-center'>
									<div className='flex'>
										<div
											className='text-[#70ad47] text-4xl mr-2 font-bold'>{humanizeNumber(item?.paymentSum, 1, true, 'mt-6 font-bold text-xs text-[#1f3864]')}</div>
									</div>
									<div className='mt-1 text-yellow-500  text-2xl'>({item?.salePointName})</div>
								</div>
							</div>
						))}
						{/*				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | bg-[#fff] shadow-md rounded-xl flex items-center justify-center'>
							<div className='text-center'>
								<div className='flex'>
									<div className='text-[#70ad47] text-4xl mr-2 font-bold'>390</div>
									<div className='mt-4 font-bold text-[#1f3864]'>mln.sum</div>
								</div>
								<div className='mt-1 text-yellow-500  text-2xl'>(Qoratosh)</div>
							</div>
						</div>
					);
				})}*/}
					</div>
					<div className='grid grid-cols-4 gap-5'>
						<div
							className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-md !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
							{t('Бестселлеры')}:
						</div>
						{new Array(3).fill('').map(() => {
							return (
								<div className='col-span-1 | bg-[#fff] shadow-md rounded-xl flex items-center justify-center'>
									<div>
										<div className='flex justify-center items-center'>
											<div className='text-[#70ad47] text-4xl mr-2 font-bold'>15</div>
											<div className='mt-4 font-bold text-[#1f3864]'>{t('ta')}</div>
										</div>
										<div className='mt-1 text-center text-yellow-500  text-2xl'>(Samsung - S21)</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Spin>
		</>
	);
}

export default AdminCards;
