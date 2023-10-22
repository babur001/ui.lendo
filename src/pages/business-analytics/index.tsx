import Header from "@/pages/header/Header";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Segmented, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import React, { useState } from "react";

function BusinessAnalytics() {
  const [filter, setFilter] = useState({
    tab: "all",
  });
  const queryBusinessAnalytics = useQuery({
    queryKey: ["queryBusinessAnalytics", filter.tab],
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
  const data = get(queryBusinessAnalytics, "data.data.data.content", []);

  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "",
      render(value, record, index) {
        return <>{1 + index}</>;
      },
    },
    {
      title: "Савдо белгиси (бренд)",
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
      title: "Хизмат кўрсатувчи банк",
      dataIndex: "",
    },
    {
      title: "Оператор улуши",
      dataIndex: "",
    },
    {
      title: "Оператор фойдаси",
      dataIndex: "",
    },
  ];

  return (
    <>
      <div className="px-5 container  mx-auto">
        <Header />
        <div className="h-[30px]" />
        <Text h3>Бизнес аналитика</Text>
        <Segmented
          onChange={(tab) => setFilter({ ...filter, tab: tab as string })}
          value={filter.tab}
          options={[
            {
              label: "Фаолият бошидан",
              value: "all",
            },
            {
              label: "Жорий ой",
              value: "current_month",
            },
          ]}
        />
        <div className="h-[20px]" />
        <Table pagination={false} dataSource={data} columns={columns} />
      </div>
    </>
  );
}

export default BusinessAnalytics;
