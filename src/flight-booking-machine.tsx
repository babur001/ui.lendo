import { createMachine, assign } from "xstate";

type TStates = "ONE_WAY" | "RETURN";

export const flightBookingMachine = createMachine({
  initial: "one_way",
  context: {
    dateFrom: "",
    dateTo: "",
  },
  states: {
    one_way: {
      on: {
        TOGGLE: {
          target: "return",
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
      },
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
