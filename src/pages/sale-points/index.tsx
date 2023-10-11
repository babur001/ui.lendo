import AddSalePointModal from "@/pages/sale-points/AddSalePointModal";
import AddSalePointSellerModal from "@/pages/sale-points/AddSalePointSellerModal";
import {req} from "@/services/api";
import {Text} from "@geist-ui/core";
import {useQuery} from "@tanstack/react-query";
import {Button, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {get} from "lodash";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

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

export default function SalePoints() {
    const {t} = useTranslation();

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
            title: "",
            dataIndex: "NONE",
            render(value, record, index) {
                return <>{1 + index}</>;
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
            dataIndex: "directorName",
        },
        {
            title: t("Batafsil"),
            dataIndex: "",
            render(value, record, index) {
                return (
                    <Button>
                        <ArrowRight strokeWidth={1}/>
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="px-3 container mx-auto">
            <div className="h-[20px]"/>
            <Text h3>{t("Do'kon adminstratorining kabineti")}</Text>
            <div className="h-[10px]"/>
            <div className="w-full flex items-center justify-center gap-5"><Text h3>{t("Do'konlar reyesti")}</Text></div>
            <div className="w-full flex items-center justify-end gap-5">
                <AddSalePointModal onAdd={() => querySalePoints.refetch()}/>
                <AddSalePointSellerModal onAdd={() => querySalePoints.refetch()}/>
            </div>
            <div className="h-[20px]"/>
            <Table pagination={false}  dataSource={data} columns={columns}/>
        </div>
    );
}
