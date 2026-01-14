import { Description, Text } from '@geist-ui/core';
import { req } from '@/services/api';
import { Button } from 'antd';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { IApplications } from '@/pages/buyers/applicationsList.tsx';
import { formatNumber } from '@/auth/Scoring.tsx';
import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';

interface IProps {
	onFinish: () => unknown;
}

function Graph({ onFinish }: IProps) {
	const { t, i18n } = useTranslation();
	const { applicationId } = useNewBuyerStore((store) => ({ applicationId: store.applicationId }));

	const queryApplications = useQuery({
		queryKey: ['queryApplications', applicationId],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/registration/get-applications`,
				params: {
					id: applicationId,
				},
			});
		},
	});
	const applicationData = get(queryApplications, 'data.data.data.content.0', null) as IApplications | null;
	const monthPay = applicationData 
		? Math.round((applicationData.paymentSumDeferral / applicationData.paymentPeriod) * 100) / 100 
		: 0;

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

			{applicationData ? (
				<div className='flex flex-col gap-4'>
					<Description
						title={<div className='text-2xl'>{t('Насия сумма:')}</div>}
						content={<div className='text-2xl'>{formatNumber(applicationData.paymentSumDeferral)}</div>}
					/>
					<Description
						title={<div className='text-2xl'>{t('Давр')}</div>}
						content={
							<div className='text-2xl'>
								{formatNumber(applicationData.paymentPeriod)} {t('месяц(ев)а')}
							</div>
						}
					/>
					<Description
						title={<div className='text-2xl'>{t('Ойлик тўлов:')}</div>}
						content={<div className='text-2xl'>{formatNumber(monthPay)}</div>}
					/>
				</div>
			) : (
				<div>Loading application data...</div>
			)}

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
