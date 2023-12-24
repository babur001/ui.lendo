import { Description, Divider, Input, Note, Pagination, Text } from '@geist-ui/core';
import { Alert, Button, Checkbox, Segmented, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { log } from 'console';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuyerStore } from '@/stores/buyer.ts';
import { get } from 'lodash';
import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';

interface ITableEDIT {
	//
}

interface IProps {
	onFinish: () => unknown;
}

function Contract({ onFinish }: IProps) {
	const { user } = useNewBuyerStore((store) => ({
		user: store.user,
	}));

	const { t, i18n } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);

	return (
		<>
			<Text h3>5. {t('Шартнома(Оммавий оферта)')}</Text>

			<div className='h-[20px]' />

			<object data='/sample.pdf' type='application/pdf' width='100%' height='500px'>
				<p>
					Unable to display PDF file. <a href='/taqsit.docx'>Download</a> instead.
				</p>
			</object>

			<Checkbox checked={isChecked} onChange={(value) => setIsChecked((prev) => !prev)}>
				{t('Shartnoma shartlari bilan tanishildi')}
			</Checkbox>

			<div className='h-[20px]' />

			<Button onClick={onFinish} type='primary' disabled={!isChecked}>
				{t('Тасдиқлаш')}
			</Button>
			<div className='h-[40px]' />
		</>
	);
}

export default Contract;
