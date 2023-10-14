import AddSalePointModal from "@/pages/sale-points/AddSalePointModal";
import AddSellersModal from "@/pages/sale-points/AddSellersModal.tsx";
import {req} from "@/services/api";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Table, Layout, Select} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Calculator, LayoutDashboard, LogOut, User} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {TLanguages} from "@/auth/i18n.ts";
import i18n from "i18next";
import AddSellersModal2 from "@/pages/sale-points/AddSellersModal2.tsx";
import Header from "@/pages/header/Header.tsx";

export interface ICompany {
    createdAt: string;
    updatedAt: string;
    createdBy: CreatedByOrUpdatedBy;
    updatedBy: CreatedByOrUpdatedBy;
    companyId: number;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    regionName: string;
    regionCode: number;
    districtName: string;
    districtCode: number;
    address: string;
}

export interface CreatedByOrUpdatedBy {
    id: number;
    companyId: number;
}

export default function SalePoints() {
    const {t} = useTranslation();
    const navigate = useNavigate();


    const {companyId} = useParams();
    const querySalePoints = useQuery({
        queryKey: ["querySalePoints", companyId],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/company-admin/get-sale-points`,
                params: {
                    companyId: companyId,
                    page: 0,
                    size: 20,
                },
            });
        },
    });
    const data = get(querySalePoints, "data.data.data.content", []) as ICompany[];
    const total = get(
        querySalePoints,
        "data.data.data.totalElements",
        0
    ) as number;

    const columns: ColumnsType<ICompany> = [
        {
            title: "№",
            dataIndex: "NONE",
            render(value, record, index) {
                return <>{index + 1}</>;
            },
        },
        {
            title: t("Do'kon nomi"),
            dataIndex: "name",
        },
        {
            title: t("Do'kon joylashgan viloyat"),
            dataIndex: "regionName",
        },
        {
            title: t("Do'kon joylashgan tuman"),
            dataIndex: "districtName",
        },
        {
            title: t("Do'kon joylashgan manzil"),
            dataIndex: "address",
        },
        {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button onClick={() => navigate(`/sale-points/users`)}>
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },
    ];

    const changeLanguageHandler = (lang: TLanguages) => {
        i18n.changeLanguage(lang);
    };
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <div className="px-3 container mx-auto">
            <Header/>
            <Text h3>{t("Do'kon adminstratorining kabineti")}</Text>
            <div className="h-[10px]"/>
            <div className="w-full flex items-center justify-center gap-5">
                <Text h3>{t("Do'konlar reyesti")}</Text>
            </div>
            <div className="w-full flex items-center justify-end gap-5">
                <AddSalePointModal onAdd={() => querySalePoints.refetch()}/>

                <div className="w-[10px]"/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columns}/>
        </div>
    );
}
