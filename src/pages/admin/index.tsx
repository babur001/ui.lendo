import {Layout, Menu, MenuProps, theme} from "antd";

import {Building, List, Users} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import {TLanguages} from "@/auth/i18n";
import Logo from "@/Logo";
import {useState} from "react";
import BusinessAnalytics from "../admin/business-analytics";
import BankList from "@/pages/admin/bank/BankList.tsx";
import CompanyList from "@/pages/admin/company/CompanyList.tsx";

function Wrapper() {
    const {t, i18n} = useTranslation();

    const navigate = useNavigate();
    const items: MenuProps["items"] = [
        {
            key: "business-analytics",
            icon: <Building strokeWidth={1.5} className="!h-5"/>,
            label: t(`Бизнес аналитика`),
        },
        {
            key: "clients",
            icon: <Users strokeWidth={1.5} className="!h-5"/>,
            label: t(`Реестр клиентов`),
        },
        {
            key: "bank",
            icon: <List strokeWidth={1.5} className="!h-5"/>,
            label: t(`Реестр кредитующих организации`),
        },
    ];

    const changeLanguageHandler = (lang: TLanguages) => {
        i18n.changeLanguage(lang);
    };

    const {
        token: {colorBgContainer},
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
                        <Logo className="!h-10"/>
                    </div>

                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[menu]}
                        items={items}
                        onClick={(e) => setMenu(e.key)}
                    />
                </Layout.Sider>

                <Layout style={{padding: "0 24px 24px"}} className="bg-white">
                    <Header/>
                    {menu === "business-analytics" ? <BusinessAnalytics/> : null}
                    {menu === "clients" ? <CompanyList/> : null}
                    {menu === "bank" ? <BankList/> : null}
                </Layout>
            </Layout>
        </div>
    );
}

export default Wrapper;
