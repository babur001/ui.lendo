import { Description, Input, Text } from "@geist-ui/core";
import { Controller, useForm } from "react-hook-form";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";
import { Button, Select, message } from "antd";
import { IUserInfo, useBuyerStore } from "@/stores/buyer";
import { useMutation } from "@tanstack/react-query";
import { req } from "@/services/api";
import { find, get } from "lodash";
import { PatternFormat } from "react-number-format";
import { Input as AntdInput } from "antd";

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

  const { register, handleSubmit, control, watch } = useForm<IUserInfo>({
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

            <Description
              title="Телефон рақам №1*"
              content={
                <Controller
                  control={control}
                  name="phone1"
                  render={({ field }) => {
                    return (
                      <PatternFormat
                        format="## ### ## ##"
                        mask={" "}
                        customInput={AntdInput}
                        addonBefore="+998"
                        {...field}
                      />
                    );
                  }}
                />
              }
            />

            <Description
              title="Телефон рақам №2*"
              content={
                <Controller
                  control={control}
                  name="phone2"
                  render={({ field }) => {
                    return (
                      <PatternFormat
                        format="## ### ## ##"
                        mask={" "}
                        customInput={AntdInput}
                        addonBefore="+998"
                        {...field}
                      />
                    );
                  }}
                />
              }
            />
          </>

          <>
            <Text h4 my={0}>
              Банк маълумотлари
            </Text>

            <div className="flex items-center !w-full !gap-3">
              <Description
                title="Банк карта рақами*"
                className="!w-1/2"
                content={
                  <Controller
                    control={control}
                    name="card"
                    render={({ field }) => {
                      return (
                        <PatternFormat
                          format="#### #### #### ####"
                          mask={" "}
                          customInput={AntdInput}
                          className="!w-full"
                          size="middle"
                          {...field}
                        />
                      );
                    }}
                  />
                }
              />

              <Description
                title="Амал қилиш муддати*"
                className="!w-1/2"
                content={
                  <Controller
                    control={control}
                    name="card_date"
                    render={({ field }) => {
                      return (
                        <PatternFormat
                          format="##/##"
                          mask={" "}
                          customInput={AntdInput}
                          className="!w-full"
                          size="middle"
                          {...field}
                        />
                      );
                    }}
                  />
                }
              />
            </div>
          </>

          <>
            <Text h4 my={0}>
              Манзили
            </Text>

            <div className="flex items-center !gap-3">
              <Controller
                control={control}
                name="regionCode"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="Вилоят"
                      className="!w-1/2"
                      defaultValue={field.value}
                      options={regions.map((region, idx) => {
                        return {
                          value: region.CODE,
                          label: region.NAME_UZ,
                        };
                      })}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="district_code"
                render={({ field }) => {
                  const selectedRegionCode = watch("regionCode");

                  const tumansOptions = tumans
                    .filter((tuman) => {
                      return tuman.NS10_CODE === selectedRegionCode;
                    })
                    .map((tuman) => {
                      return {
                        value: tuman.DISTRICT_CODE,
                        label: tuman.NAME_UZ,
                      };
                    });

                  return (
                    <Select
                      className="!w-1/2"
                      placeholder="Туман"
                      defaultValue={field.value}
                      options={tumansOptions}
                      disabled={!selectedRegionCode}
                      {...field}
                    />
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <Input className="!w-full" {...register("neighborhood")}>
                Махалла номи*
              </Input>
              <Input className="!w-full" {...register("street")}>
                Кўча номи*
              </Input>
              <Input className="!w-full" {...register("homeNumber")}>
                Уй ва хонодон рақами*
              </Input>
            </div>

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
