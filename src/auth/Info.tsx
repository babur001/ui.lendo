import { Button, Input, Select, Text } from "@geist-ui/core";

interface IProps {
  onFinish: () => unknown;
}

function Info({ onFinish }: IProps) {
  return (
    <>
      <Text h3>2. Ma'lumotlari</Text>

      <div className="flex flex-col gap-5 w-2/5">
        <>
          <Text h4 my={0}>
            Kontaktnie dannie
          </Text>

          <Input label="+998" placeholder="..." className="!w-full">
            Telefon raqam*
          </Input>
          <Input label="+998" placeholder="..." className="!w-full">
            Telefon raqam 2*
          </Input>
        </>

        <>
          <Text h4 my={0}>
            Kontaktnie dannie
          </Text>

          <div className="flex items-center justify-between !w-full !gap-5">
            <Input
              className="!w-full"
              width={`100%`}
              placeholder="0000 0000 0000 0000"
            >
              Nomer karti*
            </Input>
            <Input className="!w-full" placeholder="mm/yy">
              Srok deystviya*
            </Input>
          </div>
        </>

        <>
          <Text h4 my={0}>
            Adresnie dannie
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

          <Input className="!w-full">Maxalla*</Input>
          <Input className="!w-full">Ulica*</Input>
          <Input className="!w-full">Nomer doma/kvartiri*</Input>

          <Button
            onClick={onFinish}
            type="success-light"
            width={`100%`}
            // iconRight={<ArrowRight strokeWidth={1.5} />}
          >
            Saqlash
          </Button>

          <div className="h-[15px]" />
        </>
      </div>
    </>
  );
}

export default Info;
