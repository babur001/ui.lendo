import AddCompanyModal from "@/pages/admin/AddCompanyModal";
import {req} from "@/services/api";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Layout, Menu, Select, Table, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Logo from "@/Logo.tsx";
import {TLanguages} from "@/auth/i18n.ts";
import Buyers from "@/pages/buyers";
import i18n from "i18next";


interface ICompany {
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
    const {t} = useTranslation();

    const queryCompanies = useQuery({
        queryKey: ["queryCompanies"],
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
    const data = get(queryCompanies, "data.data.data.content", []) as ICompany[];
    const total = get(
        queryCompanies,
        "data.data.data.totalElements",
        0
    ) as number;
    const navigate = useNavigate();

    const columns: ColumnsType<ICompany> = [
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
            title: t("Direktor"),
            dataIndex: "directorName",
        },
        {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button /*onClick={() => navigate(`/sale-points/${record.id}`)}*/>
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },
    ];


    /*{  ШЕР}*/
    const changeLanguageHandler = (lang: TLanguages) => {
        i18n.changeLanguage(lang);
    };
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };
    /*{  -------------------------}*/

    return (
        <div className="px-3 container mx-auto" >
            <Layout>
                <Layout style={{padding: "0 24px 24px"}} className="bg-white">
                    <header>
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
                    </header>
                </Layout>
            </Layout>
            <Text h3>{t("Operator shaxsiy kabineti")}</Text>
            <div className="w-full flex items-center justify-center gap-5"><Text h3>{t("Korxonalar reyesti")}</Text>
            </div>
            <div className="h-[20px]"/>
            <div className="w-full flex items-center justify-end">
                <AddCompanyModal onAdd={() => queryCompanies.refetch()}/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columns}/>
        </div>

    );
}
