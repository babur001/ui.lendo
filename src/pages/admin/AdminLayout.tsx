import { Layout, Menu, MenuProps, theme } from "antd";
import { Building, List, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import Logo from "@/Logo";
import { TAdminPages } from "@/App";

function AdminLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const items: {
    key: TAdminPages;
    icon: React.ReactNode;
    label: string;
  }[] = [
    {
      key: "business-analytics",
      icon: <Building strokeWidth={1.5} className="!h-5" />,
      label: t(`Бизнес аналитика`),
    },
    {
      key: "clients",
      icon: <Users strokeWidth={1.5} className="!h-5" />,
      label: t(`Реестр клиентов`),
    },
    {
      key: "companies",
      icon: <List strokeWidth={1.5} className="!h-5" />,
      label: t(`Реестр кредитующих организации`),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
            items={items}
            selectedKeys={[]}
            onClick={(e) => navigate(`${e.key}`)}
          />
        </Layout.Sider>

        <Layout style={{ padding: "0 24px 24px" }} className="bg-white">
          <Header />
          <Outlet />
        </Layout>
      </Layout>
    </div>
  );
}

export default AdminLayout;
