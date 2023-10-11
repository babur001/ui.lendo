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
  dokon_nomi: string;
  dokon_joylashgan_viloyat: string;
  tuman: string;
  manzil: string;
  //
  // id?: number | string;
  // latitude?: number | string;
  // longitude?: number | string;
  // name?: number | string;
  // regionName?: number | string;
  // regionCode?: 0;
  // districtName?: number | string;
  // districtCode?: 0;
  // user?: {
  //   fullName?: number | string;
  //   username?: number | string;
  //   manzil?: number | string;
  //   phone?: number | string;
  //   companyId?: 0;
  //   salePointId?: 0;
  //   role?: ["SUPER_ADMIN"];
  //   pinfl?: 0;
  // };
}

function AddSalePointModal({}: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm<ICompanyForm>();

  const forms: {
    title: React.ReactNode;
    name: keyof ICompanyForm;
    format?: string;
  }[] = [
    {
      title: t("Do'kon nomi"),
      name: "dokon_nomi",
    },
    {
      title: t("Do'kon joylashgan viloyat"),
      name: "dokon_joylashgan_viloyat",
    },
    {
      title: t("Do'kon joylashgan tuman"),
      name: "tuman",
    },
    {
      title: t("Do'kon joylashgan manzil"),
      name: "manzil",
    },
  ];

  const mutateAddSalePoint = useMutation({
    mutationFn: (data: ICompanyForm) => {
      return req({
        method: "POST",
        url: `/company-admin/save-sale-point`,
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
    const res = await mutateAddSalePoint.mutateAsync(data);
    const success = get(res, "data.success", false);
    if (!success) {
      message.error(t(`Kutilmagan xatolik!`));
    }
  };

  return (
    <>
      <Button size="large" onClick={() => setIsOpen(true)} type="primary">
        {t("Qo'shish")}
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
            loading={mutateAddSalePoint.status === "loading"}
          >
            {t("Qo'shish")}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AddSalePointModal;
