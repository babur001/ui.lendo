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

interface ISellerForm {
  fullName: string;
  username: string;
  password: string;
  phone: string;
  companyId: string;
  salePointId: string;
  role: ["COMPANY_EMPLOYEE"];
  pinfl: string;
}

function AddSalePointSellerModal({ onAdd }: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm<ISellerForm>({
    defaultValues: { role: ["COMPANY_EMPLOYEE"] },
  });

  const forms: {
    title: React.ReactNode;
    name: keyof ISellerForm;
    format?: string;
  }[] = [
    {
      title: t("fullname"),
      name: "fullName",
    },
    {
      title: t("username"),
      name: "username",
    },
    {
      title: t("password"),
      name: "password",
    },
    {
      title: t("phone"),
      name: "phone",
    },
    {
      title: t("companyId"),
      name: "companyId",
    },
    {
      title: t("salePointId"),
      name: "salePointId",
    },
    {
      title: t("pinfl"),
      name: "pinfl",
    },
  ];

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
        Qo'shish
      </Button>

      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        title={t("Sotuvchi qoshish")}
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
            loading={mutateAddSeller.status === "loading"}
          >
            Qo'shish
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddSalePointSellerModal;
