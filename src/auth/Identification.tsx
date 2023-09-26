import { Input, Modal, Tabs, Text } from "@geist-ui/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, Upload, UploadProps, message } from "antd";
import axios from "axios";
import { ArrowRight, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface IProps {
  onFinish: () => unknown;
}

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: false,
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const base = `https://mp-api.techstack.uz/mp-client-api`;

export interface IUser {
  pinfl: number;
  firstName: string;
  lastName: string;
  middleName: string;
  passportSerial: string;
  passportNumber: string;
  passportGivenBy: string;
  gender: string;
  citizenship: string;
  createdAt: string;
  updatedAt?: null;
  profiles?: null[] | null;
}

interface IIdentificationForm {
  pinfl: string;
}

function Identification({ onFinish }: IProps) {
  const [state, setState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IIdentificationForm>();

  const mutateUser = useMutation({
    mutationKey: ["queryUser"],
    mutationFn: (pinflParam: string) => {
      return axios({
        method: "GET",
        url: `${base}/registration/get-client-info`,
        params: {
          pinfl: pinflParam,
        },
      });
    },
  });

  const onSubmit = async (values: IIdentificationForm) => {
    try {
      const res = await mutateUser.mutateAsync(values.pinfl);
    } catch (error) {}

    onFinish();
  };

  return (
    <>
      <Text h3>1. Идентификация</Text>

      <Tabs initialValue="1">
        <div className="h-[15px]" />

        {/* Manual */}
        <Tabs.Item label="Вручную" value="1">
          <div className="flex flex-col gap-5 !w-96">
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                placeholder="..."
                className="!w-full"
                {...register("pinfl")}
              >
                ПИНФЛ*
              </Input>

              {/* <Input label="+998" placeholder="..." className="!w-full">
          Номер телефона*
        </Input>

        <Dragger {...props} className="w-full">
          <Text p>
            <UploadCloud strokeWidth={1.5} />
          </Text>

          <Text p>Загрузите паспорт, щелкнув или перетащив файл.</Text>
        </Dragger> */}

              <Button
                type="primary"
                htmlType="submit"
                loading={mutateUser.status === "loading"}
              >
                Регистрация
              </Button>
            </form>
          </div>
        </Tabs.Item>

        {/* MyID realize */}
        <Tabs.Item label="MyID" value="2">
          <>
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
                    2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quis, corrupti.
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
                  // iconRight={<ArrowRight strokeWidth={1.5} />}
                >
                  Keyingisi
                </Button>
              </Modal.Content>
            </Modal>

            <Button onClick={() => setState(true)}>
              Identifikatysiyadan o'tish
            </Button>
          </>
        </Tabs.Item>
      </Tabs>
    </>
  );
}

export default Identification;
