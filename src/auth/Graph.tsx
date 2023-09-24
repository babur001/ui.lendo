import { Description, Text } from "@geist-ui/core";
import { Button } from "antd";
import { ArrowRight, Download } from "lucide-react";

interface IProps {
  onFinish: () => unknown;
}

function Graph({ onFinish }: IProps) {
  return (
    <>
      <Text h3>8. Graph</Text>

      <div className="h-[10px]" />

      <div className="flex flex-col gap-4">
        <Description title="Summa rassrochki:" content={"13 500 000"} />
        <Description title="Umumiy nasiya:" content={"13 500 000"} />
        <Description title="Davr:" content={"9 oy"} />
        <Description title="Oylik to'lam:" content={"1 500 000"} />
      </div>

      <div className="h-[30px]" />

      <Button
        onClick={() => {
          onFinish();
        }}
        type="primary"
        className="flex items-center justify-center gap-4"
      >
        <Download strokeWidth={1.5} className="h-4 w-full" /> Jadvalni yuklash
      </Button>
    </>
  );
}

export default Graph;
