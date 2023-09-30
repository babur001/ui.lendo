import { Input, Select, Text } from "@geist-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";
import { Button } from "antd";
import { IUserInfo, useBuyerStore } from "@/stores/buyer";
import { useMutation } from "@tanstack/react-query";
import { req } from "@/services/api";
import { find } from "lodash";

interface IProps {
  onFinish: () => unknown;
}

function Info({ onFinish }: IProps) {
  const { user, userInfo, setUserInfo } = useBuyerStore((store) => ({
    user: store.user,
    userInfo: store.userInfo,
    setUserInfo: store.setUserInfo,
  }));

  const { register, handleSubmit, control } = useForm<IUserInfo>({
    defaultValues: userInfo ? userInfo : {},
  });

  const mutateAddUserInfo = useMutation({
    mutationKey: [""],
    mutationFn: (
      userInfoParams: IUserInfo & {
        livingAddress: string;
        country: string;
        regionName: string;
        districtName: string;
        clientPinfl: string;
      }
    ) => {
      return req({
        method: "POST",
        url: `/registration/create-profile`,
        data: {
          ...userInfoParams,
        },
      });
    },
  });

  const onSubmit = async (values: IUserInfo) => {
    try {
      const res = mutateAddUserInfo.mutateAsync({
        ...values,
        livingAddress: values.homeNumber,
        country: "UZBEKISTAN",
        regionName:
          find(regions, (region) => {
            return region.CODE === values.regionCode;
          })?.NAME_UZ ?? "",
        districtName:
          find(tumans, (tuman) => {
            return tuman.DISTRICT_CODE === values.district_code;
          })?.NAME_UZ ?? "",
        clientPinfl: String(user?.pinfl ?? ""),
      });

      setUserInfo(values);
      onFinish();
    } catch (error) {}
  };

  return (
    <>
      <Text h3>2. Ҳаридор маълумотлари</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 w-full">
          <>
            <Text h4 my={0}>
              Телефон рақамлари
            </Text>

            <Input
              label="+998"
              placeholder="..."
              className="!w-full"
              {...register("phone")}
            >
              Телефон рақам*
            </Input>
            <Input
              label="+998"
              placeholder="..."
              className="!w-full"
              {...register("phone2")}
            >
              Телефон рақам №2*
            </Input>
          </>

          <>
            <Text h4 my={0}>
              Банк маълумотлари
            </Text>

            <div className="flex items-center justify-between !w-full !gap-3">
              <Input
                className="!w-full"
                placeholder="0000 0000 0000 0000"
                {...register("card")}
              >
                Банк карта рақами*
              </Input>

              <Input placeholder="mm/yy" {...register("card_date")}>
                Амал қилиш муддати*
              </Input>
            </div>
          </>

          <>
            <Text h4 my={0}>
              Манзили
            </Text>

            <Controller
              control={control}
              name="regionCode"
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Вилоят"
                    {...field}
                    defaultValue={field.value}
                  >
                    {regions.map((region, idx) => {
                      return (
                        <Select.Option key={idx} value={region.CODE}>
                          {region.NAME_UZ}
                        </Select.Option>
                      );
                    })}
                  </Select>
                );
              }}
            />

            <Controller
              control={control}
              name="district_code"
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Туман"
                    {...field}
                    defaultValue={field.value}
                  >
                    {tumans.map((tuman, idx) => {
                      return (
                        <Select.Option key={idx} value={tuman.DISTRICT_CODE}>
                          {tuman.NAME_UZ}
                        </Select.Option>
                      );
                    })}
                  </Select>
                );
              }}
            />

            <Input className="!w-full" {...register("neighborhood")}>
              Махалла номи*
            </Input>
            <Input className="!w-full" {...register("street")}>
              Кўча номи*
            </Input>
            <Input className="!w-full" {...register("homeNumber")}>
              Уй ва хонодон рақами*
            </Input>

            <Button type="primary" block htmlType="submit">
              Сақлаш
            </Button>

            <div className="h-[15px]" />
          </>
        </div>
      </form>
    </>
  );
}

export default Info;
