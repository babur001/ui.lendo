
import {req} from "@/services/api";
import {useQuery} from "@tanstack/react-query";
import {Button, Layout, Menu, Select, Table, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight, LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";

interface IAuthUser {
    fullName: string;
    username: string;
    phone: string;
    pinfl: string;
    company: {
        name: string;
        tin: string;
        brandName: string;
    };
    roles: { authority: string }
}
export default function GetAuthUser() {
    const {t} = useTranslation();

    const queryGetAuthUser = useQuery({

        queryKey: ["queryCompanies"],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/auth/auth-info`,
                params: {
                    //
                },
            });
        },
    });
    const data = get(queryGetAuthUser, "data.data.data.content", []) as IAuthUser[];
    const columnsUser: ColumnsType<IAuthUser> = [
        {
            title: "",
            dataIndex: "NONE",
            render(value, record, index) {
                return <>{1 + index}</>;
            },
        },
        {
            title: t("Ходим СТИРи"),
            dataIndex: "fullName",
        },
        {
            title: t("Ходим ФИШ"),
            dataIndex: "username",
        },
        {
            title: t("Ходим телефон рақами"),
            dataIndex: "phone",
        }, {
            title: t("Login"),
            dataIndex: "pinfl",
        },
        {
            title: t("Роль"),
            dataIndex: "company.name",
        },
        {
            title: t("Роль"),
            dataIndex: "company.tin",
        },
        {
            title: t("Роль"),
            dataIndex: "company.brandName",
        },
        {
            title: t("Роль"),
            dataIndex: "roles.authority",
        },
        {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button >
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },
    ];


    return (
        <div className="px-5 container  mx-auto">
            <Table pagination={false} dataSource={data} columns={columnsUser}/>
        </div>
    );
}
