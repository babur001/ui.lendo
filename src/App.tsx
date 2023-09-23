import Identification from "@/auth/Identification";
import Info from "@/auth/Info";
import { Dot, Text } from "@geist-ui/core";
import { Steps } from "antd";
import { useState } from "react";

enum TEnumSteps {
  IDENTIFICATION = 0,
  INFO = 1,
  CLIENT = 2,
  SCORING = 3,
  FORMALIZATION = 4,
  CONTRACT = 5,
  APPROVAL = 6,
  SCHEDULE = 7,
}

function App() {
  const [step, setStep] = useState<{ active: TEnumSteps; actual: TEnumSteps }>({
    active: TEnumSteps.IDENTIFICATION,
    actual: TEnumSteps.IDENTIFICATION,
  });

  return (
    <>
      <header className="h-14 shadow-lg"></header>

      <div className="container mx-auto">
        <div className="h-[30px]" />

        <div className="flex gap-7">
          <div className="w-1/4">
            <Text h3>Ariza: 73519</Text>

            <div className="h-[10px]" />

            <Steps
              progressDot
              direction="vertical"
              current={step.active}
              onChange={(stepParam) =>
                setStep({
                  ...step,
                  active: stepParam,
                })
              }
              items={[
                {
                  title: "Identifikatsiya",
                  description: <div>Ismi: Saburov Babur</div>,
                },
                {
                  disabled: step.actual < TEnumSteps.INFO,
                  title: "Ma'lumotlari",
                  description: (
                    <div>
                      <Text p my={0}>
                        Telefon raqam:
                      </Text>
                      <Text p my={0}>
                        Karta raqami:
                      </Text>
                    </div>
                  ),
                },
                {
                  disabled: step.actual < TEnumSteps.CLIENT,
                  title: "Klient",
                  description: "Klient kartsi yaratilmadi.",
                },
                {
                  disabled: step.actual < TEnumSteps.SCORING,
                  title: "Skoring",
                },
                {
                  disabled: step.actual < TEnumSteps.FORMALIZATION,
                  title: "Oformlenie",
                  description: (
                    <div>
                      <Text p my={0}>
                        4 ta parametrni tanlang
                      </Text>

                      <div className="h-[10px]" />

                      <div className="flex flex-col gap-3 text-xs">
                        {new Array(3).fill("").map((el, idx) => (
                          <Dot className="!pr-3 !text-xs !lowercase">
                            {idx + 10} <span className="!lowercase">oy</span>
                          </Dot>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  disabled: step.actual < TEnumSteps.CONTRACT,
                  title: "Shartnoma",
                  description: "Xali tuzilmadi.",
                },
                {
                  disabled: step.actual < TEnumSteps.APPROVAL,
                  title: "Tasdiqlash",
                  description: "Xali tasdiqlash konfiguratsiya qilinmadi.",
                },
                {
                  disabled: step.actual < TEnumSteps.SCHEDULE,
                  title: "Grafik",
                },
              ]}
            />
          </div>

          <div className="w-3/4 h-full">
            {/* 1. Identifikatsiya */}
            {step.active === TEnumSteps.IDENTIFICATION ? (
              <Identification
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.INFO,
                    actual: TEnumSteps.INFO,
                  })
                }
              />
            ) : null}

            {/* 2. Ma'lumotlar */}
            {step.active === TEnumSteps.INFO ? (
              <Info
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.CLIENT,
                    actual: TEnumSteps.CLIENT,
                  })
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
