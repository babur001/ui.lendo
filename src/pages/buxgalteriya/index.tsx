import Header from "@/pages/header/Header";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Button, Segmented, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

function Buxgalteriya() {
  const queryBuxgalteriya = useQuery({
    queryKey: ["queryBuxgalteriya"],
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
  const data = get(queryBuxgalteriya, "data.data.data.content", []);

  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "",
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: "Дўконлар",
      dataIndex: "",
    },
    {
      title: "Харидорлар сони",
      dataIndex: "",
    },
    {
      title: "Аризалар сони",
      dataIndex: "",
    },
    {
      title: "Маҳсулотлар сони",
      dataIndex: "",
    },
    {
      title: "Харид суммаси",
      dataIndex: "",
    },
    {
      title: "Харид суммаси ҚҚС билан",
      dataIndex: "",
    },
    {
      title: "Тўланган",
      dataIndex: "",
      children: [
        {
          title: "Харидорлар сони",
          dataIndex: "",
        },
        {
          title: "Суммаси",
          dataIndex: "",
        },
      ],
    },
    {
      title: "Тўланмаган",
      dataIndex: "",
      children: [
        {
          title: "Харидорлар сони",
          dataIndex: "",
        },
        {
          title: "Суммаси",
          dataIndex: "",
        },
      ],
    },
    {
      title: "Batafsil",
      dataIndex: "",
      render(value, record, index) {
        return (
          <Button
          // onClick={() => navigate(`/admin/company/${record.id}`)}
          >
            <ArrowRight strokeWidth={1} />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="px-5 container  mx-auto">
        <Header />
        <div className="h-[30px]" />
        <Text h3>Бухгалтерия ҳисоботи</Text>

        <div className="h-[20px]" />
        <Table pagination={false} dataSource={data} columns={columns} />
      </div>
    </>
  );
}

export default Buxgalteriya;
