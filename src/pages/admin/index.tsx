import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface ICompanies {
  id: string | number;
  name: string | number;
  tin: string | number;
  address: string | number;
  brandName: string | number;
  directorName: string | number;
  contact: string | number;
  notes: string | number;
}

export default function Admin() {
  const { t } = useTranslation();

  const queryBuyers = useQuery({
    queryKey: ["queryBuyers"],
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
  const data = get(queryBuyers, "data.data.data.content", []);
  const total = get(queryBuyers, "data.data.data.totalElements", 0);
  console.log(data);

  const columns: ColumnsType<ICompanies> = [
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
      title: t("Telefon nomer"),
      dataIndex: "contact",
    },
    {
      title: t("Adminstrator"),
      dataIndex: "directorName",
    },
    {
      title: t("Batafsil"),
      dataIndex: "",
      render(value, record, index) {
        return (
          <Button>
            <ArrowRight strokeWidth={1} />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="px-3 container mx-auto">
      <div className="h-[20px]" />

      <Text h3>{t("Operator shaxsiy kabineti")}</Text>

      <div className="h-[20px]" />

      <Table pagination={false} dataSource={data} columns={columns} />
    </div>
  );
}
