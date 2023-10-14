import {Button, Layout, Select} from "antd";
import {useTranslation} from "react-i18next";
import {ArrowBigLeft, LogOut} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {TLanguages} from "@/auth/i18n.ts";
import i18n from "i18next";


export default function Header() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const changeLanguageHandler = (lang: TLanguages) => {
        i18n.changeLanguage(lang);
    };
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };
    const goback = () => {
        navigate("/nasiya");
    };
    return (
        <div className="px-3 container mx-auto">
            <Layout>
                <Layout style={{padding: "0 24px 24px"}} className="bg-white">
                    <header>
                        <div className="!mt-3 flex items-start">
                            <div className="!mt-3 flex justify-start gap-5">
                                <Button className="flex items-center" onClick={goback}>
                                    <ArrowBigLeft strokeWidth={1.5} size={14} className=""/>
                                    <div className="px-2"/>
                                    {t("Orqaga")}
                                </Button>
                            </div>
                            <div className="px-3 !mt-3 w-full flex items-center justify-end gap-5">
                                <Select
                                    className="w-40"
                                    defaultValue={"ru"}
                                    onSelect={(e) => {
                                        changeLanguageHandler(e as TLanguages);
                                    }}
                                    options={
                                        [
                                            {
                                                label: "Русский",
                                                value: "ru",
                                            },
                                            {
                                                label: "Ўзбекча",
                                                value: "uz_kyrl",
                                            },
                                            {
                                                label: "O'zbekcha",
                                                value: "uz_latn",
                                            },
                                        ] satisfies { label: React.ReactNode; value: TLanguages }[]
                                    }
                                />

                                <Button className="flex items-center" danger onClick={logout}>
                                    {t("Chiqish")}
                                    <LogOut strokeWidth={1.5} size={14} className="!ml-4"/>
                                </Button>
                            </div>
                        </div>

                    </header>
                </Layout>
            </Layout>
        </div>
    );
}
