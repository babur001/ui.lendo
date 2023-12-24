import { create } from 'zustand';

export interface IBuyer {
	pinfl: number;
	firstName: string;
	lastName: string;
	middleName: string;
	passportSerial: string;
	passportNumber: string;
	passportGivenBy: string;
	gender: 'FEMALE' | 'MALE';
	citizenship: string;
	createdAt?: null;
	updatedAt?: null;
	fileId?: null;
	profiles?: null[] | null;
	activeProfile?: null;
}

export interface IUserInfo {
	phone1: string;
	phone2: string;
	card: string;
	card_date: string;
	regionCode: string;
	district_code: string;
	neighborhood: string;
	street: string;
	homeNumber: string;
	flatNumber: string;
}

export interface IProducts {
	initialPayment: number | string;
	paymentPeriod: number | string;
	paymentDayOfMonth: number | string;
	items: {
		name: string;
		amount: number | '';
		price: number | '';
		hasVat: number | '';
		priceWithVat: number | '';
	}[];
}

export interface IBankScoringResult {
	createdAt: string;
	updatedAt: string;
	companyId?: null;
	createdUserId?: null;
	updatedUserId?: null;
	id: number;
	clientPinfl: number;
	scoringRate: number;
	scoringSum: number;
	cardMask: string;
	cardExpiry: string;
	cardId: string;
	bankId: number;
	bankName: string;
	applicationId: number;
	status: string;
	main: boolean;
}

export interface Store {
	user: IBuyer | null;
	bank: IBankScoringResult | null;
	pinfl: string;
	applicationId: number | null;
	products: IProducts | null;
	userInfo: IUserInfo | null;
	clientProfileId: string | number | null;
	clientScoringId: string | number | null;
}

interface Actions {
	setUser: (value: Store['user']) => void;
	setPinfl: (value: Store['pinfl']) => void;
	setBank: (value: Store['bank']) => void;
	setProducts: (value: Store['products']) => void;
	setUserInfo: (value: Store['userInfo']) => void;
	setApplicationId: (value: Store['applicationId']) => void;
	setUniqueIds: (value: { clientProfileId: Store['clientProfileId']; clientScoringId: Store['clientScoringId'] }) => void;
}

export const useNewBuyerStore = create<Store & Actions>()((set) => ({
	bank: null,
	setBank: (bank: Store['bank']) => set((state) => ({ bank })),

	pinfl: '',
	setPinfl: (pinfl: Store['pinfl']) => set((state) => ({ pinfl })),

	applicationId: null,
	setApplicationId: (applicationId: Store['applicationId']) => set((state) => ({ applicationId })),

	clientProfileId: null,
	clientScoringId: null,
	setUniqueIds: (values) => set((state) => ({ ...values })),

	user: null,
	setProducts: (value: Store['products']) => {
		return set((state) => ({ products: value }));
	},

	products: null,
	setUser: (user: Store['user']) => set((state) => ({ user })),

	userInfo: null,
	setUserInfo: (userInfo: Store['userInfo']) => set((state) => ({ userInfo })),
}));
