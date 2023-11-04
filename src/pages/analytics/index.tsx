import {Checkbox} from "antd";
import classNames from "classnames";

import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {req} from "@/services/api";
import {get, toPairsIn} from "lodash";
import {formatNumber} from "@/auth/Scoring";
import AnalyticsByDateLineChart from "@/pages/analytics/AnalyticsByDateLineChart";
import {Spinner, Text} from "@geist-ui/core";
import Header from "@/pages/header/Header";

export type IAnalyticsByDateTabs = "monthly" | "quarterly" | "yearly";

interface IAnalyticsData {
    periodTypeNo: number;
    periodType: IAnalyticsByDateTabs;
    period: number;
    cashTotal: number;
    cardTotal: number;
    totalSum: number;
}

function AnalyticsByDate() {
    const [year, setYear] = useState({
        year: 2023,
    });
    const [activeFilter, setActiveFilter] =
        useState<IAnalyticsByDateTabs>("monthly");

    const queryAnalyticsByDate = useQuery({
        queryKey: ["queryAnalyticsByDate", year],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/onkm_statistics/income-dynamics-card`,
                params: {
                    year: year,
                },
            });
        },
    });

    const stats: Record<
        IAnalyticsByDateTabs,
        {
            title: string;
            children: Array<{ title: string; value: string | number }>;
        }
    > = {
        monthly: {
            title: "Ойлар кесимида",
            children: [],
        },
        quarterly: {
            title: "Чораклар кесимида",
            children: [],
        },
        yearly: {
            title: "Йиллар кесимида",
            children: [],
        },
    };

    (get(queryAnalyticsByDate, "data.data.data", []) as IAnalyticsData[]).forEach(
        (analytics) => {
            try {
                const card = stats[analytics.periodType];

                card.children.push(
                    ...[
                        {
                            title: "Жами",
                            value: humanizeNumber(analytics.totalSum, 1, true),
                        },
                        {
                            title: "Накд",
                            value: humanizeNumber(analytics.cashTotal, 1, true),
                        },
                        {
                            title: "Пластик",
                            value: humanizeNumber(analytics.cardTotal, 1, true),
                        },
                    ]
                );
            } catch (error) {
                console.log(error);
            }
        }
    );

    return (
        <>
            <div className="px-5 container  mx-auto">
                <Text h3>{"Analytics"}</Text>

                <div className="grid grid-cols-12 !gap-7">
                    <div className="col-span-4 rounded-md border border-gray-200 h-full">
                        {queryAnalyticsByDate.status === "loading" ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <Spinner className="!text-black !h-6"/>
                            </div>
                        ) : (
                            <div className="px-3 py-3 space-y-3">
                                {toPairsIn(stats).map(([key, stat], idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() =>
                                                setActiveFilter(key as IAnalyticsByDateTabs)
                                            }
                                            className={classNames({
                                                "rounded-md p-1 cursor-pointer border border-transparent":
                                                    true,
                                                "!border-blue-default/50": activeFilter === key,
                                            })}
                                        >
                                            <Checkbox checked={activeFilter === key}>
                                                {stat.title}
                                            </Checkbox>
                                            <div className="h-[5px]"/>
                                            <div className="grid grid-cols-3 gap-3">
                                                {stat.children.map((child, idx) => {
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={classNames({
                                                                "flex flex-col px-2 py-2 rounded-md": true,
                                                                "bg-[#F0F5FF]": idx === 0,
                                                                "bg-[#fff7d8]": idx === 1,
                                                                "bg-[#F0F8E6]": idx === 2,
                                                            })}
                                                        >
                              <span className="text-sm text-gray-500">
                                {child.title}:
                              </span>
                                                            <span
                                                                className={classNames({
                                                                    "font-bold": true,
                                                                    "text-[#325ECD]": idx === 0,
                                                                    "text-[#986a24]": idx === 1,
                                                                    "text-[#77a53b]": idx === 2,
                                                                })}
                                                            >
                                {child.value}
                              </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="col-span-8 h-full rounded-md border border-gray-200">
                        <AnalyticsByDateLineChart type={activeFilter}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export function humanizeNumber(num: number, round = 1, log = false) {
    if (num < 1_000_000) {
        return formatNumber(num);
    }

    var units = [
            "к",
            "млн",
            "млрд",
            "трлн",
            "квдрлн",
            "квнтлн",
            "скстлн",
            "Septillion",
            "Octillion",
            "Nonillion",
            "Decillion",
            "Undecillion",
        ],
        decimal;

    for (var i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);

        if (num <= -decimal || num >= decimal) {
            return (num / decimal).toFixed(round).concat(` ${units[i]}`);
        }
    }

    return num;
}

export default AnalyticsByDate;
