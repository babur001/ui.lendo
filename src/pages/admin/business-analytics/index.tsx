import Header from "@/pages/header/Header.tsx";
import {req} from "@/services/api.ts";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Segmented, Table, Tabs} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

function BusinessAnalytics() {
    const [filter, setFilter] = useState({
        tab: "all",
    });
    const queryBusinessAnalytics = useQuery({
        queryKey: ["queryBusinessAnalytics", filter.tab],
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
    const data = get(queryBusinessAnalytics, "data.data.data.content", []);
    const {t, i18n} = useTranslation();
    const columns: ColumnsType<any> = [
        {
            title: "",
            dataIndex: "",
            render(value, record, index) {
                return <>{1 + index}</>;
            },
        },
        {
            title: t("Савдо белгиси (бренд)"),
            dataIndex: "",
        },
        {
            title: t("Харидорлар сони"),
            dataIndex: "",
        },
        {
            title: t("Аризалар сони"),
            dataIndex: "",
        },
        {
            title: t("Маҳсулотлар сони"),
            dataIndex: "",
        },
        {
            title: t("Харид суммаси"),
            dataIndex: "",
        },
        {
            title: t("Хизмат кўрсатувчи банк"),
            dataIndex: "",
        },
        {
            title: t("Оператор улуши"),
            dataIndex: "",
        },
        {
            title: t("Оператор фойдаси"),
            dataIndex: "",
        },
    ];

    return (
        <>
            <div className="px-5 container  mx-auto">
                <Text h3>Бизнес аналитика</Text>
                <Segmented
                    onChange={(tab) => setFilter({...filter, tab: tab as string})}
                    value={filter.tab}
                    options={[
                        {
                            label: t("Фаолият бошидан"),
                            value: "all",
                        },
                        {
                            label: t("Жорий ой"),
                            value: "current_month",
                        },
                    ]}
                />
                <div className="h-[20px]"/>
                <Table pagination={false} dataSource={data} columns={columns}/>
            </div>
        </>
    );
}

export default BusinessAnalytics;
