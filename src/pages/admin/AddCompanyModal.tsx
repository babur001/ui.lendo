import { Description, Input, Text } from "@geist-ui/core";
import { Controller, useForm } from "react-hook-form";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";
import { Button, Modal, Select, message } from "antd";
import { IUserInfo, useBuyerStore } from "@/stores/buyer";
import { useMutation } from "@tanstack/react-query";
import { req } from "@/services/api";
import { find, get } from "lodash";
import { PatternFormat } from "react-number-format";
import { Input as AntdInput } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

function AddCompanyModal({ onAdd }: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm<ICompanyForm>();

  const forms: {
    title: React.ReactNode;
    name:
      | Exclude<keyof ICompanyForm, "user">
      | `user.${keyof ICompanyForm["user"]}`;
  }[] = [
    {
      title: t("Korxona STIRi"),
      name: "tin",
    },
    {
      title: t("Korxona nomi"),
      name: "name",
    },
    {
      title: t("BrandName"),
      name: "brandName",
    },
    {
      title: t("DirectorName"),
      name: "directorName",
    },
    {
      title: t("Contact"),
      name: "contact",
    },
    {
      title: t("Address dokon"),
      name: "address",
    },
    {
      title: t("Adminstrator JShShIRi"),
      name: "user.pinfl",
    },
    {
      title: t("Adminstrator FISh"),
      name: "user.fullName",
    },
    {
      title: t("Adminstrator telefon nomeri"),
      name: "user.phone",
    },
    {
      title: t("Login"),
      name: "user.username",
    },
    {
      title: t("Parol"),
      name: "user.password",
    },
  ];

  const mutateAddCompany = useMutation({
    mutationKey: ["mutateAddCompany"],
    mutationFn: (companyForm: ICompanyForm) => {
      return req({
        method: "POST",
        url: `/admin/create-company`,
        data: {
          ...companyForm,
        },
      });
    },
  });

  const onSubmit = async (values: ICompanyForm) => {
    console.log(values);

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
        {t("Qo'shish")}
      </Button>
      <div className="h-[15px]" />

      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        title={t("Korxona qo'shish")}
        footer={false}
      >
        <div className="h-[20px]" />
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
                    render={({ field }) => {
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
