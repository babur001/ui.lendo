import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUp, ArrowUp01, ArrowUp10, ArrowUpAZ, ArrowUpDown } from 'lucide-react';

function AdminCards() {

	const { t, i18n } = useTranslation();
	const titles = [t('Вчера'), t('С начала месяца'), t('С начала года')];
	return (
		<div className='space-y-3 bg-[#F6F6F7] shadow-xl shadow-yl rounded-lg px-2 py-2'>
			<div className='grid grid-cols-4 gap-5'>
				<div />
				{titles.map((title) => {
					return (
						<div
							className='col-span-1 | bg-[#fff] text-[#325ecd] flex items-center justify-center py-2 rounded-lg shadow-xl text-2xl font-bold'>
							{title}:
						</div>
					);
				})}
			</div>
			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-xl rounded-xl text-2xl text-[#9c4a09] font-bold'>
					{t('Продажи в рассрочку')}
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div
							className=' bg-[#fff]  !text-center !px-3 py2  shadow-xl shadow-md rounded-xl flex items-center justify-center gap-4 text-1xl'>
							<div>
								<div className='flex'>
									<div className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>5</div>
									<div className='mt-6 font-bold font-mono text-[#1f3864]'>ta</div>
								</div>
								<div className='text-[#70ad47] italic mt-1.5'><ArrowUp strokeWidth={2} />+5.3%</div>
							</div>
							<div>
								<div className='flex'>
									<div className='text-[#70ad47] text-5xl mr-2 font-bold font-mono'>125</div>
									<div className='mt-6 font-bold text-xs text-[#1f3864]'>mln.sum</div>
								</div>
								<div className='text-[#70ad47] italic mt-1.5'><ArrowUp strokeWidth={2} />+5.3%</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-xl !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
					<div>
						{t('Лидер продаж')}
						<div className='text-yellow-500 font-normal'> (магазин)</div>
					</div>
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='bg-[#fff] shadow-xl shadow-md rounded-xl'>
							<div
								className='!text-center !px-3 py2 flex items-center justify-center gap-6 mt-2'>
								<div>
									<div className='flex'>
										<div className='text-[#70ad47] text-4xl mr-2 font-bold'>12</div>
										<div className='mt-4 font-bold text-[#1f3864]'>ta</div>
									</div>
									<div className='text-[#70ad47] italic mt-1.5'><ArrowUp strokeWidth={2} />+5.3%</div>
								</div>
								<div>
									<div className='flex'>
										<div className='text-[#70ad47] text-4xl mr-2 font-bold'>390</div>
										<div className='mt-4 font-bold text-[#1f3864]'>mln.sum</div>
									</div>
									<div className='text-[#70ad47] italic mt-1.5'><ArrowUp strokeWidth={2} />+5.3%</div>
								</div>
							</div>
							<div className='mt-1 text-yellow-500 text-center text-2xl'>(Qoratosh)</div>
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-xl !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
					{t('Самая крупная покупка')}:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | bg-[#fff] shadow-xl shadow-md rounded-xl flex items-center justify-center'>
							<div className='text-center'>
								<div className='flex'>
									<div className='text-[#70ad47] text-4xl mr-2 font-bold'>390</div>
									<div className='mt-4 font-bold text-[#1f3864]'>mln.sum</div>
								</div>
								<div className='mt-1 text-yellow-500  text-2xl'>(Qoratosh)</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#fff] flex items-center justify-center shadow-xl !border-spacing-96  rounded-xl text-2xl text-[#9c4a09] font-bold'>
					{t('Бестселлеры')}:
				</div>
				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | bg-[#fff] shadow-xl shadow-md rounded-xl flex items-center justify-center'>
							<div>
								<div className='flex justify-center items-center'>
									<div className='text-[#70ad47] text-4xl mr-2 font-bold'>15</div>
									<div className='mt-4 font-bold text-[#1f3864]'>ta</div>
								</div>
								<div className='mt-1 text-center text-yellow-500  text-2xl'>(Samsung - S21)</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default AdminCards;
