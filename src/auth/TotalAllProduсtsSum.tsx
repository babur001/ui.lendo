import { Description, Input } from '@geist-ui/core';
import { get } from 'lodash';
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/auth/Scoring.tsx';

function TotalAllProduсtsSum({ control }: { control: Control<any> }) {
	const { t, i18n } = useTranslation();
	const values = useWatch({
		control,
	});
	let total = 0;

	get(values, 'items', []).forEach((product: any) => {
		let productTotal = (isNaN(+product.price) ? 0 : product.price) * product.amount;

		if (product.hasVat === 1) {
			productTotal += productTotal * 0.12;
		}

		total += productTotal;
	});

	total = Math.round(total * 100) / 100;

	return (
		<div className='flex gap-2'>
			{t('Общая сумма товаров')} : <div className='font-bold'>{formatNumber(total)}</div>
		</div>
	);
}

export default TotalAllProduсtsSum;
