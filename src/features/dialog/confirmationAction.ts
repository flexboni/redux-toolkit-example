import { createAsyncThunk } from "@reduxjs/toolkit";
import { resolve } from "dns";
import { RootState } from "../../app/store";

const confirmationThunkActions = {
  open: createAsyncThunk<
    boolean,
    DialogContents,
    { extra: ThunkExtraArguments }
  >("dialog", async (payload, { extra: { store }, dispatch }) => {
    // thunk 액션이 실행되고, 실제로 다이얼로그가 열리는 부분
    dispatch(openDialog(payload));

    return new Promise<boolean>((resolver) => {
      // 스토어를 구독하고 상태 변경을 감지하면
      // 사용자의 '동의', '거절' 액션에 맞추어 resolve 처리함.
      const unsubscribe = store.subscribe(() => {
        const { dialog } = store.getState() as RootState;

        if (dialog.isConfirmed) {
          unsubscribe();
          resolve(true);
        }

        if (dialog.isDeclined) {
          unsubscribe();
          resolve(false);
        }
      });
    });
  }),
};

export default confirmationThunkActions;
