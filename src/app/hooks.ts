import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDialog = () => {
  const dispatch = useAppDispatch();

  // 리액트 컴포넌트에서 훅을 사용해서 openDialog 함수를 호출했다면
  // thunk 액션 생성자 함수를 통해 액션을 디스패치하게 된다.
  const openDialog = async (state: DialogContents): Promise => {
    const { payload } = await dispatch(confirmationThunkActions.open(state));

    return payload;
  };

  // ...

  return {
    openDialog,
    // ...
  };
};
