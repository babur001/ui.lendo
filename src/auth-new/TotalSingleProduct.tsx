import { Input } from '@geist-ui/core';
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/auth/Scoring.tsx';

function validateNumber(num: string | number, def: number = 0) {
	return isNaN(+num) ? def : +num;
}

function TotalSingleProduct({
															control,
															idx,
														}: {
	control: Control<any>;
	idx: number;

}) {

	const { t, i18n } = useTranslation();
	const [count, price, hasVat] = useWatch({
		control,
		name: [`items.${idx}.amount`, `items.${idx}.price`, `items.${idx}.hasVat`],
	});
	let total = 0;
	;
	total = validateNumber(count, 1) * validateNumber(price, 0);

	if (hasVat === 1) {
		total += total * 0.12;
	}

	total = Math.round(total * 100) / 100;

	return (
		<Input width={'100%'} value={String(formatNumber(total))} readOnly name={(`items.${idx}.priceWithVat`)}>
			{t('Cумма (ҚҚС билан)')}
		</Input>
	);

}

export default TotalSingleProduct;
