import { Button, Description, Note, Pagination, Text } from "@geist-ui/core";
import { Alert, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ITableEDIT {
  //
}

interface IProps {
  onFinish: () => unknown;
}

function Scoring({ onFinish }: IProps) {
  const columns: ColumnsType<ITableEDIT> = [
    {
      title: "Oy",
      dataIndex: "month",
    },
    {
      title: "Minimal summa",
      dataIndex: "min_sum",
    },
    {
      title: "Maksimal summa",
      dataIndex: "max_sum",
    },
  ];

  return (
    <>
      <Text h3>4. Scoring</Text>

      <Alert
        message="Tabriklaymiz, skoring muvaffaqiyatli o'tildi!"
        type="success"
        showIcon
      />

      <div className="h-[20px]" />

      <Description
        title={"Mavjud limit:"}
        content={"17 875 000"}
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
          iconRight={<ArrowRight strokeWidth={1.5} />}
          type="success"
          className="!w-64"
        >
          Rasmiylashtirishga o'tish
        </Button>
      </div>
    </>
  );
}

export default Scoring;
