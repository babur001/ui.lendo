import {Input, Text} from "@geist-ui/core";
import {Button} from "antd";
import {useState} from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    onFinish: () => unknown;
}

function Approval({onFinish}: IProps) {
    const { t, i18n } = useTranslation();
    const [isSMS, setIsSMS] = useState(false);

    return (
        <>
            <Text h3>6. {t("Тасдиқлаш")}</Text>

            <div className="h-[10px]"/>

            <div className="!w-1/2">
                {isSMS ? (
                    <>
                        <Text p font={0.8}>
                            {/*Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
                            velit.         ШЕР*/}
                        </Text>

                        <Input
                            className="!w-full"
                            width={`100%`}
                            placeholder={t("кодни киритинг")}
                        >
                            {t("СМС код")}
                        </Input>

                        <div className="h-[20px]"/>

                        <Button onClick={onFinish} type="primary" block>
                            {t("Тасдиқлаш")}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between !gap-5">
                            <Input
                                className="!w-full"
                                width={`100%`}
                                placeholder="0000 0000 0000 0000"
                            >
                                {t("Банк карта рақами*")}
                            </Input>
                            <Input className="!w-full" placeholder="mm/yy">
                                {t("Амал қилиш муддати*")}
                            </Input>
                        </div>

                        <Text mb={1.3} p font={0.8}>
                            {/*Lorem ipsum dolor sit amet consectetur adipisicing elit.              //ШЕР
                            Perferendis ab eaque ullam ad commodi, dolor deserunt error ex
                            maxime sequi!*/}
                        </Text>

                        <Button onClick={() => setIsSMS(true)} type="primary" block>
                            {t("СМС тарзда код юбориш")}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}

export default Approval;
