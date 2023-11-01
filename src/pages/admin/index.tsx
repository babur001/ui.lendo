import AddCompanyModal from "@/pages/admin/AddCompanyModal";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Layout, Menu, MenuProps, Select, Table, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight, Building, List, LogOut, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import { TLanguages } from "@/auth/i18n";
import Logo from "@/Logo";
import { useState } from "react";
import BusinessAnalytics from "@/pages/business-analytics";
import Company from "@/pages/company";
import BankList from "@/pages/admin/BankList";

interface ICompany {
  id: string | number;
  name: string | number;
  tin: string | number;
  address: string | number;
  brandName: string | number;
  directorName: string | number;
  contact: string | number;
  notes: string | number;
}

function Admin() {
  const { t } = useTranslation();

  const queryCompanies = useQuery({
    queryKey: ["queryCompanies"],
    queryFn: () => {
      return req({
        method: "GET",
        url: `/admin/get-companies`,
        params: {
          //
        },
      });
    },
  });
  const data = get(queryCompanies, "data.data.data.content", []) as ICompany[];
  const total = get(
    queryCompanies,
    "data.data.data.totalElements",
    0
  ) as number;
  const navigate = useNavigate();

  /*{  ШЕР}*/
  const columns: ColumnsType<ICompany> = [
    {
      title: "",
      dataIndex: "NONE",
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: t("Korxona STIRi"),
      dataIndex: "tin",
    },
    {
      title: t("Korxona nomi"),
      dataIndex: "name",
    },
    {
      title: t("BrandName"),
      dataIndex: "brandName",
    },
    {
      title: t("Манзили"),
      dataIndex: "address",
    },
    {
      title: t("Direktor"),
      dataIndex: "directorName",
    },
    {
      title: t("Telefon nomer"),
      dataIndex: "contact",
    },
    {
      title: t("Дата регистрации"),
      dataIndex: "created_at",
    },
    {
      title: t("Всего ролей"),
      dataIndex: "all_roles",
    },
    {
      title: t("Из них администраторов"),
      dataIndex: "admins",
    },
    {
      title: t("Из них сотрудников"),
      dataIndex: "personals",
    },
    {
      title: t("Batafsil"),
      dataIndex: "",
      render(value, record, index) {
        return (
          <Button onClick={() => navigate(`/admin/company/${record.id}`)}>
            <ArrowRight strokeWidth={1} />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="px-5 container  mx-auto">
      <Header />
      <Text h3>{t("Operator shaxsiy kabineti")}</Text>
      <div className="w-full flex items-center justify-center gap-5">
        <Text h3>{t("Korxonalar reyesti")}</Text>
      </div>
      <div className="h-[20px]" />
      <div className="w-full flex items-center justify-end">
        <AddCompanyModal onAdd={() => queryCompanies.refetch()} />
        <div className="w-[40px]" />
        <Button onClick={() => navigate(`/admin/bank`)} type="primary">
          {t("Банк")}
        </Button>
        <div className="w-[40px]" />
      </div>
      <div className="h-[20px]" />
      <Table pagination={false} dataSource={data} columns={columns} />
    </div>
  );
}

export default Admin;
