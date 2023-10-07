import { req } from "@/services/api";
import { useBuyerStore } from "@/stores/buyer";
import { Description, Note, Pagination, Spinner, Text } from "@geist-ui/core";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ITableEDIT {
  //
}

export type TStatus =
  | "STATUS_NEW"
  | "STATUS_PENDING"
  | "STATUS_ERROR"
  | "STATUS_SUCCESS";

interface IScoringResult {
  id: number;
  clientPinfl: number;
  scoringRate: number;
  scoringSum: number;
  cardMask: number;
  cardExpiry: number;
  cardId: string;
  status: TStatus;
}
interface IProps {
  onFinish: () => unknown;
}

function Scoring({ onFinish }: IProps) {
  const { clientScoringId } = useBuyerStore((store) => ({
    clientScoringId: store.clientScoringId,
  }));

  const queryScoring = useQuery({
    queryKey: ["queryScoring", clientScoringId],
    queryFn: () => {
      return req({
        method: "GET",
        url: "/registration/get-scoring-status",
        params: {
          scoringId: clientScoringId,
        },
      });
    },
    refetchInterval: 5000,
  });

  const status = get(
    queryScoring,
    "data.data.data.status",
    "STATUS_NEW"
  ) as TStatus;
  const result = get(queryScoring, "data.data.data", {}) as IScoringResult;

  const columns: ColumnsType<ITableEDIT> = [
    {
      title: "Ой",
      dataIndex: "month",
    },
    {
      title: "Минимал сумма",
      dataIndex: "min_sum",
    },
    {
      title: "Maksimal summa",
      dataIndex: "max_sum",
    },
  ];

  return (
    <>
      <Text h3>3. Скоринг тизими</Text>

      {(() => {
        if (status === "STATUS_PENDING" || status === "STATUS_NEW") {
          return (
            <div className="flex items-center justify-center h-full">
              <Spinner scale={2} />
            </div>
          );
        }

        if (status === "STATUS_ERROR") {
          return (
            <Alert
              message="Скоринг тизимидан ўта олмадингиз."
              type="error"
              showIcon
            />
          );
        }

        if (status === "STATUS_SUCCESS") {
          return (
            <>
              <Alert
                message="Табриклаймиз, скоринг муваффақиятли ўтилди"
                type="success"
                showIcon
              />

              <div className="h-[20px]" />

              <Description
                title={"Мавжуд лимит:"}
                content={get(result, "scoringSum", 0)}
                scale={1.25}
              />

              <div className="h-[20px]" />

              <Table
                columns={columns}
                bordered
                size="small"
                pagination={false}
                dataSource={[
                  {
                    month: 9,
                    min_sum: "500 000",
                    max_sum: "18 231 000",
                  },
                  {
                    month: 12,
                    min_sum: "500 000",
                    max_sum: "17 605 000",
                  },
                ]}
              />

              <div className="h-[20px]" />

              <div className="flex items-center justify-end">
                <Button
                  onClick={onFinish}
                  size="large"
                  type="primary"
                  className="!w-64"
                >
                  Расмийлаштиришга ўтинг
                </Button>
              </div>
            </>
          );
        }
      })()}
    </>
  );
}

export default Scoring;
