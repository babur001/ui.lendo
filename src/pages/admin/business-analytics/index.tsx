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
                url: `/stat/get-analytic-stat-monthly`,
                params: {
                    //
                },
            });
        },
    });
    const data = get(queryBusinessAnalytics, "data.data.data", []);
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
            dataIndex: "companyBrand",
        },
        {
            title: t("Харидорлар сони"),
            dataIndex: "consumerCnt",
        },
        {
            title: t("Аризалар сони"),
            dataIndex: "applicationCnt",
        },
        {
            title: t("Маҳсулотлар сони"),
            dataIndex: "productCnt",
        },
        {
            title: t("Харид суммаси"),
            dataIndex: "purchaseSum",
        },
        {
            title: t("Хизмат кўрсатувчи банк"),
            dataIndex: "bankName",
        },
        {
            title: t("Оператор улуши"),
            dataIndex: "operatorShare",
        },
        {
            title: t("Оператор фойдаси"),
            dataIndex: "operatorProfit",
        },
    ];

    return (
        <>
            <Text h3>Бизнес аналитика</Text>
            <div className="h-[20px]"/>
            <div className="w-full flex items-center justify-start">
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
            /></div>

            <div className="h-[20px]"/>
            <Table pagination={false} dataSource={data} columns={columns}/>
        </>
    );
}

export default BusinessAnalytics;
