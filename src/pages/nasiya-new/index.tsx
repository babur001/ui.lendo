import Identification from '@/auth-new/Identification';
import Info from '@/auth-new/Info';
import { Alert, Steps } from 'antd';
import { useState } from 'react';
import Scoring from '@/auth-new/Scoring';
import Formalization from '@/auth-new/Formalization';
import Contract from '@/auth-new/Contract';
import Approval from '@/auth-new/Approval';
import Graph from '@/auth-new/Graph';
import { useTranslation } from 'react-i18next';
import MyIdAuth from '@/auth-new/MyIdAuth';

enum TEnumSteps {
	IDENTIFICATION = 0,
	SCORING = 1,
	MY_ID = 2,
	INFO = 3,
	FORMALIZATION = 4,
	CONTRACT = 5,
	APPROVAL = 6,
	GRAPH = 7,
}

function NasiyaNew() {
	const { t } = useTranslation();
	const [step, setStep] = useState<{ active: TEnumSteps; actual: TEnumSteps }>({
		active: TEnumSteps.IDENTIFICATION,
		actual: TEnumSteps.IDENTIFICATION,
	});

	return (
		<>
			<div>
				{/*
				<Alert showIcon description={'Бета версия'} closable />*/}

				<div className='h-[20px]' />

				<div className='flex gap-7 h-full'>
					<div className='w-1/4'>
						<div className='h-[10px]' />
						<Steps
							direction='vertical'
							current={step.active}
							onChange={(stepParam) =>
								setStep({
									...step,
									active: stepParam,
								})
							}
							items={[
								{
									title: t('Проверка и скоринг клиента'),
								},
								{
									// disabled: step.actual < TEnumSteps.SCORING,
									title: t('Скоринг тизими'),
								},
								{
									// disabled: step.actual < TEnumSteps.MY_ID,
									title: t('Идентификация'),
								},
								{
									// disabled: step.actual < TEnumSteps.INFO,
									title: t('Ҳаридор маълумотлари'),
								},
								{
									// disabled: step.actual < TEnumSteps.FORMALIZATION,
									title: t('Расмийлаштириш'),
								},
								{
									// disabled: step.actual < TEnumSteps.CONTRACT,
									title: t('Шартнома (Оммавий оферта)'),
								},
								{
									// disabled: step.actual < TEnumSteps.APPROVAL,
									title: t('Тасдиқлаш'),
								},
								{
									// disabled: step.actual < TEnumSteps.GRAPH,
									title: t('Тўлов графиги'),
								},
							]}
						/>
					</div>

					<div className='w-3/4 h-full'>
						{/* 1. IDENTIFICATION */}
						{step.active === TEnumSteps.IDENTIFICATION ? (
							<Identification
								onFinish={() =>
									setStep({
										active: TEnumSteps.SCORING,
										actual: TEnumSteps.SCORING,
									})
								}
							/>
						) : null}

						{/* 2. SCORING */}
						{step.active === TEnumSteps.SCORING ? (
							<Scoring
								onFinish={() =>
									setStep({
										active: TEnumSteps.MY_ID,
										actual: TEnumSteps.MY_ID,
									})
								}
							/>
						) : null}

						{/* 3. MY_ID */}
						{step.active === TEnumSteps.MY_ID ? (
							<MyIdAuth
								onFinish={() =>
									setStep({
										active: TEnumSteps.INFO,
										actual: TEnumSteps.INFO,
									})
								}
							/>
						) : null}

						{/* 4. INFO */}
						{step.active === TEnumSteps.INFO ? (
							<Info
								onFinish={() =>
									setStep({
										active: TEnumSteps.FORMALIZATION,
										actual: TEnumSteps.FORMALIZATION,
									})
								}
							/>
						) : null}

						{/* 5. FORMALIZATION */}
						{step.active === TEnumSteps.FORMALIZATION ? (
							<Formalization
								onFinish={() =>
									setStep({
										active: TEnumSteps.CONTRACT,
										actual: TEnumSteps.CONTRACT,
									})
								}
							/>
						) : null}

						{/* 6. CONTRACT */}
						{step.active === TEnumSteps.CONTRACT ? (
							<Contract
								onFinish={() =>
									setStep({
										active: TEnumSteps.APPROVAL,
										actual: TEnumSteps.APPROVAL,
									})
								}
							/>
						) : null}

						{/* 7. APPROVAL */}
						{step.active === TEnumSteps.APPROVAL ? (
							<Approval
								onFinish={() =>
									setStep({
										active: TEnumSteps.GRAPH,
										actual: TEnumSteps.GRAPH,
									})
								}
							/>
						) : null}

						{/* 8. GRAPH */}
						{step.active === TEnumSteps.GRAPH ? (
							<Graph
								onFinish={() => {
									// ...
								}}
							/>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}

export default NasiyaNew;
