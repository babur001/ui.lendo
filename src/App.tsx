import Identification from "@/auth/Identification";
import Info from "@/auth/Info";
import { Dot, Spinner, Text } from "@geist-ui/core";
import { Steps } from "antd";
import { useState } from "react";
import Client from "@/auth/Client";
import Scoring from "@/auth/Scoring";
import Logo from "@/Logo";
import Formalization from "@/auth/Formalization";
import Contract from "@/auth/Contract";
import "@/tailwind.css";
import Approval from "@/auth/Approval";
import Graph from "@/auth/Graph";

enum TEnumSteps {
  IDENTIFICATION = 0,
  INFO = 1,
  CLIENT = 2,
  SCORING = 3,
  FORMALIZATION = 4,
  CONTRACT = 5,
  APPROVAL = 6,
  GRAPH = 7,
}

function App() {
  const [step, setStep] = useState<{ active: TEnumSteps; actual: TEnumSteps }>({
    active: TEnumSteps.INFO,
    actual: TEnumSteps.INFO,
  });

  return (
    <>
      <header className="h-14 shadow-sm flex items-center justify-center">
        <Logo className="!h-10" />
      </header>

      <div className="container mx-auto">
        <div className="h-[30px]" />

        <div className="flex gap-7">
          <div className="w-1/4">
            <Text h3>Ариза: 73519</Text>

            <div className="h-[10px]" />

            <Steps
              // progressDot
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
                  // icon: (
                  //   <div className="flex items-center justify-center bg-gray-200 h-8 w-8 rounded-full">
                  //     <Spinner className="!h-5" scale={0.95} />
                  //   </div>
                  // ),
                  title: "Идентификация",
                  description: <div>ФИШ: Saburov Babur</div>,
                },
                {
                  disabled: step.actual < TEnumSteps.INFO,
                  title: "Ҳаридор маълумотлари",
                  description: (
                    <div>
                      <Text p my={0}>
                        Телефон рақам:
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
                  title: "Скоринг тизими",
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
                  title: "Шартнома (Оммавий оферта)",
                  // description: "Xali tuzilmadi.",
                },
                {
                  disabled: step.actual < TEnumSteps.APPROVAL,
                  title: "Tasdiqlash",
                  // description: "Xali tasdiqlash konfiguratsiya qilinmadi.",
                },
                {
                  disabled: step.actual < TEnumSteps.GRAPH,
                  title: "Grafik",
                },
              ]}
            />
          </div>

          <div className="w-3/4 h-full">
            {/* 1. Идентификация */}
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

            {/* 3. Klient */}
            {step.active === TEnumSteps.CLIENT ? (
              <Client
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.SCORING,
                    actual: TEnumSteps.SCORING,
                  })
                }
              />
            ) : null}

            {/* 4. Scoring */}
            {step.active === TEnumSteps.SCORING ? (
              <Scoring
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.FORMALIZATION,
                    actual: TEnumSteps.FORMALIZATION,
                  })
                }
              />
            ) : null}

            {/* 5. Formalization */}
            {step.active === TEnumSteps.FORMALIZATION ? (
              <Formalization
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.CONTRACT,
                    actual: TEnumSteps.CONTRACT,
                  })
                }
              />
            ) : null}

            {/* 6. Contract */}
            {step.active === TEnumSteps.CONTRACT ? (
              <Contract
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.APPROVAL,
                    actual: TEnumSteps.APPROVAL,
                  })
                }
              />
            ) : null}

            {/* 7. Approval */}
            {step.active === TEnumSteps.APPROVAL ? (
              <Approval
                onFinish={() =>
                  setStep({
                    active: TEnumSteps.GRAPH,
                    actual: TEnumSteps.GRAPH,
                  })
                }
              />
            ) : null}

            {/* 8. Graph */}
            {step.active === TEnumSteps.GRAPH ? (
              <Graph
                onFinish={() => {
                  console.log("Alhamdullilah");
                  // setStep({
                  //   active: TEnumSteps.GRAPH,
                  //   actual: TEnumSteps.GRAPH,
                  // });
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
