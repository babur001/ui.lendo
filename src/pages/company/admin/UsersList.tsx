import {req} from "@/services/api.ts";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Layout, Select, Table, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import AddCompanyUsersModal from "@/pages/company/admin/AddCompanyUsersModal.tsx";
import Header from "@/pages/header/Header.tsx";
import {useParams} from "react-router-dom";
import useAuthUser from "@/auth/useAuthUser.tsx";


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


export default function UsersList() {
    const {t} = useTranslation();

    const user = useAuthUser();
    const companyId = get(user, "data.data.data.companyId", null);
    const queryCompanyUsers = useQuery({
        queryKey: ["queryCompanies"],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/auth/get-users-list`,
                params: {
                    "companyId": companyId,
                },
            });
        },
    });


    const data = get(queryCompanyUsers, "data.data.data.content", []) as ICompanyUsers[];
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
        }, {
            title: t("Login"),
            dataIndex: "username",
        },
        {
            title: t("Роль"),
            dataIndex: "roles",
            render(value, record, index) {
                const role = get(value, '0.name', '-')
                return (
                    t(role)
                );
            },
        },
        {
            title: t("Создатель"),
            dataIndex: "roles",
            render(value, record, index) {
                const role = get(value, '0.name', '-')
                return (
                    t(role)
                );
            },
        },
     /*   {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button /!*onClick={() => navigate(`/sale-points/${record.id}`)}*!/>
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },*/
    ];

    return (
        <>
            <Text h3>{t("Xodim reyesti")}</Text>
            <div className="w-full flex items-center justify-end">
                <AddCompanyUsersModal onAdd={() => queryCompanyUsers.refetch()}/>
                <div className="w-[40px]"/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columnsUser}/>
        </>
    );
}