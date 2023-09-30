import { create } from "zustand";

export interface IBuyer {
  pinfl: number;
  firstName: string;
  lastName: string;
  middleName: string;
  passportSerial: string;
  passportNumber: string;
  passportGivenBy: string;
  gender: string;
  citizenship: string;
  createdAt?: null;
  updatedAt?: null;
  fileId?: null;
  profiles?: null[] | null;
  activeProfile?: null;
}

// "livingAddress": "string",
// "country": "string",
// "regionName": "string",
// "districtName": "string",
// "clientPinfl": 0

export interface IUserInfo {
  phone: string;
  phone2: string;
  card: string;
  card_date: string;
  regionCode: string;
  ns10Code: string;
  district_code: string;
  neighborhood: string;
  street: string;
  homeNumber: string;
}

export interface Store {
  user: IBuyer | null;
  userInfo: IUserInfo | null;
}

interface Actions {
  setUser: (value: Store["user"]) => void;
  setUserInfo: (value: Store["userInfo"]) => void;
}

export const useBuyerStore = create<Store & Actions>()((set) => ({
  user: null,
  setUser: (user: Store["user"]) => set((state) => ({ user })),

  userInfo: null,
  setUserInfo: (userInfo: Store["userInfo"]) => set((state) => ({ userInfo })),
}));
