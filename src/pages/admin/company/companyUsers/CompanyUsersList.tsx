import {req} from "@/services/api.ts";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Layout, Select, Table, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import { useParams} from "react-router-dom";

interface ICompanyUsers {
    id: string | number;
    pinfl: string;
    fullName: string;
    phone: string;
    username: string;
    password: string;
    roles: {
        id: string;
        name: string;
    }[];
}

export default function CompanyUsersList() {
    const {t} = useTranslation();
    const params = useParams();

    const queryCompanyUsers = useQuery({
        queryKey: ["queryCompanies", params.companyId],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/auth/get-users-list`,
                params: {
                    companyId: params.companyId,
                },
            });
        },
    });

    const data = get(
        queryCompanyUsers,
        "data.data.data.content",
        []
    ) as ICompanyUsers[];
    const total = get(
        queryCompanyUsers,
        "data.data.data.totalElements",
        0
    ) as number;

    const columnsUser: ColumnsType<ICompanyUsers> = [
        {
            title: "",
            dataIndex: "NONE",
            render(value, record, index) {
                return <>{1 + index}</>;
            },
        },
        {
            title: t("Ходим СТИРи"),
            dataIndex: "pinfl",
        },
        {
            title: t("Ходим ФИШ"),
            dataIndex: "fullName",
        },
        {
            title: t("Ходим телефон рақами"),
            dataIndex: "phone",
        },
        {
            title: t("Login"),
            dataIndex: "username",
        },
        {
            title: t("Роль"),
            dataIndex: "roles",
            render(value, record, index) {
                const role = get(value, "0.name", "-");
                return t(role);
            },
        },
        {
            title: t("Создатель"),
            dataIndex: "roles",
            render(value, record, index) {
                const role = get(value, "0.name", "-");
                return t(role);
            },
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

    return (
        <>
            <Text h3>{t("Xodim reyesti")}</Text>
            <div className="h-[60px]"/>
            <div className="w-full flex items-center justify-end">
                <div className="w-[40px]"/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columnsUser}/>
        </>
    );
}
