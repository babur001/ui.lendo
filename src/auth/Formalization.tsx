import TotalContractedSum from "@/auth/TotalContractedSum";
import TotalSingleProduct from "@/auth/TotalSingleProduct";
import {req} from "@/services/api";
import {IProducts, IUserInfo, useBuyerStore} from "@/stores/buyer";
import {Description, Divider, Input, Text} from "@geist-ui/core";
import {useMutation} from "@tanstack/react-query";
import {Button, Segmented, message, Select} from "antd";
import {get} from "lodash";
import {ArrowRight, X} from "lucide-react";
import {useEffect, useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {log} from "console";

interface ITableEDIT {
    //
}

interface IProps {
    onFinish: () => unknown;
}

function Formalization({onFinish}: IProps) {
    const {t, i18n} = useTranslation();
    const {user, clientProfileId, clientScoringId, products, setProducts} =
        useBuyerStore((store) => ({
            user: store.user,
            products: store.products,
            setProducts: store.setProducts,
            clientProfileId: store.clientProfileId,
            clientScoringId: store.clientScoringId,
        }));

    const {control, register, handleSubmit} = useForm<IProducts>({
        defaultValues: {
            paymentSum: 0,
            paymentPeriod: 4,
            paymentDayOfMonth: 1,
            ...(products ? products : {}),
        },
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: "items",
    });

    const mutateAddProduct = useMutation({
        mutationKey: ["mutateAddProduct"],
        mutationFn: (
            addProductParams: IProducts & {
                clientProfileId: string | number;
                clientScoringId: string | number;
                clientPinfl: number | string;
            }
        ) => {
            return req({
                method: "POST",
                url: `/registration/set-application`,
                data: {
                    ...addProductParams,
                    fileId: 1, //ШЕР
                },
            });
        },
    });

    useEffect(() => {
        append({name: "", amount: 1, price: "", hasVat: 0, priceWithVat: 0});

        return () => remove();
    }, []);

    const onSubmit = async (values: IProducts) => {
        if (!clientProfileId || !clientScoringId) {
            return message.error(t(`Avtorizatysaiyadan qaytadan o'ting!`));
        }

        const data = {
            ...values,
            clientPinfl: get(user, "pinfl", ""),
            clientProfileId,
            clientScoringId,

        };

        setProducts(values);

        const res = await mutateAddProduct.mutateAsync(data);

        const success = get(res, "data.success", false);

        if (success) {
            onFinish();
        }

        if (!success) {
            message.error(t(`Kutilmagan xatolik!`));
        }
    };

    return (
        <>
            <Text h3>4. {t("Расмийлаштириш")}</Text>

            <div className="h-[20px]"/>

            {fields.map((field, idx) => {
                return (
                    <div
                        key={field.id}
                        className="grid grid-cols-12 gap-5 items-end !border !border-gray-300 px-3 py-5 rounded-md !mb-3"
                    >
                        <div className="col-span-3">
                            <Input
                                placeholder="..."
                                width={"100%"}
                                {...register(`items.${idx}.name` as const)}
                            >
                                {t("Маҳсулот номи")} {idx + 1}
                            </Input>
                        </div>
                        <div className="col-span-2">
                            <Input
                                initialValue={"1"}
                                width={"100%"}
                                {...register(`items.${idx}.amount` as const)}
                            >
                                {t("Миқдори")}
                            </Input>
                        </div>
                        <div className="col-span-2">
                            <Input width={"100%"} {...register(`items.${idx}.price`)}>
                                {t("Нархи")}
                            </Input>
                        </div>

                        <div className="col-span-2">
                            <Controller
                                control={control}
                                name={`items.${idx}.hasVat`}
                                render={({field}) => {
                                    return (
                                        <Description
                                            title={t("ҚҚС")}
                                            content={
                                                <Select
                                                    className={"w-full"}
                                                    {...field}
                                                    size="large"
                                                    defaultValue={1}
                                                    options={[
                                                        {label: t("ҚҚСсиз"), value: 1},
                                                        {label: t("ҚҚС билан"), value: 2},
                                                    ]}
                                                />
                                            }
                                        />
                                    );
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <TotalSingleProduct control={control} idx={idx}/>
                        </div>

                        <div className="col-span-1" onClick={() => remove(idx)}>
                            <Button
                                className="flex items-center justify-center !w-9 !h-9 !p-0"
                                disabled={fields.length === 1}
                            >
                                <X strokeWidth={1.5} className="!h-5"/>
                            </Button>
                        </div>
                    </div>
                );
            })}

            <div className="h-[20px]"/>

            <div className="col-span-12 grid grid-cols-12">
                <Button
                    className="col-span-3"
                    type="primary"
                    onClick={() =>
                        append({
                            name: "",
                            amount: 1,
                            price: "",
                            hasVat: 1,
                            priceWithVat: 0,
                        })
                    } //ШЕР
                >
                    {t("Маҳсулот қўшиш")}
                </Button>
            </div>

            <div className="h-[20px]"/>

            <Divider/>

            <div className="h-[20px]"/>

            <div className="flex items-end justify-between flex-wrap gap-5">
                <Description
                    title={t("Бошланғич тўлов")}
                    className="flex-grow"
                    content={
                        <Input
                            placeholder={"0"}
                            scale={1.2}
                            width={"100%"}
                            {...register("paymentSum")}
                        />
                    }
                />

                <Controller
                    control={control}
                    name="paymentPeriod"
                    render={({field}) => {
                        return (
                            <Description
                                title={t("Давр")}
                                content={
                                    <Segmented
                                        {...field}
                                        size="large"
                                        options={[
                                            {label: t("4 Ой"), value: 4},
                                            {label: t("6 Ой"), value: 6},
                                            {label: t("9 Ой"), value: 9},
                                            {label: t("12 Ой"), value: 12},
                                        ]}
                                    />
                                }
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="paymentDayOfMonth"
                    render={({field}) => {
                        return (
                            <Description
                                title={t("Ойлик тўлов муддати")}
                                content={
                                    <Segmented
                                        {...field}
                                        size="large"
                                        options={[
                                            {label: <div className="w-20">1</div>, value: 1},
                                            {label: <div className="w-20">10</div>, value: 10},
                                            {label: <div className="w-20">20</div>, value: 20},
                                        ]}
                                    />
                                }
                            />
                        );
                    }}
                />
                <TotalContractedSum control={control}/>
            </div>

            <div className="h-[40px]"/>

            <div className="flex items-center justify-end w-full">
                <Button
                    onClick={handleSubmit(onSubmit)}
                    type="primary"
                    size="large"
                    className="!w-full flex items-center justify-center"
                >
                    {t("Шартномани олиш")}{" "}
                    <ArrowRight strokeWidth={1.5} className="!ml-2 !h-5"/>
                </Button>
            </div>
        </>
    );
}

export default Formalization;
