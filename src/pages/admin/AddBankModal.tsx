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

interface IBank {
  bankName: string | number;
  bankTin: string | number;
  bankShare: string | number;
  bankInsurance: string | number;
  operatorShare: string | number;
}

function AddBankModal({ onAdd }: IProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm<IBank>();

  const mutateAddCompany = useMutation({
    mutationKey: ["mutateAddCompany"],
    mutationFn: (companyForm: IBank) => {
      return req({
        method: "POST",
        url: `/admin/create-bank`,
        data: {
          ...companyForm,
          companyId: 1,
          salePointId: 1,
          role: ["SUPER_ADMIN"],
        },
      });
    },
  });

  const onSubmit = async (values: IBank) => {
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

      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        title={t("Korxona qo'shish")}
        footer={false}
      >
        <div className="h-[20px]" />
        <div className="flex flex-col gap-5">
          <div className="col-span-2">
            <Description
              title={t("bankTin")}
              content={
                <Controller
                  control={control}
                  name="bankTin"
                  render={({ field }) => {
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
            <Input placeholder="..." width={"100%"} {...register("bankName")}>
              {t("bankName")}
            </Input>
          </div>
          <div className="col-span-2">
            <Input placeholder="..." width={"100%"} {...register("bankShare")}>
              {t("bankShare")}
            </Input>
          </div>
          <div className="col-span-2">
            <Input
              placeholder="..."
              width={"100%"}
              {...register("bankInsurance")}
            >
              {t("bankInsurance")}
            </Input>
          </div>
          <div className="col-span-2">
            <Input
              placeholder="..."
              width={"100%"}
              {...register("operatorShare")}
            >
              {t("operatorShare")}
            </Input>
          </div>
          <div className="h-[20px]" />
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

export default AddBankModal;
