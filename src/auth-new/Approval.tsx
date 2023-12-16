import {Description, Input, Text} from "@geist-ui/core";
import {Button, Input as AntdInput} from "antd";
import {useState} from "react";
import { useTranslation } from "react-i18next";
import {PatternFormat} from "react-number-format";

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
                        {/* //ШЕР
                        <Input
                                className="!w-full"
                                width={`100%`}
                                placeholder="0000 0000 0000 0000"
                            >
                                {t("Банк карта рақами*")}
                            </Input>
                            <Input className="!w-full" placeholder="mm/yy">
                                {t("Амал қилиш муддати*")}
                            </Input>*/}
                            <Description
                                title={t("Банк карта рақами*")}
                                className="!w-1/2"
                                content={
                                    <PatternFormat
                                        format="#### #### #### ####"
                                        mask={" "}
                                        customInput={AntdInput}
                                        className="!w-full"
                                        size="middle"
                                    />
                                }
                            />


                            <Description
                                title={t("Амал қилиш муддати*")}
                                className="!w-1/2"
                                content={
                                    <PatternFormat
                                        format="##/##"
                                        mask={" "}
                                        customInput={AntdInput}
                                        className="!w-full"
                                        size="middle"
                                    />
                                }
                            />
                        </div>

                        <Text mb={1.3} p font={0.8}>
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
