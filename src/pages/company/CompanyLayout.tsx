import {Layout, Menu, MenuProps, theme} from "antd";
import {Building, LineChart, List, Users} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Outlet, useNavigate} from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import Logo from "@/Logo";
import {TCompanyPages} from "@/App";
import React from "react";

function CompanyLayout() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const items: {
        key: TCompanyPages;
        icon: React.ReactNode;
        label: string;
    }[] = [
        {
            key: "analytics",
            icon: <LineChart strokeWidth={1.5} className="!h-5"/>,
            label: t(`Статистика реализации`),
        },  {
            key: "sale-points",
            icon: <Building strokeWidth={1.5} className="!h-5"/>,
            label: t(`Магазины`),
        },
        {
            key: "company-users",
            icon: <Users strokeWidth={1.5} className="!h-5"/>,
            label: t(`Xodim reyesti`),
        },

    ];

    const {
        token: {colorBgContainer},
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
                        <Logo className="!h-10"/>
                    </div>

                    <Menu
                        theme="light"
                        mode="inline"
                        items={items}
                        selectedKeys={[]}
                        onClick={(e) => navigate(`${e.key}`)}
                    />
                </Layout.Sider>
                <Layout style={{padding: "0 24px 24px"}} className="bg-white">
                    <Header/>
                    <Outlet/>
                </Layout>
            </Layout>
        </div>
    );
}

export default CompanyLayout;
