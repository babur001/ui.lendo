import { Description, Text } from '@geist-ui/core';
import { req } from '@/services/api';
import { Button } from 'antd';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import { useBuyerStore } from '@/stores/buyer';

interface IProps {
	onFinish: () => unknown;
}

function Graph({ onFinish }: IProps) {
	const { t, i18n } = useTranslation();
	const { applicationId } = useBuyerStore((store) => ({ applicationId: store.applicationId }));

	const pdfDownloadMutation = useMutation({
		mutationKey: ['mutateExcel', applicationId],
		mutationFn: () => {
			return req({
				url: `/pdf/get-application-pdf`,
				params: {
					applicationId,
				},
				method: 'POST',
				responseType: 'blob',
			});
		},
	});
	const pfdDownload = () => {
		pdfDownloadMutation.mutateAsync().then((res) => {
			saveAs(res.data, 'schedule.pdf', { autoBom: true });
		});
	};

	return (
		<>
			<Text h3>7. {t('Тўлов графиги')}</Text>

			<div className='h-[10px]' />

			<div className='flex flex-col gap-4'>
				<Description title={t('Насия сумма:')} content={'13 500 000'} />
				<Description title={t('Давр')} content={t('9 Ой')} />
				<Description title={t('Ойлик тўлов:')} content={'1 500 000'} />
			</div>

			<div className='h-[30px]' />

			<Button
				onClick={() => {
					pfdDownload();
					onFinish();
				}}
				loading={pdfDownloadMutation.isLoading}
				type='primary'
				className='flex items-center justify-center gap-4'
			>
				<Download strokeWidth={1.5} className='h-4 w-full' /> {t('Тўлов графигини юклаш')}
			</Button>
		</>
	);
}

export default Graph;
