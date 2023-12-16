import { TStatus } from '@/auth/Scoring';
import useAuthUser from '@/auth/useAuthUser';
import { req } from '@/services/api';
import { useBuyerStore } from '@/stores/buyer';
import { Spinner } from '@geist-ui/core';
import { useQuery } from '@tanstack/react-query';
import { Alert, QRCode } from 'antd';
import { get } from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function MyIdAuth() {
	const { t, i18n } = useTranslation();
	const queryUser = useAuthUser();
	const setUser = useBuyerStore((store) => store.setUser);

	const user = get(queryUser, 'data.data.data', null);

	const queryQrCodeGuid = useQuery({
		queryKey: ['queryQrCodeGuid'],
		queryFn: () => {
			return req({
				method: 'GET',
				url: '/my-id/get-guid',
			});
		},
		cacheTime: Infinity,
		retryOnMount: false,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: Infinity,
		refetchOnMount: false,
		refetchIntervalInBackground: false,
	});

	const guid = get(queryQrCodeGuid, 'data.data.data', null);

	const queryMyIdUser = useQuery({
		queryKey: ['queryMyIdUser', guid],
		queryFn: () => {
			return req({
				method: 'GET',
				url: `/my-id/get-myid-code`,
				params: {
					guid,
				},
			});
		},
		enabled: !!guid,
		refetchInterval: 5000,
	});

	const userMyId = get(queryMyIdUser, 'data.data.data', null);

	useEffect(() => {
		const status = get(userMyId, 'status', 'STATUS_NEW') as TStatus;

		if (status === 'STATUS_SUCCESS') {
			setUser({
				pinfl: get(userMyId, 'userProfile.common_data.pinfl'),
				firstName: get(userMyId, 'userProfile.common_data.first_name'),
				lastName: get(userMyId, 'userProfile.common_data.last_name'),
				middleName: get(userMyId, 'userProfile.common_data.middle_name'),
				passportSerial: get(userMyId, 'userProfile.doc_data.pass_data'),
				passportNumber: get(userMyId, 'userProfile.doc_data.pass_data'),
				passportGivenBy: get(userMyId, 'userProfile.doc_data.issued_by'),
				gender: get(userMyId, 'userProfile.common_data.gender') === '1' ? 'MALE' : 'FEMALE',
				citizenship: get(userMyId, 'userProfile.common_data.citizenship'),
				createdAt: get(userMyId, 'userProfile.doc_data.issued_date'),
				updatedAt: get(userMyId, 'userProfile.doc_data.issued_date'),
			});
		}
	}, [userMyId]);

	return (
		<>
			<Alert message={t('Идентификациядан ўтиш учун сканер қилинг')} type='info' showIcon />

			<div className='h-[20px]' />

			{queryUser.status === 'loading' || queryQrCodeGuid.status === 'loading' ? (
				<Spinner />
			) : (
				<div className='flex items-center justify-center'>
					<QRCode
						size={250}
						value={`client_id=taqsit_qr_in-place-uZWZXSjGz1wDOuj3EQVbA1g21YAfcM8HoyJ6Bul8&method=strong&client_guid=${guid}&auth_user_id=${get(
							user,
							'id',
							null
						)}`}
					/>
				</div>
			)}
		</>
	);
}

export default MyIdAuth;
