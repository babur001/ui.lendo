import { Button, Modal, Text } from "@geist-ui/core";
import { Alert } from "antd";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

interface IProps {
  onFinish: () => unknown;
}

function Identification({ onFinish }: IProps) {
  const [state, setState] = useState(false);

  return (
    <>
      <Text h3>1. Identifikatsiya</Text>

      <Alert
        message="Identifikatysiyadan o'tish uchun o'ngdagi tugmani bosing."
        type="info"
        showIcon
      />

      <div className="h-[10px]" />

      <Modal visible={state} onClose={() => setState(false)}>
        <Modal.Title>Lorem, ipsum.</Modal.Title>
        <Modal.Content>
          <Text className="space-y-2">
            <p className="my-0 text-sm">
              1. Lorem ipsum dolor sit amet consectetur
            </p>
            <p className="my-0 text-sm">
              2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis,
              corrupti.
            </p>
            <p className="my-0 text-sm">
              3. Lorem ipsum dolor sit amet consectetur
            </p>
          </Text>

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png"
            alt="shtrix"
            className="mx-auto h-56"
          />

          <div className="h-[20px]" />

          <Button
            onClick={() => {
              setState(false);

              setTimeout(() => {
                onFinish();
              }, 20);
            }}
            width={`100%`}
            iconRight={<ArrowRight strokeWidth={1.5} />}
          >
            Keyingisi
          </Button>
        </Modal.Content>
      </Modal>

      <Button onClick={() => setState(true)} type="success-light">
        Identifikatysiyadan o'tish
      </Button>
    </>
  );
}

export default Identification;
