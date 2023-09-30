import { Button, Input, Select, Text } from "@geist-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import regions from "@/data/ns10.json";
import tumans from "@/data/ns11.json";

interface IProps {
  onFinish: () => unknown;
}

function Info({ onFinish }: IProps) {
  // const { register } = useForm({
  //   resolver: zodResolver(userInfoSchema),
  // });

  console.log(regions);

  return (
    <>
      <Text h3>2. Ҳаридор маълумотлари</Text>

      <div className="flex flex-col gap-5 w-full">
        <>
          <Text h4 my={0}>
            Телефон рақамлари
          </Text>

          <Input label="+998" placeholder="..." className="!w-full">
            Телефон рақам*
          </Input>
          <Input label="+998" placeholder="..." className="!w-full">
            Телефон рақам №2*
          </Input>
        </>

        <>
          <Text h4 my={0}>
            Банк маълумотлари
          </Text>

          <div className="flex items-center justify-between !w-full !gap-3">
            <Input className="!w-full" placeholder="0000 0000 0000 0000">
              Банк карта рақами*
            </Input>

            <Input placeholder="mm/yy">Амал қилиш муддати*</Input>
          </div>
        </>

        <>
          <Text h4 my={0}>
            Манзили
          </Text>

          {/* <Select placeholder="Uzbekistan" disabled /> */}

          <Select placeholder="Вилоят">
            {regions.map((region, idx) => {
              return (
                <Select.Option value={region.CODE}>
                  {region.NAME_UZ}
                </Select.Option>
              );
            })}
          </Select>

          <Select placeholder="Туман">
            {tumans.map((tuman, idx) => {
              return (
                <Select.Option value={tuman.CODE}>
                  {tuman.NAME_UZ}
                </Select.Option>
              );
            })}
          </Select>

          <Input className="!w-full">Махалла номи*</Input>
          <Input className="!w-full">Кўча номи*</Input>
          <Input className="!w-full">Уй ва хонодон рақами*</Input>

          <Button
            onClick={onFinish}
            type="success-light"
            width={`100%`}
            // iconRight={<ArrowRight strokeWidth={1.5} />}
          >
            Сақлаш
          </Button>

          <div className="h-[15px]" />
        </>
      </div>
    </>
  );
}

export default Info;
