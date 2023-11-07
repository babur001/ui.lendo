import {Input} from "@geist-ui/core";
import React from "react";
import {Control, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";

function validateNumber(num: string | number, def: number = 0) {
    return isNaN(+num) ? def : +num;
}

function TotalSingleProduct({
                                control,
                                idx
                            }: {
    control: Control<any>;
    idx: number
}) {
    const {t, i18n} = useTranslation();
    const [count, price, hasVat] = useWatch({
        control,
        name: [`items.${idx}.amount`, `items.${idx}.price`, `items.${idx}.hasVat`],
    });


    if (hasVat === 2) {
        const total_one = (validateNumber(count, 1) * validateNumber(price, 0) * 12 / 112) + validateNumber(count, 1) * validateNumber(price, 0);
        const total = Math.round(total_one * 100) / 100;
        return (
            <Input width={"100%"} value={String(total)} readOnly name={(`items.${idx}.priceWithVat`)}>
                {t("Жами сумма (ҚҚС билан)")}
            </Input>
        );
    } else {
        const total = validateNumber(count, 1) * validateNumber(price, 0);
        return (
            <Input width={"100%"} value={String(total)} readOnly name={(`items.${idx}.priceWithVat`)}>
                {t("Жами сумма (ҚҚС билан)")}
            </Input>
        )
    }
}

export default TotalSingleProduct;
