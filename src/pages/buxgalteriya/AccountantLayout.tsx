import {Layout, Menu, MenuProps, theme} from "antd";
import {BarChart2, Building, LineChart, List, Users} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Outlet, useNavigate} from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import Logo from "@/Logo";
import {TAccountantPages, TEmployeePages} from "@/App";
import React from "react";

function AccountantLayout() {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const items: {
        key: TAccountantPages;
        icon: React.ReactNode;
        label: string;
    }[] = [
        {
            key: "business-report",
            icon: <BarChart2 strokeWidth={1.5} className="!h-5"/>,
            label: t(`Отчет по реализациям`),
        },
        {
            key: "analytics",
            icon: <LineChart strokeWidth={1.5} className="!h-5"/>,
            label: t(`Статистика реализации`),
        },
        {
            key: "buyers",
            icon: <Users strokeWidth={1.5} className="!h-5"/>,
            label: t(`Ҳаридорлар рўйхати`),
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

export default AccountantLayout;
