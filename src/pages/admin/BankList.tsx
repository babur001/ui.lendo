
import {req} from "@/services/api";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Layout, Menu, Select, Table, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Header from "@/pages/header/Header.tsx";
import AddBankModal from "@/pages/admin/AddBankModal.tsx";


interface IBank {
    id: string | number;
    bankName: string | number;
    bankTin: string | number;
    bankShare: string | number;
    bankInsurance: string | number;
    operatorShare: string | number;
    createdAt: string | number;
}


export default function BankList() {
    const {t} = useTranslation();

    const queryBanks = useQuery({
        queryKey: ["queryBanks"],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/admin/get-banks`,
                params: {
                    //
                },
            });
        },
    });
    const data = get(queryBanks, "data.data.data", []) as IBank[];
    const total = get(
        queryBanks,
        "data.data.data.totalElements",
        0
    ) as number;
    const navigate = useNavigate();


    /*{  ШЕР}*/
    const columns: ColumnsType<IBank> = [
        {
            title: "",
            dataIndex: "NONE",
            render(value, record, index) {
                return <>{1 + index}</>;
            },
        },
        {
            title: t("bankTin"),
            dataIndex: "bankTin",
        },
        {
            title: t("bankName"),
            dataIndex: "bankName",
        },
        {
            title: t("bankShare"),
            dataIndex: "bankShare",
        }, {
            title: t("bankInsurance"),
            dataIndex: "bankInsurance",
        },
        {
            title: t("operatorShare"),
            dataIndex: "operatorShare",
        },
        {
            title: t("createdAt"),
            dataIndex: "createdAt",
        },
        {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button onClick={() => navigate(`/BankList/company/${record.id}`)}>
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },
    ];


    return (
        <div className="px-5 container  mx-auto">
            <Header/>
            <Text h3>{t("Operator shaxsiy kabineti")}</Text>
            <div className="w-full flex items-center justify-center gap-5"><Text h3>{t("Korxonalar reyesti")}</Text>
            </div>
            <div className="h-[20px]"/>
            <div className="w-full flex items-center justify-end">
                <AddBankModal onAdd={() => queryBanks.refetch()}/>
                <div className="w-[40px]"/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columns}/>

        </div>


    );
}
