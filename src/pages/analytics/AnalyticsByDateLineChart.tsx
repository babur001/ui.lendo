import { IAnalyticsByDateTabs, humanizeNumber } from "@/pages/analytics";
import { req } from "@/services/api";
import { Spinner } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { get, last } from "lodash";
import { useState } from "react";
import Chart from "react-apexcharts";

interface IAnalyticsChartData {
  periodTypeNo: number;
  periodType: IAnalyticsByDateTabs;
  period: number;
  periodName: string;
  cashTotal: number;
  cardTotal: number;
  totalSum: number;
}

function AnalyticsByDateLineChart({ type }: { type: IAnalyticsByDateTabs }) {
  const [year, setYear] = useState({
    year: 2023,
  });
  const queryChart = useQuery({
    queryKey: ["queryChart--AnalyticsByDate", type, year],
    queryFn: () => {
      let typeParam;

      if (type === "monthly") {
        typeParam = 1;
      } else if (type === "quarterly") {
        typeParam = 2;
      } else if (type === "yearly") {
        typeParam = 3;
      }

      return req({
        method: "GET",
        url: `/onkm_statistics/income-dynamics-chart`,
        params: {
          year: year,
          periodTypeNo: typeParam,
        },
      });
    },
  });
  const data = get(queryChart, "data.data.data", []) as IAnalyticsChartData[];

  const [tooltipVisible, setTooltipVisible] = useState(true);

  const total = data.map((stat) => stat.totalSum);
  const cash = data.map((stat) => stat.cashTotal);
  const card = data.map((stat) => stat.cardTotal);
  const periodNames = data.map((stat) => stat.periodName);

  return (
    <>
      {queryChart.status === "loading" ? (
        <div className="h-[350px] flex items-center justify-center">
          <Spinner className="!text-black !h-6" />
        </div>
      ) : (
        <div
          className="w-full rounded-lg h-full min-h-[350px] !pb-3 !relative"
          onMouseEnter={() => setTooltipVisible(false)}
          onMouseLeave={() => setTooltipVisible(true)}
        >
          {tooltipVisible ? (
            <div className="apexcharts-tooltip apexcharts-theme-light !w-40 apexcharts-active z-[10000] !left-auto !right-0 !top-0">
              <div
                className="apexcharts-tooltip-title apexcharts-active"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "12px",
                }}
              >
                {last(periodNames)}
              </div>
              <div
                className="apexcharts-tooltip-series-group apexcharts-active"
                style={{ order: 1, display: "flex" }}
              >
                <span
                  className="apexcharts-tooltip-marker"
                  style={{ backgroundColor: "rgb(1, 80, 205)" }}
                ></span>
                <div
                  className="apexcharts-tooltip-text"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                  }}
                >
                  <div className="apexcharts-tooltip-y-group">
                    <span className="apexcharts-tooltip-text-y-label">
                      Жами:{" "}
                    </span>
                    <span className="apexcharts-tooltip-text-y-value">
                      {humanizeNumber(last(total) ?? 0)}
                    </span>
                  </div>
                  <div className="apexcharts-tooltip-goals-group">
                    <span className="apexcharts-tooltip-text-goals-label"></span>
                    <span className="apexcharts-tooltip-text-goals-value"></span>
                  </div>
                  <div className="apexcharts-tooltip-z-group">
                    <span className="apexcharts-tooltip-text-z-label"></span>
                    <span className="apexcharts-tooltip-text-z-value"></span>
                  </div>
                </div>
              </div>
              <div
                className="apexcharts-tooltip-series-group apexcharts-active"
                style={{ order: 2, display: "flex" }}
              >
                <span
                  className="apexcharts-tooltip-marker"
                  style={{ backgroundColor: "rgb(234, 152, 30)" }}
                ></span>
                <div
                  className="apexcharts-tooltip-text"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                  }}
                >
                  <div className="apexcharts-tooltip-y-group">
                    <span className="apexcharts-tooltip-text-y-label">
                      Накд:{" "}
                    </span>
                    <span className="apexcharts-tooltip-text-y-value">
                      {humanizeNumber(last(cash) ?? 0)}
                    </span>
                  </div>
                  <div className="apexcharts-tooltip-goals-group">
                    <span className="apexcharts-tooltip-text-goals-label"></span>
                    <span className="apexcharts-tooltip-text-goals-value"></span>
                  </div>
                  <div className="apexcharts-tooltip-z-group">
                    <span className="apexcharts-tooltip-text-z-label"></span>
                    <span className="apexcharts-tooltip-text-z-value"></span>
                  </div>
                </div>
              </div>
              <div
                className="apexcharts-tooltip-series-group apexcharts-active"
                style={{ order: 3, display: "flex" }}
              >
                <span
                  className="apexcharts-tooltip-marker"
                  style={{ backgroundColor: "rgb(159, 196, 109)" }}
                ></span>
                <div
                  className="apexcharts-tooltip-text"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                  }}
                >
                  <div className="apexcharts-tooltip-y-group">
                    <span className="apexcharts-tooltip-text-y-label">
                      Пластик:{" "}
                    </span>
                    <span className="apexcharts-tooltip-text-y-value">
                      {humanizeNumber(last(card) ?? 0)}
                    </span>
                  </div>
                  <div className="apexcharts-tooltip-goals-group">
                    <span className="apexcharts-tooltip-text-goals-label"></span>
                    <span className="apexcharts-tooltip-text-goals-value"></span>
                  </div>
                  <div className="apexcharts-tooltip-z-group">
                    <span className="apexcharts-tooltip-text-z-label"></span>
                    <span className="apexcharts-tooltip-text-z-value"></span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Chart
            options={{
              tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                followCursor: true,
                y: {
                  formatter(val: any, opts: any) {
                    return String(humanizeNumber(+val));
                  },
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                },
              },
              markers: {
                size: 5,
              },
              colors: ["#0150CD", "#EA981E", "#9FC46D"],
              chart: {
                height: 350,
                toolbar: {
                  show: false,
                },
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: false,
              },

              xaxis: {
                position: "bottom",
                categories: periodNames,
              },
              yaxis: {
                labels: {
                  formatter: (value) => {
                    return String(humanizeNumber(value));
                  },
                },
              },
            }}
            series={[
              {
                name: `Жами`,
                data: total,
              },
              {
                name: `Накд`,
                data: cash,
              },
              {
                name: `Пластик`,
                data: card,
              },
            ]}
            type="bar"
            width={`100%`}
            height={`100%`}
          />
        </div>
      )}
    </>
  );
}

export default AnalyticsByDateLineChart;
