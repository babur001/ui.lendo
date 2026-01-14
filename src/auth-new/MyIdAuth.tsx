import { TStatus } from '@/auth/Scoring';
import useAuthUser from '@/auth/useAuthUser';
import { useNewBuyerStore } from '@/pages/nasiya-new/buyer-new';
import { req } from '@/services/api';
import { IBuyer } from '@/stores/buyer';
import { Description, Spinner, Text } from '@geist-ui/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Image, QRCode } from 'antd';
import { get } from 'lodash';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
	onFinish: () => unknown;
}

interface IIdentificationForm {
	pinfl: string;
}

function MyIdAuth({ onFinish }: IProps) {
	const { t, i18n } = useTranslation();
	const queryUser = useAuthUser();

	const { setUser, pinfl, user } = useNewBuyerStore((store) => ({
		setUser: store.setUser,
		pinfl: store.pinfl,
		user: store.user,
	}));

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

			onFinish();
		}
	}, [userMyId]);

	const mutateUser = useMutation({
		mutationKey: ['queryUser'],
		mutationFn: (pinflParam: string) => {
			return req({
				method: 'GET',
				url: `/registration/get-client-info`,
				params: {
					pinfl: pinflParam,
				},
			});
		},
	});

	const onSubmit = async () => {
		try {
			const res = await mutateUser.mutateAsync(pinfl);

			const user = get(res, 'data.data', null) as IBuyer;

			if (user) {
				setUser(user);
				// After setting user, call onFinish to proceed to next step
				onFinish();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const userData = [
		{ title: t('ЖИШШР'), value: get(user, 'pinfl', '-') },
		{ title: t('Фамилия'), value: get(user, 'firstName', '-') },
		{ title: t('Исми'), value: get(user, 'lastName', '-') },
		{ title: t('Шарифи'), value: get(user, 'middleName', '-') },
		{ title: t('Паспорт серияси'), value: get(user, 'passportSerial', '-') },
		{ title: t('Паспорт рақами'), value: get(user, 'passportNumber', '-') },
		{ title: t('Ким томонидан берилган'), value: get(user, '', '-') },
		{ title: t('Жинси'), value: get(user, 'gender', '-') },
		{ title: t('Миллати'), value: get(user, 'citizenship', '-') },
	];

	return (
		<>
			{user ? (
				<>
					<Text h3>2. {t('Шахсга доир маълумотлар')}</Text>

					<div className='h-[15px]' />

					<Image
						src='https://cdn.pixabay.com/photo/2021/04/25/14/30/man-6206540_960_720.jpg'
						alt='man_image'
						width={192}
						height={192}
						className='rounded-lg object-contain'
					/>

					<div className='h-[35px]' />

					<div className='grid grid-cols-3 gap-5'>
						{userData.map((data, idx) => {
							return <Description title={data.title} content={data.value} />;
						})}
					</div>

					<div className='h-[35px]' />

					<Button
						onClick={onFinish}
						type='primary'
						size='large'
						className='flex items-center !gap-2 w-full justify-center'
						// loading={mutateSetUser.status === 'loading'}
					>
						{t('Ҳаридор маълумотлари')} <ArrowRight strokeWidth={1.5} className='!h-5' />
					</Button>
				</>
			) : (
				<>
					<Text h3>2. {t('Биометрическая идентификация (MyID)')}</Text>

					<Alert message={t('Идентификациядан ўтиш учун сканер қилинг')} type='info' showIcon />

					<div className='h-[20px]' />

					{queryUser.status === 'loading' || queryQrCodeGuid.status === 'loading' ? (
						<Spinner />
					) : (
						<div className='flex items-center justify-center' onClick={onSubmit}>
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
			)}
		</>
	);
}

export default MyIdAuth;
