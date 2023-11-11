import AddCompanyModal from "@/pages/admin/company/AddCompanyModal.tsx";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight, Building, List, LogOut, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from 'moment/moment';

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

function CompanyList() {
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

  const columns: ColumnsType<ICompany> = [
    {
      title: "№",
      dataIndex: "NONE",
      align: 'center',
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: t("Korxona STIRi"),
      dataIndex: "tin",
      align: 'center',
    },
    {
      title: t("Korxona nomi"),
      dataIndex: "name",
      align: 'center',
    },
    {
      title: t("BrandName"),
      dataIndex: "brandName",
      align: 'center',
    },
    {
      title: t("Манзили"),
      dataIndex: "address",
      align: 'center',
    },
    {
      title: t("Direktor"),
      dataIndex: "directorName",
      align: 'center',
    },
    {
      title: t("Telefon nomer"),
      dataIndex: "contact",
      align: 'center',
    },
    {
      title: t("Дата регистрации"),
      dataIndex: "created_at",
      align: 'center',
      render(value, record, index) {
        return (
          moment(value).format("DD.MM.YYYY")
        );
      },
    },

    {
      title: t("Batafsil"),
      dataIndex: "",
      align: 'center',
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
    <>
        <Text h3>{t("Реестр клиентов")}</Text>
        <div className="h-[20px]" />
        <div className="w-full flex items-center justify-end">
          <AddCompanyModal onAdd={() => queryCompanies.refetch()} />
        </div>
        <div className="h-[20px]" />
        <Table pagination={false} dataSource={data} columns={columns} />
    </>
  );
}
export default CompanyList;
