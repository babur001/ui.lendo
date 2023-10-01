import { Input, Select, Text } from "@geist-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";
import { Button, message } from "antd";
import { IUserInfo, useBuyerStore } from "@/stores/buyer";
import { useMutation } from "@tanstack/react-query";
import { req } from "@/services/api";
import { find, get } from "lodash";

interface IProps {
  onFinish: () => unknown;
}

interface IAdditionApiParam {
  livingAddress: string;
  country: string;
  regionName: string;
  districtName: string;
  clientPinfl: string | number;
}

interface IScoringParams {
  cardNumber: string;
  cardExpiry: string;
  pinfl: string | number;
  loanAmount: string | number;
  applicationId: string | number;
}

function Info({ onFinish }: IProps) {
  const { user, userInfo, setUserInfo, setUniqueIds } = useBuyerStore(
    (store) => ({
      user: store.user,
      userInfo: store.userInfo,
      setUserInfo: store.setUserInfo,
      setUniqueIds: store.setUniqueIds,
    })
  );

  const { register, handleSubmit, control } = useForm<IUserInfo>({
    defaultValues: userInfo ? userInfo : {},
  });

  const mutateAddUserInfo = useMutation({
    mutationKey: ["mutateAddUserInfo"],
    mutationFn: (userInfoParams: IUserInfo & IAdditionApiParam) => {
      return req({
        method: "POST",
        url: `/registration/create-profile`,
        data: {
          ...userInfoParams,
        },
      });
    },
  });

  const mutateSendForScoring = useMutation({
    mutationKey: ["mutateSendForScoring"],
    mutationFn: (scoringParams: IScoringParams) => {
      return req({
        method: "POST",
        url: `/registration/check-scoring`,
        data: {
          ...scoringParams,
        },
      });
    },
  });

  const onSubmit = async (values: IUserInfo) => {
    try {
      const regionObj = find(regions, (region) => {
        return region.CODE === values.regionCode;
      });
      const tumanObj = find(tumans, (tuman) => {
        return tuman.DISTRICT_CODE === values.district_code;
      });

      const [resScoring, resUser] = await Promise.all([
        mutateSendForScoring.mutateAsync({
          cardNumber: values.card,
          cardExpiry: values.card_date,
          pinfl: get(user, "pinfl", ""),
          loanAmount: 0,
          applicationId: 0,
        }),
        mutateAddUserInfo.mutateAsync({
          ...values,
          livingAddress: values.homeNumber,
          country: "UZBEKISTAN",
          regionName: get(regionObj, "NAME_UZ", "-"),
          districtName: get(tumanObj, "NAME_UZ", "-"),
          clientPinfl: get(user, "pinfl", ""),
        }),
        ,
      ]);

      const scoringSuccess = get(resScoring, "data.success", false);
      const userSuccess = get(resUser, "data.success", false);

      const clientProfileId = get(resUser, "data.data.id", false);
      const clientScoringId = get(resScoring, "data.data.id", false);

      if (scoringSuccess && userSuccess) {
        setUserInfo(values);
        setUniqueIds({ clientProfileId, clientScoringId });

        onFinish();
      }

      if (!scoringSuccess || !userSuccess) {
        message.error("Xatolik yuz berdi!");
      }

      // @remove
      // onFinish();
    } catch (error) {
      message.error("Xatolik yuz berdi!");
    }
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
              {...register("phone1")}
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
