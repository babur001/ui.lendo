import {Description, Input, Text} from "@geist-ui/core";
import {Controller, useForm} from "react-hook-form";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";
import {Button, Modal, Select, message} from "antd";
import {IUserInfo, useBuyerStore} from "@/stores/buyer";
import {useMutation} from "@tanstack/react-query";
import {req} from "@/services/api";
import {find, get} from "lodash";
import {PatternFormat} from "react-number-format";
import {Input as AntdInput} from "antd";
import {useTranslation} from "react-i18next";
import {useState} from "react";

interface IProps {
    onAdd?: () => unknown;
}

interface ICompanyForm {
    tin: string;
    name: string;
    address: string;
    brandName: string;
    directorName: string;
    contact: string;
    user: {
        pinfl: string;
        fullName: string;
        username: string;
        password: string;
        phone: string;
    };
}

function AddCompanyModal({onAdd}: IProps) {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const {register, handleSubmit, control, watch} = useForm<ICompanyForm>();

    const mutateAddCompany = useMutation({
        mutationKey: ["mutateAddCompany"],
        mutationFn: (companyForm: ICompanyForm) => {
            return req({
                method: "POST",
                url: `/admin/create-company`,
                data: {
                    ...companyForm,
                    "companyId": 1,
                    "salePointId": 1,
                    "role": ["SUPER_ADMIN"]
                },
            });
        },
    });

    const onSubmit = async (values: ICompanyForm) => {
         if (!values) {
            return message.error(t(`Маълумотлар топилмади`));
        }

        const res = await mutateAddCompany.mutateAsync(values);
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
            <Button onClick={() => setIsOpen(true)} type="primary">
                {t("Korxona qo'shish")}
            </Button>
            <div className="h-[15px]"/>

            <Modal
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                title={t("Korxona qo'shish")}
                footer={false}
            >
                <div className="h-[20px]"/>
                <div className="flex flex-col gap-5">
                    <div className="col-span-2">
                        <Description
                            title={t("Korxona STIRi")}
                            content={
                                <Controller
                                    control={control}
                                    name="tin"
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
                        <Input placeholder="..."
                               width={"100%"} {...register("name")}>
                            {t("Korxona nomi")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Input placeholder="..."
                               width={"100%"} {...register("brandName")}>
                            {t("BrandName")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Input placeholder="..."
                               width={"100%"} {...register("directorName")}>
                            {t("DirectorName")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Contact")}
                            content={
                                <Controller
                                    control={control}
                                    name="contact"
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
                    <div className="col-span-2">
                        <Input
                            placeholder="..."
                            width={"100%"}
                            {...register("address" as const)}
                        >
                            {t("Address company")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Main Adminstrator JShShIRi")}
                            content={
                                <Controller
                                    control={control}
                                    name="user.pinfl"
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
                        <Input
                            placeholder="..."
                            width={"100%"}
                            {...register("user.fullName" as const)}
                        >
                              {t("Main Adminstrator FISh")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Description
                            title={t("Main Adminstrator telefon nomeri")}
                            content={
                                <Controller
                                    control={control}
                                    name="user.phone"
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
                    <div className="col-span-2">
                        <Input
                            placeholder="..."
                            width={"100%"}
                            {...register("user.username" as const)}
                        >
                            {t("Login")}
                        </Input>
                    </div>
                    <div className="col-span-2">
                        <Input placeholder="..."
                               width={"100%"} {...register("user.password")}>
                            {t("Пароль")}
                        </Input>
                    </div>
                    <div className="h-[20px]"/>

                    <Button
                        type="primary"
                        onClick={handleSubmit(onSubmit)}
                        loading={mutateAddCompany.status === "loading"}
                    >
                        {t("Qo'shish")}
                    </Button>
                </div>


            </Modal>
        </>
    )
        ;
}

export default AddCompanyModal;
