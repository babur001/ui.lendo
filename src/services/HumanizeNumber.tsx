import { formatNumber } from '@/auth/Scoring.tsx';

export function humanizeNumber(num: number, round = 1, log = false, unitStyle = '') {
	if (num < 1_000_000) {
		return formatNumber(num);
	}

	var units = [
			'к',
			'млн',
			'млрд',
			'трлн',
			'квдрлн',
			'квнтлн',
			'скстлн',
			'Septillion',
			'Octillion',
			'Nonillion',
			'Decillion',
			'Undecillion',
		],
		decimal;

	for (var i = units.length - 1; i >= 0; i--) {
		decimal = Math.pow(1000, i + 1);

		if (num <= -decimal || num >= decimal) {
			const formattedNum = (num / decimal).toFixed(round);
			return <>
				<div className='flex justify-center items-center gap-2'>
					<div>{formattedNum}</div>
					<div className={unitStyle}>{units[i]}</div>
				</div>
			</>;


		}
	}

	return num;
}