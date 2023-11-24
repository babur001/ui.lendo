import React from 'react';

function AdminCards() {
	const titles = ['Вчера', 'С начала месяца', 'С начала года'];
	return (
		<div className='space-y-5'>
			{/* TITLES */}
			<div className='grid grid-cols-4 gap-5'>
				<div />

				{titles.map((title) => {
					return (
						<div className='col-span-1 | bg-[#F47926] text-white flex items-center justify-center py-3 rounded-lg shadow-xl text-2xl font-bold'>
							{title}:
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div className='text-center min-h-[150px] flex items-center justify-center border-2 !border-spacing-96 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					Продажи:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | text-[#9C4A09] bg-[#FFC61D] font-bold !text-center !px-3 py-5 rounded-xl shadow-md flex items-center justify-center text-2xl'>
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
				<div className='text-center min-h-[150px] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					Лидер продаж (магазин):
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | text-[#9C4A09] bg-[#FFC61D] font-bold !text-center !px-3 py-5 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							12ta - 39mln
							<br />
							(Qoratosh)
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div className='text-center min-h-[150px] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					Самая крупная покупка:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | text-[#9C4A09] bg-[#FFC61D] font-bold !text-center !px-3 py-5 rounded-xl shadow-md flex items-center justify-center text-2xl'>
							15.5 mln
							<br />
							(Qoratosh)
						</div>
					);
				})}
			</div>

			<div className='grid grid-cols-4 gap-5'>
				<div className='text-center min-h-[150px] flex items-center justify-center border-2 !border-spacing-80 border-dashed border-[#203864] rounded-xl text-3xl text-[#9C4A09] font-bold'>
					Бестселлеры:
				</div>

				{new Array(3).fill('').map(() => {
					return (
						<div className='col-span-1 | text-[#9C4A09] bg-[#FFC61D] font-bold !text-center !px-3 py-5 rounded-xl shadow-md flex items-center justify-center text-2xl'>
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
