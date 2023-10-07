import Identification from "@/auth/Identification";
import Info from "@/auth/Info";
import { Layout, Menu, MenuProps, Select, Steps, theme } from "antd";
import { useState } from "react";
import Scoring from "@/auth/Scoring";
import Logo from "@/Logo";
import Formalization from "@/auth/Formalization";
import Contract from "@/auth/Contract";
import Approval from "@/auth/Approval";
import Graph from "@/auth/Graph";
import { Calculator, LayoutDashboard, User } from "lucide-react";
import Buyers from "@/pages/buyers";
import { useTranslation } from "react-i18next";
import { TLanguages } from "@/auth/i18n";

const { Sider } = Layout;

enum TEnumSteps {
  IDENTIFICATION = 0,
  INFO = 1,
  SCORING = 2,
  FORMALIZATION = 3,
  CONTRACT = 4,
  APPROVAL = 5,
  GRAPH = 6,
}

function Nasiya() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<{ active: TEnumSteps; actual: TEnumSteps }>({
    active: TEnumSteps.IDENTIFICATION,
    actual: TEnumSteps.IDENTIFICATION,
  });

  return (
    <>
      <div className="container mx-auto">
        <div className="h-[30px]" />

        <div className="flex gap-7 h-full">
          <div className="w-1/4">
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
                  title: t("Идентификация"),
                },
                {
                  disabled: step.actual < TEnumSteps.INFO,
                  title: t("Ҳаридор маълумотлари"),
                },
                {
                  disabled: step.actual < TEnumSteps.SCORING,
                  title: "Скоринг тизими",
                },
                {
                  disabled: step.actual < TEnumSteps.FORMALIZATION,
                  title: "Расмийлаштириш",
                },
                {
                  disabled: step.actual < TEnumSteps.CONTRACT,
                  title: "Шартнома (Оммавий оферта)",
                },
                {
                  disabled: step.actual < TEnumSteps.APPROVAL,
                  title: "Тасдиқлаш",
                },
                {
                  disabled: step.actual < TEnumSteps.GRAPH,
                  title: "Тўлов графиги",
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
                    active: TEnumSteps.SCORING,
                    actual: TEnumSteps.SCORING,
                  })
                }
              />
            ) : null}

            {/* 3. Scoring */}
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
                  // ...
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function Wrapper() {
  const { t, i18n } = useTranslation();

  const items: MenuProps["items"] = [
    {
      key: "main",
      icon: <Calculator strokeWidth={1.5} className="!h-5" />,
      label: t(`Asosiy`),
    },
    {
      key: "register",
      icon: <User strokeWidth={1.5} className="!h-5" />,
      label: `Рўйхатдан ўтказиш`,
    },
    {
      key: "buyers",
      icon: <LayoutDashboard strokeWidth={1.5} className="!h-5" />,
      label: `Ҳаридорлар рўйхати`,
    },
  ];

  const changeLanguageHandler = (lang: TLanguages) => {
    i18n.changeLanguage(lang);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [menu, setMenu] = useState("register");
  return (
    <div>
      <Layout>
        <Sider
          width={240}
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center justify-center py-3">
            <Logo className="!h-10" />
          </div>

          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[menu]}
            items={items}
            onClick={(e) => setMenu(e.key)}
          />

          <Select
            className="w-full"
            defaultValue={"ru"}
            onSelect={(e) => {
              changeLanguageHandler(e as TLanguages);
            }}
            options={
              [
                {
                  label: "ru",
                  value: "ru",
                },
                {
                  label: "Kyrl",
                  value: "uz_kyrl",
                },
                {
                  label: "latn",
                  value: "uz_latn",
                },
              ] satisfies { label: React.ReactNode; value: TLanguages }[]
            }
          />
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }} className="bg-white">
          {menu === "register" ? <Nasiya /> : null}
          {menu === "buyers" ? <Buyers /> : null}
        </Layout>
      </Layout>
    </div>
  );
}
export default Wrapper;
