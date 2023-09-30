import { Description, Input } from "@geist-ui/core";
import React from "react";
import { Control, useWatch } from "react-hook-form";

function TotalContractedSum({ control }: { control: Control }) {
  const values = useWatch({
    control,
  });

  let total = 0;

  (values?.products || []).forEach((product: any) => {
    total += (isNaN(+product.price) ? 0 : product.price) * product.count;
  });

  total -= isNaN(+values.initialPayment) ? 0 : values.initialPayment;

  const percentages = {
    4: 23,
    6: 30,
    9: 35,
    12: 40,
  } as any;

  const percentage =
    percentages[isNaN(+values.monthPeriod) ? 4 : values.monthPeriod];

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
