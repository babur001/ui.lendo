import { Description, Text } from "@geist-ui/core";
import { Button } from "antd";
import { ArrowRight, Download } from "lucide-react";

interface IProps {
  onFinish: () => unknown;
}

function Graph({ onFinish }: IProps) {
  return (
    <>
      <Text h3>7. Тўлов графиги</Text>

      <div className="h-[10px]" />

      <div className="flex flex-col gap-4">
        <Description title="Насия сумма:" content={"13 500 000"} />
        <Description title="Давр:" content={"9 Ой"} />
        <Description title="Ойлик тўлов:" content={"1 500 000"} />
      </div>

      <div className="h-[30px]" />

      <Button
        onClick={() => {
          onFinish();
        }}
        type="primary"
        className="flex items-center justify-center gap-4"
      >
        <Download strokeWidth={1.5} className="h-4 w-full" /> Тўлов графигини
        юклаш
      </Button>
    </>
  );
}

export default Graph;
