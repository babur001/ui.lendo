import { createMachine, assign } from "xstate";

type TStates =
  | "identify"
  | "info"
  | "klient"
  | "scoring"
  | "oformlenie"
  | "shartnoma"
  | "tasdiqlash"
  | "grafik";

export const authMachine = createMachine({
  initial: "identify",
  context: {},
  states: {
    identify: {
      on,
    },
    return: {
      on: {
        TOGGLE: {
          target: "one_way",
          actions: assign({
            dateTo: (_, event: { payload: string; type: string }) => "",
          }),
        },
        "START_DATE.UPDATE": {
          actions: assign({
            dateFrom: (_, event: { payload: string; type: string }) => {
              return event.payload;
            },
          }),
        },
        "END_DATE.UPDATE": {
          actions: assign({
            dateTo: (_, event: { payload: string; type: string }) => {
              return event.payload;
            },
          }),
        },
      },
    },
  },
});
