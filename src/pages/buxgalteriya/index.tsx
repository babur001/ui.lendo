import Logo from "@/Logo";
import { TLanguages } from "@/auth/i18n";
import AnalyticsByDate from "@/pages/analytics";
import BusinessAnalytics from "../admin/business-analytics";
import Header from "@/pages/header/Header";
import { req } from "@/services/api";
import { Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Layout,
  Menu,
  MenuProps,
  Segmented,
  Table,
  Tabs,
  theme,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight, BarChart2, LineChart, Users } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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

function Wrapper() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "business-analytics",
      icon: <BarChart2 strokeWidth={1.5} className="!h-5" />,
      label: t(`Бизнес аналитика`),
    },
    {
      key: "analytics",
      icon: <LineChart strokeWidth={1.5} className="!h-5" />,
      label: t(`Статистика реализации`),
    },
    {
      key: "buyers",
      icon: <Users strokeWidth={1.5} className="!h-5" />,
      label: t(`Список клиентов`),
    },
  ];

  const changeLanguageHandler = (lang: TLanguages) => {
    i18n.changeLanguage(lang);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [menu, setMenu] = useState("business-analytics");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div>
      <Layout>
        <Layout.Sider
          width={240}
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center justify-center py-3">
            <Logo className="!h-10" />
          </div>

          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[menu]}
            items={items}
            onClick={(e) => setMenu(e.key)}
          />
        </Layout.Sider>

        <Layout style={{ padding: "0 24px 24px" }} className="bg-white">
          <Header />

          {menu === "business-analytics" ? <BusinessAnalytics /> : null}
          {menu === "analytics" ? <AnalyticsByDate /> : null}
        </Layout>
      </Layout>
    </div>
  );
}

export default Wrapper;
