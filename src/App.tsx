import { flightBookingMachine } from "@/flight-booking-machine";
import { Button } from "@geist-ui/core";
import { useMachine } from "@xstate/react";
import { Checkbox, DatePicker } from "antd";

function App() {
  const [state, send] = useMachine(flightBookingMachine);

  return (
    <div className="!p-20 flex items-center justify-center flex-col gap-5">
      <label className="flex items-center gap-3">
        <Checkbox onChange={() => send({ type: "TOGGLE" })} />
        <span>{state.matches("one_way") ? "with return" : "one way"}</span>
      </label>

      <div className="flex items-center gap-5">
        {state.context.dateFrom}
        <DatePicker
          onChange={(e) =>
            send({
              type: "START_DATE.UPDATE",
              payload: e?.format("DD.MM.YYYY"),
            })
          }
          placeholder="Flight"
        />

        {state.context.dateTo}
        <DatePicker
          onChange={(e) =>
            send({
              type: "END_DATE.UPDATE",
              payload: e?.format("DD.MM.YYYY"),
            })
          }
          disabled={state.matches("one_way")}
          placeholder="Return"
        />
      </div>

      <Button
        disabled={
          state.matches("one_way")
            ? !state.context.dateFrom
            : !state.context.dateFrom || !state.context.dateTo
        }
        type="secondary"
      >
        Submit
      </Button>
    </div>
  );
}

export default App;
