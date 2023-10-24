import AddCompanyModal from "@/pages/admin/AddCompanyModal";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CompanyTab() {
  const { t } = useTranslation();
  const queryCompanies = useQuery({
    queryKey: ["queryCompanies"],
    queryFn: () => {
      return req({
        method: "GET",
        url: `/admin/get-korxonas`,
        params: {
          //
        },
      });
    },
  });
  const data = get(queryCompanies, "data.data.data", []);
  const total = get(
    queryCompanies,
    "data.data.data.totalElements",
    0
  ) as number;
  const navigate = useNavigate();

  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "NONE",
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: t("korxonaTin"),
      dataIndex: "korxonaTin",
    },
    {
      title: t("korxonaName"),
      dataIndex: "korxonaName",
    },
    {
      title: t("korxonaShare"),
      dataIndex: "korxonaShare",
    },
    {
      title: t("korxonaInsurance"),
      dataIndex: "korxonaInsurance",
    },
    {
      title: t("operatorShare"),
      dataIndex: "operatorShare",
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
    },
  ];

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <AddCompanyModal onAdd={() => queryCompanies.refetch()} />
      </div>

      <div className="h-[20px]" />

      <Table pagination={false} dataSource={data} columns={columns} />
    </>
  );
}

export default CompanyTab;
