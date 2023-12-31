import { Button, Description, Text } from "@geist-ui/core";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IProps {
  onFinish: () => unknown;
}

function Client({ onFinish }: IProps) {
    const { t, i18n } = useTranslation();
  return (
    <>
      <Text h3>3. Klient</Text>

      <Text h4 mb={2}>
        Ma'lumotlar:
      </Text>

      <div className="flex flex-col gap-5">
        <Description title="Ism:" content={"Saburov Babur"} />
        <Description title="Телефон рақам:" content={"+998907271449"} />
        <Description title="Karta raqam:" content={"8600 **** **** 4844"} />
        <Text h3>...</Text>
      </div>

      <Button
        onClick={() => {
          onFinish();
        }}
        iconRight={<ArrowRight strokeWidth={1.5} />}
      >
          {t("Скоринг тизими")}
      </Button>
    </>
  );
}

export default Client;
