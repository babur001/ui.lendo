import { Button, Input, Select, Text } from "@geist-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  onFinish: () => unknown;
}

function Info({ onFinish }: IProps) {
  // const { register } = useForm({
  //   resolver: zodResolver(userInfoSchema),
  // });

  return (
    <>
      <Text h3>2. Ҳаридор маълумотлари</Text>

      <div className="flex flex-col gap-5 w-2/5">
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
            Телефон рақамлари
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

          <Select placeholder="Uzbekistan">
            <Select.Option value="1">Option 1</Select.Option>
            <Select.Option value="2">Option 2</Select.Option>
          </Select>

          <Select placeholder="TOSHKENT VILOYATI">
            <Select.Option value="1">Option 1</Select.Option>
            <Select.Option value="2">Option 2</Select.Option>
          </Select>

          <Select placeholder="TOSHKENT TUMANI">
            <Select.Option value="1">Option 1</Select.Option>
            <Select.Option value="2">Option 2</Select.Option>
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
