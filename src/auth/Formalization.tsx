import TotalContractedSum from "@/auth/TotalContractedSum";
import TotalSingleProduct from "@/auth/TotalSingleProduct";
import { Button, Description, Divider, Input, Text } from "@geist-ui/core";
import { Segmented } from "antd";
import { ColumnsType } from "antd/es/table";
import { ArrowRight, X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

interface ITableEDIT {
  //
}

interface IProps {
  onFinish: () => unknown;
}

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

function Formalization({ onFinish }: IProps) {
  const { control, register, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    append({});

    return () => remove();
  }, []);

  const onSubmit = (values: unknown) => {
    console.log(values);
  };

  return (
    <>
      <Text h3>5. Formalization</Text>

      <div className="h-[20px]" />

      {fields.map((field, idx) => {
        return (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-5 items-end !border !border-gray-300 px-3 py-5 rounded-md !mb-3"
          >
            <div className="col-span-3">
              <Input
                placeholder="..."
                width={"100%"}
                {...register(`products.${idx}.productName`)}
              >
                Маҳсулот номи
              </Input>
            </div>
            <div className="col-span-2">
              <Input
                initialValue={"1"}
                width={"100%"}
                {...register(`products.${idx}.count`)}
              >
                Миқдори
              </Input>
            </div>
            <div className="col-span-3">
              <Input width={"100%"} {...register(`products.${idx}.price`)}>
                Нархи
              </Input>
            </div>
            <div className="col-span-3">
              <TotalSingleProduct control={control} idx={idx} />
            </div>

            <div className="col-span-1" onClick={() => remove(idx)}>
              <Button iconRight={<X />} auto scale={3 / 4} px={0.6} />
            </div>
          </div>
        );
      })}

      <div className="h-[20px]" />

      <div className="col-span-12 grid grid-cols-12">
        <Button
          scale={0.7}
          className="col-start-1 col-end-3"
          type="success"
          onClick={() => append({ count: 1 })}
        >
          Маҳсулот қўшиш
        </Button>
      </div>

      <div className="h-[20px]" />

      <Divider />

      <div className="h-[20px]" />

      <div className="flex items-end justify-between gap-5">
        <Description
          title="Бошланғич тўлов"
          className="flex-grow"
          content={
            <Input
              placeholder={"0"}
              scale={1.2}
              width={"100%"}
              {...register("initialPayment")}
            />
          }
        />

        <Controller
          control={control}
          name="monthPeriod"
          render={({ field }) => {
            return (
              <Description
                title="Давр"
                content={
                  <Segmented
                    {...field}
                    size="large"
                    options={[
                      { label: "4 Ой", value: 4 },
                      { label: "6 Ой", value: 6 },
                      { label: "9 Ой", value: 9 },
                      { label: "12 Ой", value: 12 },
                    ]}
                  />
                }
              />
            );
          }}
        />

        <TotalContractedSum control={control} />

        <Button
          onClick={handleSubmit(onSubmit)}
          iconRight={<ArrowRight strokeWidth={1.5} className="!ml-2" />}
          type="success"
          className="!w-56"
        >
          Шартнома олиш
        </Button>
      </div>
    </>
  );
}

export default Formalization;
