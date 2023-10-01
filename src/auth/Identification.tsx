import { req } from "@/services/api";
import { IBuyer, useBuyerStore } from "@/stores/buyer";
import { Description, Input, Modal, Tabs, Text } from "@geist-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Image, Upload, UploadProps, message } from "antd";
import axios from "axios";
import clsx from "clsx";
import { get } from "lodash";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const authManual = z.object({
  pinfl: z
    .string()
    .length(14, { message: "PINFL должен состоять из 14 символов." }),
});

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

export const baseUrl = `https://mp-api.techstack.uz/mp-client-api`;

interface IIdentificationForm {
  pinfl: string;
}

function Identification({ onFinish }: IProps) {
  const { user, setUser } = useBuyerStore((store) => ({
    user: store.user,
    setUser: store.setUser,
  }));
  const [state, setState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IIdentificationForm>({
    resolver: zodResolver(authManual),
  });

  const mutateUser = useMutation({
    mutationKey: ["queryUser"],
    mutationFn: (pinflParam: string) => {
      return req({
        method: "GET",
        url: `/registration/get-client-info`,
        params: {
          pinfl: pinflParam,
        },
      });
    },
  });

  const onSubmit = async (values: IIdentificationForm) => {
    try {
      const res = await mutateUser.mutateAsync(values.pinfl);

      const user = get(res, "data.data", null) as IBuyer;

      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const errorMsg = {
    pinfl: get(errors, "pinfl.message", null),
  };

  const userData = [
    { title: "ЖИШШР", value: get(user, "pinfl", "-") },
    { title: "Фамилия", value: get(user, "firstName", "-") },
    { title: "Исми", value: get(user, "lastName", "-") },
    { title: "Шарифи", value: get(user, "middleName", "-") },
    { title: "Паспорт серияси", value: get(user, "passportSerial", "-") },
    { title: "Паспорт рақами", value: get(user, "passportNumber", "-") },
    { title: "Ким томонидан берилган", value: get(user, "", "-") },
    { title: "Жинси", value: get(user, "gender", "-") },
    { title: "Миллати", value: get(user, "citizenship", "-") },
  ];

  return (
    <>
      {user ? (
        <>
          <Text h3>1. Шахсга доир маълумотлар</Text>

          <div className="h-[15px]" />

          <Image
            src="https://cdn.pixabay.com/photo/2021/04/25/14/30/man-6206540_960_720.jpg"
            alt="man_image"
            width={192}
            height={192}
            className="rounded-lg object-contain"
          />

          <div className="h-[35px]" />

          <div className="grid grid-cols-3 gap-5">
            {userData.map((data, idx) => {
              return <Description title={data.title} content={data.value} />;
            })}
          </div>

          <div className="h-[35px]" />

          <Button
            onClick={() => {
              onFinish();
            }}
            type="primary"
            size="large"
            className="flex items-center !gap-2 w-full justify-center"
          >
            Ҳаридор маълумотлари{" "}
            <ArrowRight strokeWidth={1.5} className="!h-5" />
          </Button>
        </>
      ) : (
        <>
          <Text h3>Идентификация</Text>

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
                    type={errorMsg.pinfl ? "error" : "default"}
                    {...register("pinfl")}
                  >
                    <div className="flex items-center justify-between">
                      <span>ПИНФЛ*</span>
                      <span
                        className={clsx({
                          "text-[#c50000]": true,
                          hidden: !errorMsg.pinfl,
                        })}
                      >
                        {errorMsg.pinfl}
                      </span>
                    </div>
                  </Input>

                  {/* <Input label="+998" placeholder="..." className="!w-full">
                    Номер телефона*
                  </Input>

                  <Dragger {...props} className="w-full">
                    <Text p>
                      <UploadCloud strokeWidth={1.5} />
                    </Text>

                    <Text p>Загрузите паспорт, щелкнув или перетащив файл.</Text>
                  </Dragger> 
               */}

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
                  message="Идентификациядан ўтиш учун тугмани босинг"
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
                        2. Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Quis, corrupti.
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
                  Идентификациядан ўтиш
                </Button>
              </>
            </Tabs.Item>
          </Tabs>
        </>
      )}
    </>
  );
}

export default Identification;
