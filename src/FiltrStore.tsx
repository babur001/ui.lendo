import moment from 'moment';
import { create } from 'zustand';
import dayjs from 'dayjs';

export interface IReceiptsStore {
	dateFrom: `${string}.${string}.${string}`;
	dateTo: `${string}.${string}.${string}`;
}

interface Actions {
	setRangeDate: ({ dateFrom, dateTo }: {
		dateFrom: IReceiptsStore['dateFrom'];
		dateTo: IReceiptsStore['dateTo']
	}) => void;
}

export const DATE_FORMAT = 'DD.MM.YYYY';

export const useReceiptsStore = create<IReceiptsStore & Actions>()((set) => ({
	dateFrom: dayjs(new Date().setDate(new Date().getDate() - 1)).format(DATE_FORMAT) as IReceiptsStore['dateFrom'],
	dateTo: dayjs(new Date().setDate(new Date().getDate() + 1)).format(DATE_FORMAT) as IReceiptsStore['dateTo'],

	setRangeDate: ({ dateFrom, dateTo }: { dateFrom: IReceiptsStore['dateFrom']; dateTo: IReceiptsStore['dateTo'] }) => {
		return set((state) => ({ dateFrom, dateTo }));
	},
}));
