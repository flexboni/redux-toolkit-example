import { decrement, increment } from "../../features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Counter = () => {
  const dispatch = useAppDispatch();
  // const counter = useAppSelector((state) => state.counter.value);

  return (
    <div>
      <button
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {/* {counter} */}
      </span>
      <button
        aria-label="Increment value"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;
