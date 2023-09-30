import { Description, Input } from "@geist-ui/core";
import React from "react";
import { Control, useWatch } from "react-hook-form";

function TotalContractedSum({ control }: { control: Control }) {
  const values = useWatch({
    control,
  });

  console.log(values);

  return (
    <Description
      className="flex-grow"
      title="Жами сумма"
      content={
        <Input scale={1.2} readOnly value={"31 500 000"} width={"100%"} />
      }
    />
  );
}

export default TotalContractedSum;
