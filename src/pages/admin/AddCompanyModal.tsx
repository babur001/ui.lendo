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
  stir: string | number;
  company_name: string | number;
  admin_stir: string | number;
  admin_name: string | number;
  admin_phone: string | number;
  login: string | number;
  password: string | number;
}

function AddCompanyModal({}: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const { register, handleSubmit, control, watch } = useForm<ICompanyForm>();

  const forms: {
    title: React.ReactNode;
    name: keyof ICompanyForm;
    format: string;
  }[] = [
    {
      title: t("Korxona STIRi"),
      name: "stir",
      format: "###############",
    },
    {
      title: t("Korxona nomi"),
      name: "company_name",
      format: "",
    },
    {
      title: t("Adminstrator JShShIRi"),
      name: "admin_stir",
      format: "",
    },
    {
      title: t("Adminstrator FISh"),
      name: "admin_name",
      format: "",
    },
    {
      title: t("Telefon nomer"),
      name: "admin_phone",
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
    },
  ];

  const mutateAddCompany = useMutation({
    mutationFn: (data: ICompanyForm) => {
      return req({
        method: "POST",
        url: ``,
        data: data,
      });
    },
  });

  const onSubmit = (values: ICompanyForm) => {
    console.log(values);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} type="primary">
        Qo'shish
      </Button>

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
            Qo'shish
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddCompanyModal;
