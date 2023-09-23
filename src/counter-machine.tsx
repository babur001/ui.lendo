import { createMachine, assign } from "xstate";

export const counterMachine = createMachine({
  initial: "active",
  context: {
    count: 0,
  },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: (context) => context.count + 1 }),
        },
        INACTIVATE: {
          target: "inactive",
        },
      },
    },
    inactive: {
      on: {
        ACTIVATE: {
          target: "active",
        },
      },
      // type: "final",
    },
  },
});
