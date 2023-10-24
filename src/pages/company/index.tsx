import AddSalePointModal from "@/pages/company/AddSalePointModal";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Layout, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { TLanguages } from "@/auth/i18n.ts";
import i18n from "i18next";
import Header from "@/pages/header/Header.tsx";

export interface ICompany {
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedByOrUpdatedBy;
  updatedBy: CreatedByOrUpdatedBy;
  companyId: number;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  regionName: string;
  regionCode: number;
  districtName: string;
  districtCode: number;
  address: string;
}

export interface CreatedByOrUpdatedBy {
  id: number;
  companyId: number;
}

export default function Company() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { companyId } = useParams();
  const querySalePoints = useQuery({
    queryKey: ["querySalePoints", companyId],
    queryFn: () => {
      return req({
        method: "GET",
        url: `/company-admin/get-sale-points`,
        params: {
          companyId: companyId,
          page: 0,
          size: 20,
        },
      });
    },
  });
  const data = get(querySalePoints, "data.data.data.content", []) as ICompany[];
  const total = get(
    querySalePoints,
    "data.data.data.totalElements",
    0
  ) as number;

  const columns: ColumnsType<ICompany> = [
    {
      title: "№",
      dataIndex: "NONE",
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: t("Do'kon nomi"),
      dataIndex: "name",
    },
    {
      title: t("Do'kon joylashgan viloyat"),
      dataIndex: "regionName",
    },
    {
      title: t("Do'kon joylashgan tuman"),
      dataIndex: "districtName",
    },
    {
      title: t("Do'kon joylashgan manzil"),
      dataIndex: "address",
    },
    {
      title: t("Batafsil"),
      dataIndex: "",
      render(value, record, index) {
        return (
          <Button onClick={() => navigate(`/sale-points/users`)}>
            <ArrowRight strokeWidth={1} />
          </Button>
        );
      },
    },
  ];

  const changeLanguageHandler = (lang: TLanguages) => {
    i18n.changeLanguage(lang);
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="px-3 container mx-auto">
      <Text h3>{t("Do'kon adminstratorining kabineti")}</Text>

      <div className="w-full flex items-center ">
        <AddSalePointModal onAdd={() => querySalePoints.refetch()} />
      </div>

      <div className="h-[20px]" />
      <Table pagination={false} dataSource={data} columns={columns} />
    </div>
  );
}
