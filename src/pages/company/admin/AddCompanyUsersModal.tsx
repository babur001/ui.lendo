import {req} from "@/services/api.ts";
import {Description, Divider, Input, Text} from "@geist-ui/core";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Button, Modal, message, Select, Input as AntdInput} from "antd";
import {get} from "lodash";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {PatternFormat} from "react-number-format";
import useAuthUser from "@/auth/useAuthUser.tsx";
import {ICompany} from "@/pages/company/admin/SalePointList.tsx";
import {render} from "react-dom";


interface ISellerForm {
    fullName: string;
    username: string;
    password: string;
    phone: string;
    companyId: string;
    salePointId: string;
    role: any;
    pinfl: string;
    managerId: string;
    fileGuid: string;
}

interface IProps {
    onAdd: () => unknown;
}

interface ICompanyUsers {
    id: string | number;
    fullName: string;
    roles: string[];
}

function AddCompanyUsersModal({onAdd}: IProps) {
    const {t, i18n} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const {control, register, handleSubmit, watch} = useForm<ISellerForm>({});
    const user = useAuthUser();
    const companyId = get(user, "data.data.data.companyId", null);

    const mutateAddSeller = useMutation({
        mutationFn: (data: ISellerForm) => {
            return req({
                method: "POST",
                url: `/auth/register`,
                data: data
            });
        },
    });

    const queryCompanyUsers = useQuery({
        queryKey: ["queryCompanies"],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/auth/get-users-list`,
                params: {
                    "companyId": companyId,
                },
            });
        },
    });
    const UsersListData = get(queryCompanyUsers, "data.data.data.content", []) as ICompanyUsers[];

    const querySalePoints = useQuery({
        queryKey: ["querySalePoints", companyId],
        queryFn: () => {
            return req({
                method: "GET",
                url: `/company-admin/get-sale-points`,
                params: {
                    companyId: companyId,
                    page: 0,
                    size: 20,
                },
            });
        },
    });
    const salePointData = get(querySalePoints, "data.data.data.content", []) as ICompany[];


    const onSubmit = async (values: ISellerForm) => {
        if (!values) {
            return message.error(t(`Маълумотлар топилмади`));
        }

        const data = {
            ...values,
            fileGuid: "1",
            companyId: companyId,
            role: [values.role]
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
                                                    {label: t("Администратор магазина"), value: "SALE_POINT_ADMIN"},
                                                    {label: t("Продавец"), value: "COMPANY_EMPLOYEE"},
                                                    {label: t("Бухгалтер"), value: "COMPANY_ACCOUNTANT"},
                                                    {label: t("Менеджер"), value: "COMPANY_MANAGER"}
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
                                const selectedRoleCode = watch("role");
                                return (
                                    <Description
                                        title={t("Менеджер")}
                                        content={
                                            <Select
                                                className={"w-[100%]"}
                                                {...field}
                                                size="large"
                                                defaultValue={field.value}
                                                disabled={selectedRoleCode != "COMPANY_EMPLOYEE"}
                                                options={UsersListData.map((user, idx) => {
                                                    return {
                                                        value: user.id,
                                                        label: user.fullName,
                                                    };
                                                })}
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
                                                defaultValue={field.value}
                                                options={salePointData.map((salePoint, idx) => {
                                                    return {
                                                        value: salePoint.id,
                                                        label: salePoint.name,
                                                    };
                                                })}
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
