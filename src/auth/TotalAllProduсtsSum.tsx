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
	let hasVat = 2;
	get(values, 'items', []).forEach((product: any) => {
		total += (isNaN(+product.price) ? 0 : product.price) * product.amount;
		hasVat = product.hasVat;
	});
	if (hasVat === 1) {
		total += total * 12 / 112;
	}
	total -= isNaN(+values.paymentSum) ? 0 : values.paymentSum;
	total = Math.round(total * 100) / 100;
	return (
		<div>{t('Общая сумма товаров')} : {formatNumber(total)}</div>
	);
}

export default TotalAllProduсtsSum;
