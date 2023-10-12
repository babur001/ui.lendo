import { create } from "zustand";

export interface IBuyer {
  pinfl: number;
  firstName: string;
  lastName: string;
  middleName: string;
  passportSerial: string;
  passportNumber: string;
  passportGivenBy: string;
  gender: "FEMALE" | "MALE";
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
}

export interface IProducts {
  paymentSum: number | string;
  paymentPeriod: number | string;
  paymentDayOfMonth: number | string;
  items: {
    name: string;
    amount: number | "";
    price: number | "";
    hasVat: number| 0;
  }[];
}

export interface Store {
  user: IBuyer | null;
  products: IProducts | null;
  userInfo: IUserInfo | null;
  clientProfileId: string | number | null;
  clientScoringId: string | number | null;
}

interface Actions {
  setUser: (value: Store["user"]) => void;
  setProducts: (value: Store["products"]) => void;
  setUserInfo: (value: Store["userInfo"]) => void;
  setUniqueIds: (value: {
    clientProfileId: Store["clientProfileId"];
    clientScoringId: Store["clientScoringId"];
  }) => void;
}

export const useBuyerStore = create<Store & Actions>()((set) => ({
  clientProfileId: null,
  clientScoringId: null,
  setUniqueIds: (values) => set((state) => ({ ...values })),

  user: null,
  setProducts: (value: Store["products"]) => {
    return set((state) => ({ products: value }));
  },

  products: null,
  setUser: (user: Store["user"]) => set((state) => ({ user })),

  userInfo: null,
  setUserInfo: (userInfo: Store["userInfo"]) => set((state) => ({ userInfo })),
}));
