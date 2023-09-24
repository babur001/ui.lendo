import {
  Button,
  Description,
  Divider,
  Input,
  Note,
  Pagination,
  Text,
} from "@geist-ui/core";
import { Alert, Segmented, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { log } from "console";
import { ArrowRight, Minus, Plus, X } from "lucide-react";
import React, { useRef } from "react";

interface ITableEDIT {
  //
}

interface IProps {
  onFinish: () => unknown;
}

function Formalization({ onFinish }: IProps) {
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
      <Text h3>5. Formalization</Text>

      <div className="h-[20px]" />

      <div className="grid grid-cols-12 gap-5 items-end !border !border-gray-300 px-3 py-5 rounded-md">
        <div className="col-span-3">
          <Input placeholder="..." width={"100%"}>
            Tovar nomi
          </Input>
        </div>
        <div className="col-span-2">
          <Input initialValue={"1"} width={"100%"}>
            Dona
          </Input>
        </div>
        <div className="col-span-3">
          <Input width={"100%"}>1 tovar uchun narxi</Input>
        </div>
        <div className="col-span-3">
          <Input width={"100%"}>1 tovar uchun narxi</Input>
        </div>
        <div className="col-span-1">
          <Button iconRight={<X />} auto scale={3 / 4} px={0.6} />
        </div>
      </div>

      <div className="h-[20px]" />

      <div className="col-span-12 grid grid-cols-12">
        <Button scale={0.7} className="col-start-1 col-end-3" type="success">
          Tovar qo'shish
        </Button>
      </div>

      <div className="h-[20px]" />

      <Divider />

      <div className="h-[20px]" />

      <div className="flex items-end justify-between gap-5">
        <Description
          title="Bosh to'lam"
          className="flex-grow"
          content={<Input initialValue={"0"} scale={1.2} width={"100%"} />}
        />
        <Description
          title="Davr"
          content={
            <Segmented
              size="large"
              options={["4 oy", "6 oy", "9 oy", "12 oy"]}
            />
          }
        />
        <Description
          className="flex-grow"
          title="Jami"
          content={
            <Input scale={1.2} readOnly value={"31 500 000"} width={"100%"} />
          }
        />

        <Button
          onClick={onFinish}
          iconRight={<ArrowRight strokeWidth={1.5} />}
          type="success"
          className="!w-56"
        >
          Shartnoma olish
        </Button>
      </div>
    </>
  );
}

export default Formalization;
