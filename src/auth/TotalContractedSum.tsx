import { Description, Input } from "@geist-ui/core";
import { get } from "lodash";
import React from "react";
import { Control, useWatch } from "react-hook-form";

function TotalContractedSum({ control }: { control: Control<any> }) {
  const values = useWatch({
    control,
  });

  let total = 0;

  get(values, "items", []).forEach((product: any) => {
    total += (isNaN(+product.price) ? 0 : product.price) * product.amount;
  });

  total -= isNaN(+values.paymentSum) ? 0 : values.paymentSum;

  const percentages = {
    4: 23,
    6: 30,
    9: 35,
    12: 40,
  } as any;

  const percentage =
    percentages[isNaN(+values.paymentPeriod) ? 4 : values.paymentPeriod];

  total = total + total * (percentage / 100);

  return (
    <Description
      className="flex-grow"
      title="Жами сумма"
      content={
        <Input scale={1.2} readOnly value={String(total)} width={"100%"} />
      }
    />
  );
}

export default TotalContractedSum;
