import { Description, Text } from "@geist-ui/core";
import { Button } from "antd";
import { ArrowRight, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IProps {
  onFinish: () => unknown;
}

function Graph({ onFinish }: IProps) {
    const { t, i18n } = useTranslation();
  return (
    <>
      <Text h3>7. {t("Тўлов графиги")}</Text>

      <div className="h-[10px]" />

      <div className="flex flex-col gap-4">
        <Description title={t("Насия сумма:")} content={"13 500 000"} />
        <Description title={t("Давр:")} content={t("9 Ой")} />
        <Description title={t("Ойлик тўлов:")} content={"1 500 000"} />
      </div>

      <div className="h-[30px]" />

      <Button
        onClick={() => {
          onFinish();
        }}
        type="primary"
        className="flex items-center justify-center gap-4"
      >
        <Download strokeWidth={1.5} className="h-4 w-full" /> {t("Тўлов графигини юклаш")}
      </Button>
    </>
  );
}

export default Graph;
