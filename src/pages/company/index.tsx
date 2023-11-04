import { Layout, MenuProps, theme, Menu } from "antd";

import { Building, List, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import { useState } from "react";
import Logo from "@/Logo.tsx";
import SalePointList from "@/pages/company/admin/SalePointList.tsx";
import UsersList from "@/pages/company/admin/UsersList.tsx";

function WrapperCompany() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "sale-points",
      icon: <Building strokeWidth={1.5} className="!h-5" />,
      label: t(`Магазины`),
    },
    {
      key: "clients",
      icon: <Users strokeWidth={1.5} className="!h-5" />,
      label: t(`Реестр клиентов`),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [menu, setMenu] = useState("sale-points");
  return (
    <div>
      <SalePointList />
      <UsersList />
    </div>
  );
}

export default WrapperCompany;
