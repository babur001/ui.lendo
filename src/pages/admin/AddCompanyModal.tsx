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
    tin: string | number;
    name: string | number;
    address: string | number;
    brandName: string | number;
    directorName: string | number;

}

interface ICompanyAdminForm {
    pinfl: string | number;
    fullName: string | number;
    phone: string | number;
    username: string | number;
    password: string | number;

}

function AddCompanyModal({}: IProps) {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const {register, handleSubmit, control, watch} = useForm<ICompanyForm>();

    const forms: {
        title: React.ReactNode;
        name: keyof ICompanyForm;
        format: string;
    }[] = [
        {
            title: t("Korxona STIRi"),
            name: "tin",
            format: "###############",
        },
        {
            title: t("Korxona nomi"),
            name: "name",
            format: "",
        },
        {
            title: t("Manzil"),
            name: "address",
            format: "",
        },
        {
            title: t("Brand nomi"),
            name: "brandName",
            format: "",
        },
        {
            title: t("Direktor"),
            name: "directorName",
            format: "",
        },

        /*{
            title: t("Admin pinfl"),
            name: "pinfl",
            format: "",
        }, {
            title: t("Admin fish"),
            name: "fullName",
            format: "",
        }, {
            title: t("Admin telefon raqam"),
            name: "phone",
            format: "",
        },
        {
            title: t("Login"),
            name: "login",
            format: "",
        },
        {
            title: t("Parol"),
            name: "password",
            format: "",
        },*/

    ];

    const mutateAddCompany = useMutation({
        mutationFn: (data: ICompanyForm) => {
            return req({
                method: "POST",
                url: `/admin/create-company`, //ШЕР
                data: data,
            });
        },
    });

    const onSubmit = async (values: ICompanyForm) => {
        if (!values) {
            return message.error(t(`Маълумотлар топилмади`));
        }
        const data = {
            ...values,
        };
        const res = await mutateAddCompany.mutateAsync(data);
        const success = get(res, "data.success", false);
        if (!success) {
            message.error(t(`Kutilmagan xatolik!`));
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} type="primary">
                {t("Qo'shish")}
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
                    {forms.map((form) => {
                        return (
                            <Description
                                title={form.title}
                                className="!w-full"
                                content={
                                    <Controller
                                        control={control}
                                        name={form.name}
                                        render={({field}) => {
                                            return (
                                                <AntdInput
                                                    className="!w-full"
                                                    size="middle"
                                                    {...field}
                                                />
                                            );
                                        }}
                                    />
                                }
                            />
                        );
                    })}

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
    );
}

export default AddCompanyModal;
