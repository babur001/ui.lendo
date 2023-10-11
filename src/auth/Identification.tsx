import MyIdAuth from "@/auth/MyIdAuth";
import {req} from "@/services/api";
import {IBuyer, Store, useBuyerStore} from "@/stores/buyer";
import {Description, Input, Tabs, Text} from "@geist-ui/core";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {Button, Image} from "antd";
import clsx from "clsx";
import {get} from "lodash";
import {ArrowRight} from "lucide-react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useTranslation} from "react-i18next";

const authManual = z.object({
    pinfl: z
        .string()
        .length(14, {message: "PINFL должен состоять из 14 символов."}),
});

interface IProps {
    onFinish: () => unknown;
}

export const baseUrl = `https://mp-api.techstack.uz/mp-client-api`;

interface IIdentificationForm {
    pinfl: string;
}

function Identification({onFinish}: IProps) {
    const {t, i18n} = useTranslation();
    const {user, setUser} = useBuyerStore((store) => ({
        user: store.user,
        setUser: store.setUser,
    }));

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IIdentificationForm>({
        resolver: zodResolver(authManual),
    });

    const mutateUser = useMutation({
        mutationKey: ["queryUser"],
        mutationFn: (pinflParam: string) => {
            return req({
                method: "GET",
                url: `/registration/get-client-info`,
                params: {
                    pinfl: pinflParam,
                },
            });
        },
    });

    const mutateSetUser = useMutation({
        mutationKey: ["mutateSetUser"],
        mutationFn: (userParam: Store["user"]) => {
            return req({
                method: "POST",
                url: `/registration/set-client-info`,
                data: userParam,
            });
        },
    });

    const onSubmit = async (values: IIdentificationForm) => {
        try {
            const res = await mutateUser.mutateAsync(values.pinfl);

            const user = get(res, "data.data", null) as IBuyer;

            if (user) {
                setUser(user);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const errorMessages = {
        pinfl: get(errors, "pinfl.message", null),
    };

    const userData = [
        {title: t("ЖИШШР"), value: get(user, "pinfl", "-")},
        {title: t("Фамилия"), value: get(user, "firstName", "-")},
        {title: t("Исми"), value: get(user, "lastName", "-")},
        {title: t("Шарифи"), value: get(user, "middleName", "-")},
        {title: t("Паспорт серияси"), value: get(user, "passportSerial", "-")},
        {title: t("Паспорт рақами"), value: get(user, "passportNumber", "-")},
        {title: t("Ким томонидан берилган"), value: get(user, "", "-")},
        {title: t("Жинси"), value: get(user, "gender", "-")},
        {title: t("Миллати"), value: get(user, "citizenship", "-")},
    ];

    const onNext = async () => {
        try {
            if (user) {
                const {createdAt, updatedAt, ...restUser} = user;

                const res = await mutateSetUser.mutateAsync(restUser);

                onFinish();
            }
        } catch (error) {
        }
    };

    return (
        <>
            {user ? (
                <>
                    <Text h3>1. {t("Шахсга доир маълумотлар")}</Text>

                    <div className="h-[15px]"/>

                    <Image
                        src="https://cdn.pixabay.com/photo/2021/04/25/14/30/man-6206540_960_720.jpg"
                        alt="man_image"
                        width={192}
                        height={192}
                        className="rounded-lg object-contain"
                    />

                    <div className="h-[35px]"/>

                    <div className="grid grid-cols-3 gap-5">
                        {userData.map((data, idx) => {
                            return <Description title={data.title} content={data.value}/>;
                        })}
                    </div>

                    <div className="h-[35px]"/>

                    <Button
                        onClick={onNext}
                        type="primary"
                        size="large"
                        className="flex items-center !gap-2 w-full justify-center"
                        loading={mutateSetUser.status === "loading"}
                    >
                        {t("Ҳаридор маълумотлари")}{" "}
                        <ArrowRight strokeWidth={1.5} className="!h-5"/>
                    </Button>
                </>
            ) : (
                <>
                    <Text h3>Идентификация</Text>

                    <Tabs initialValue="2">
                        <div className="h-[15px]"/>

                        {/* Manual */}
                        {
                            /* шу жойи коммент эди*/
                            <Tabs.Item label="Вручную" value="1">
                                <div className="flex flex-col gap-5 !w-96">
                                    <form
                                        className="flex flex-col gap-5"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <Input
                                            placeholder="..."
                                            className="!w-full"
                                            type={errorMessages.pinfl ? "error" : "default"}
                                            {...register("pinfl")}

                                        >
                                            <div className="flex items-center justify-between">
                                                <span>ПИНФЛ*</span>
                                                <span
                                                    className={clsx({
                                                        "text-[#c50000]": true,
                                                        hidden: !errorMessages.pinfl,
                                                    })}
                                                >
                         {errorMessages.pinfl}
                       </span>
                                            </div>
                                        </Input>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={mutateUser.status === "loading"}
                                        >
                                            {t("Рўйхатдан ўтказиш")}
                                        </Button>
                                    </form>
                                </div>
                            </Tabs.Item>   // */шу жойни олдим
                        }

                        {/* MyID realize */}
                        <Tabs.Item label="MyID" value="2">
                            <MyIdAuth/>
                        </Tabs.Item>
                    </Tabs>
                </>
            )}
        </>
    );
}

export default Identification;
