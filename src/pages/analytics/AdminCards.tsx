import React from 'react';
import { useTranslation } from 'react-i18next';

function AdminCards() {

	const { t, i18n } = useTranslation();
	const titles = [t('Вчера'), t('С начала месяца'), t('С начала года')];
	return (
		<div className='space-y-3'>

			<div className='grid grid-cols-4 gap-5'>
				<div />
				{titles.map((title) => {
					return (
						<div
							className='col-span-1 | bg-[#0150CD] text-white flex items-center justify-center py-2 rounded-lg shadow-xl text-2xl font-bold'>
							{title}:
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#F0F5FF] flex items-center justify-center border-2 !border-spacing-96 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					{t('Продажи')}:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div
							className='col-span-1 | text-[#9C4A09] bg-[#fff7d8] font-bold !text-center !px-3 py2 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							5ta /
							<br />
							125mln.sum
							<br />
							(+5.3%)
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#F0F5FF] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					{t('Лидер продаж (магазин)')}:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div
							className='col-span-1 | text-[#9C4A09] bg-[#fff7d8] font-bold !text-center !px-3 py-2 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							12ta - 39mln
							<br />
							(Qoratosh)
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#F0F5FF] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					{t('Самая крупная покупка')}:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div
							className='col-span-1 | text-[#9C4A09] bg-[#fff7d8] font-bold !text-center !px-3 py-2 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							15.5 mln
							<br />
							(Qoratosh)
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div
					className='text-center min-h-[100px] bg-[#F0F5FF] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					{t('Бестселлеры')}:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div
							className='col-span-1 | text-[#9C4A09] bg-[#fff7d8] font-bold !text-center !px-3 py-2 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							15 ta
							<br />
							Samsung - S21
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default AdminCards;
