import { createMachine, assign } from "xstate";

export const temperatureMachine = createMachine({
  initial: "active",
  context: {
    C: 0,
    F: 0,
  },
  states: {
    active: {
      on: {
        CELSIUS: {
          actions: assign({
            C: (_, event: { type: string; payload: number }) => {
              return event.payload;
            },
            F: (_, event) => {
              return event.payload * (9 / 5) + 32;
            },
          }),
        },
        FARENHEIT: {
          actions: assign({
            F: (_, event: { type: string; payload: number }) => {
              return event.payload;
            },
            C: (_, event) => {
              return (event.payload - 32) * (5 / 9);
            },
          }),
        },
      },
    },
  },
});
