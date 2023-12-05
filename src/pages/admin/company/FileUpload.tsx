import { req } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import { Button, Upload } from 'antd';
import { get } from 'lodash';
import { UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IProps {
	type: 'CLIENT_PHOTO' | 'APPLICATION_ATTACHED_FILE';
	accept: string;
	onUpload: (pkey: string) => unknown;
}

function FileUpload({ type, accept, onUpload }: IProps) {
	const { t } = useTranslation();

	const mutateFileUpload = useMutation({
		mutationKey: ['mutateFileUpload'],
		mutationFn: (body: FormData) => {
			return req({
				url: `/files/set-file`,
				method: 'POST',
				params: {
					uploadType: type,
				},
				data: body,
			});
		},
	});

	return (
		<>
			<Upload
				maxCount={1}
				multiple={false}
				accept={accept}
				beforeUpload={async (file: any) => {
					try {
						const formData = new FormData();

						formData.append('file', file);

						const res = await mutateFileUpload.mutateAsync(formData);
						const pkey = get(res, 'data.data.pkey', null);

						if (!pkey) {
							return true;
						}

						onUpload(pkey);
						return false;
					} catch (error) {
						return true;
					}
				}}
				className='w-full'
			>
				<Button icon={<UploadIcon strokeWidth={1.5} size={16} />} className='flex items-center justify-center' block>
					{t('Загрузить фото')}
				</Button>
			</Upload>
		</>
	);
}

export default FileUpload;
