import AddSalePointModal from "@/pages/sale-points/AddSalePointModal";
import AddSalePointSellerModal from "@/pages/sale-points/AddSalePointSellerModal";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

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

export default function SalePoints() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { companyId } = useParams();
  const navigate = useNavigate();
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
      title: "T/R",
      dataIndex: "NONE",
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: t("Dokon nomi"),
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
      title: t("Dokon joylashgan manzil"),
      dataIndex: "address",
    },
    {
      title: t("Batafsil"),
      dataIndex: "",
      render(value, record, index) {
        return (
          <Button onClick={() => navigate(`/sellers/${record.id}`)}>
            <ArrowRight strokeWidth={1} />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="px-3 container mx-auto">
      <Layout>
        <Layout style={{ padding: "0 24px 24px" }} className="bg-white">
          <header>
            <div className="px-3 !mt-3 w-full flex items-center justify-end gap-5">
              <Select
                className="w-40"
                defaultValue={"ru"}
                onSelect={(e) => {
                  changeLanguageHandler(e as TLanguages);
                }}
                options={
                  [
                    {
                      label: "Русский",
                      value: "ru",
                    },
                    {
                      label: "Ўзбекча",
                      value: "uz_kyrl",
                    },
                    {
                      label: "O'zbekcha",
                      value: "uz_latn",
                    },
                  ] satisfies { label: React.ReactNode; value: TLanguages }[]
                }
              />

              <Button className="flex items-center" danger onClick={logout}>
                {t("Chiqish")}
                <LogOut strokeWidth={1.5} size={14} className="!ml-4" />
              </Button>
            </div>
          </header>
        </Layout>
      </Layout>
      <Text h3>{t("Do'kon adminstratorining kabineti")}</Text>
      <div className="h-[10px]" />
      <div className="w-full flex items-center justify-center gap-5">
        <Text h3>{t("Do'konlar reyesti")}</Text>
      </div>
      <div className="w-full flex items-center justify-end gap-5">
        <AddSalePointModal onAdd={() => querySalePoints.refetch()} />
        <AddSalePointSellerModal onAdd={() => querySalePoints.refetch()} />
      </div>
      <div className="h-[20px]" />
      <Table pagination={false} dataSource={data} columns={columns} />
    </div>
  );
}
