import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import React from "react";

function Buyers() {
  const queryBuyers = useQuery({
    queryKey: ["queryBuyers"],
    queryFn: () => {
      return req({
        method: "GET",
        url: `/registration/get-applications`,
        params: {
          //
        },
      });
    },
  });
  const data = get(queryBuyers, "data.data.data.content", []);
  const total = get(queryBuyers, "data.data.data.totalElements", []);

  const columns: ColumnsType<IBuyer> = [
    {
      title: "",
      dataIndex: "NONE",
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: "ПИНФЛ",
      dataIndex: "clientPinfl",
    },
    {
      title: "ФИО",
      dataIndex: "",
      render(value, record, index) {
        const fullName = "".concat(
          get(record, "client.firstName", ""),
          " ",
          get(record, "client.lastName", ""),
          " ",
          get(record, "client.middleName", "")
        );

        return <>{fullName}</>;
      },
    },
    {
      title: "Телефон рақами",
      dataIndex: "client",
      render(value, record, index) {
        const phone = get(record, "clientProfile.phone1", "");

        return <>{phone}</>;
      },
    },
    {
      title: "Скоринг лимити",
      dataIndex: "",
    },
    {
      title: "Рассрочка суммаси",
      dataIndex: "paymentSum",
    },
    {
      title: "Епилган сумма",
      dataIndex: "",
    },
    {
      title: "Қолдиқ сумма",
      dataIndex: "",
    },
    {
      title: "Шартнома имзоланган сана",
      dataIndex: "",
    },
  ];
  return (
    <>
      <div className="h-[20px]" />

      <Text h3>Ҳаридорлар рўйхати</Text>

      <div className="h-[20px]" />

      <Table pagination={false} dataSource={data} columns={columns} />
    </>
  );
}

export interface IBuyer {
  clientPinfl: number;
  clientProfileId: number;
  paymentPeriod: number;
  paymentSum: number;
  paymentDayOfMonth: number;
  clientScoringId: number;
  clientPaymentConfirmationId?: null;
  items?: ItemsEntity[] | null;
  client: Client;
  clientProfile: ProfilesEntityOrActiveProfileOrClientProfile;
  clientPaymentConfirmation?: null;
}
export interface ItemsEntity {
  name: string;
  amount: number;
  price?: null;
}
export interface Client {
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
  profiles?: ProfilesEntityOrActiveProfileOrClientProfile[] | null;
  activeProfile: ProfilesEntityOrActiveProfileOrClientProfile;
}
export interface ProfilesEntityOrActiveProfileOrClientProfile {
  id: number;
  phone1: string;
  phone2: string;
  livingAddress: string;
  country: string;
  regionCode: number;
  regionName: string;
  district_code: number;
  districtName: string;
  neighborhood: string;
  street: string;
  homeNumber: string;
  clientPinfl: number;
  createdAt?: null;
  updatedAt?: null;
}

export default Buyers;
