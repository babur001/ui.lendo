import { Input, Text } from "@geist-ui/core";
import { Button } from "antd";
import { useState } from "react";

interface IProps {
  onFinish: () => unknown;
}

function Approval({ onFinish }: IProps) {
  const [isSMS, setIsSMS] = useState(false);

  return (
    <>
      <Text h3>5. Approval</Text>

      <div className="h-[10px]" />

      <div className="!w-1/2">
        {isSMS ? (
          <>
            <Text p font={0.8}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
              velit.
            </Text>

            <Input className="!w-full" width={`100%`} placeholder="6 qator son">
              SMS kod
            </Input>

            <div className="h-[20px]" />

            <Button onClick={onFinish} type="primary" block>
              Tasdiqlash
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between !gap-5">
              <Input
                className="!w-full"
                width={`100%`}
                placeholder="0000 0000 0000 0000"
              >
                Банк карта рақами*
              </Input>
              <Input className="!w-full" placeholder="mm/yy">
                Амал қилиш муддати*
              </Input>
            </div>

            <Text mb={1.3} p font={0.8}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis ab eaque ullam ad commodi, dolor deserunt error ex
              maxime sequi!
            </Text>

            <Button onClick={() => setIsSMS(true)} type="primary" block>
              SMS kod olish
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default Approval;
