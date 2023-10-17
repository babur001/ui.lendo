import {req} from "@/services/api";
import {Description, Divider, Input, Text} from "@geist-ui/core";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Button, Modal, message, Select, Input as AntdInput} from "antd";
import {get} from "lodash";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {PatternFormat} from "react-number-format";
import {LockOutlined} from "@ant-design/icons";

interface ISellerForm {
    fullName: string;
    username: string;
    password: string;
    phone: string;
    companyId: string;
    salePointId: string;
    role: [string];
    pinfl: string;
    managerId: string;
    fileGuid: string;
}

interface IProps {
    onAdd: () => unknown;
}

function AddCompanyUsersModal({onAdd}: IProps) {
    const {t, i18n} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);


    const {control, register, handleSubmit} = useForm<ISellerForm>({
        defaultValues: {role: ["COMPANY_EMPLOYEE"]},
    });


    const mutateAddSeller = useMutation({
        mutationFn: (data: ISellerForm) => {
            return req({
                method: "POST",
                url: `/auth/register`,
                data: data,
            });
        },
    });

    const onSubmit = async (values: ISellerForm) => {
        if (!values) {
            return message.error(t(`Маълумотлар топилмади`));
        }

        const data = {
            ...values,
            fileGuid: "1",
            companyId: "1"
        };

        const res = await mutateAddSeller.mutateAsync(data);
        const success = get(res, "data.success", false);
        if (!success) {
            message.error(t(`Kutilmagan xatolik!`));
        } else {
            message.success(t(`Qoshildi`));
            onAdd && onAdd();
            setIsOpen(false);
        }
    };
    return (
        <>
            <Button size="large" onClick={() => setIsOpen(true)} type="primary">
                {t("admin xodim qoshish")}
            </Button>

            <Modal
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                title={t("admin xodim qoshish")}
                footer={false}
            >
                <div className="h-[20px]"/>
                <div className="flex flex-col gap-5">
                    <div className="col-span-2">
                        <Controller
                            control={control}
                            name={"role"}
                            render={({field}) => {
                                return (
                                    <Description
                                        title={t("Role")}
                                        content={
                                            <Select
                                                className={"w-[100%]"}
                                                {...field}
                                                size="large"
                                                options={[
                                                    {label: t("Администратор магазина"), value: ["COMPANY_EMPLOYEE"]},
                                                    {label: t("Продавец"), value: ["COMPANY_EMPLOYEE"]},
                                                    {label: t("Бухгалтер"), value: ["COMPANY_EMPLOYEE"]},
                                                    {label: t("Менеджер"), value: ["COMPANY_EMPLOYEE"]}
                                                ]}
                                            />
                                        }
                                    />
                                );
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <Controller
                            control={control}
                            name={"managerId"}
                            render={({field}) => {
                                return (
                                    <Description
                                        title={t("Менеджер")}
                                        content={
                                            <Select
                                                className={"w-[100%]"}
                                                {...field}
                                                size="large"
                                                options={[
                                                    {label: t("Менеджер1"), value: 1},
                                                    {label: t("Менеджер2"), value: 2},
                                                    {label: t("Менеджер3"), value: 3},
                                                    {label: t("Менеджер4"), value: 4}
                                                ]}
                                            />
                                        }
                                    />
                                );
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("ЖИШШР")}
                            content={
                                <Controller
                                    control={control}
                                    name="pinfl"
                                    render={({field}) => {
                                        return (
                                            <PatternFormat
                                                placeholder="..."
                                                format="##############"
                                                mask={" "}
                                                customInput={AntdInput}
                                                {...field}
                                            />
                                        );
                                    }}
                                />
                            }
                        />
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Xodim nomi")}
                            content={
                                <Input placeholder="..."
                                       width={"100%"} {...register("fullName")}/>
                            }
                        />
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Login")}
                            content={
                                <Input
                                    placeholder="..."
                                    width={"100%"}
                                    {...register("username" as const)}
                                />
                            }
                        />
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Пароль")}
                            content={
                                <Input placeholder="..."
                                       width={"100%"} {...register("password")}/>

                            }
                        />
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("xodim tel raqami")}
                            content={
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({field}) => {
                                        return (
                                            <PatternFormat
                                                format="## ### ## ##"
                                                mask={" "}
                                                placeholder="..."
                                                customInput={AntdInput}
                                                addonBefore="+998"
                                                {...field}
                                            />
                                        );
                                    }}
                                />
                            }
                        />
                    </div>
                    <div className="col-span-1">
                        <Controller
                            control={control}
                            name={"salePointId"}
                            render={({field}) => {
                                return (
                                    <Description
                                        title={t("Do'kon nomi")}
                                        content={
                                            <Select
                                                className={"w-[100%]"}
                                                {...field}
                                                size="large"
                                                options={[
                                                    {label: t("Дукон1"), value: 1},
                                                    {label: t("Дукон2"), value: 2}
                                                ]}
                                            />
                                        }
                                    />
                                );
                            }}
                        />
                    </div>

                    <div className="col-span-2">
                        <Input disabled={true} defaultValue={"1"}
                               width={"100%"} {...register("fileGuid")}>
                            {t("fileGuid")}
                        </Input>
                    </div>
                    <div className="h-[20px]"/>
                    <Button
                        type="primary"
                        onClick={handleSubmit(onSubmit)}
                        loading={mutateAddSeller.status === "loading"}
                    >
                        {t("Qo'shish")}
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default AddCompanyUsersModal;
