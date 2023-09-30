import { Input } from "@geist-ui/core";
import React from "react";
import { Control, useWatch } from "react-hook-form";

function validateNumber(num: string | number, def: number = 0) {
  return isNaN(+num) ? def : +num;
}

function TotalSingleProduct({
  control,
  idx,
}: {
  control: Control;
  idx: number;
}) {
  const [count, price] = useWatch({
    control,
    name: [`products.${idx}.count`, `products.${idx}.price`],
  });

  const total = validateNumber(count, 1) * validateNumber(price, 0);
  console.log(total, validateNumber(count, 1), validateNumber(price, 0));

  return (
    <Input width={"100%"} value={String(total)} readOnly>
      Жами сумма
    </Input>
  );
}

export default TotalSingleProduct;
