import { Description, Input } from '@geist-ui/core';
import { get } from 'lodash';
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { log } from 'console';
import { formatNumber } from '@/auth/Scoring.tsx';

function TotalInstallmentSum({ control }: { control: Control<any> }) {
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

	total -= isNaN(+values.initialPayment) ? 0 : values.initialPayment;

	const percentages = {
		3: 23,
		6: 30,
		18: 35,
	} as any;

	const percentage = percentages[isNaN(+values.paymentPeriod) ? 3 : values.paymentPeriod];

	total = total + total * (percentage / 100);
	total = Math.round((total * 100) / values.paymentPeriod) / 100;
	return (
		<Description
			className='flex-grow'
			title={t('Сумма рассрочки в месяц')}
			content={<Input scale={1.2} readOnly value={String(formatNumber(total))} width={'100%'} />}
		/>
	);
}

export default TotalInstallmentSum;
