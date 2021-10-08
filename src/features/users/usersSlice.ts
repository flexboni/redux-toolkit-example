import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchArticle, userEntity } from "../articles/articlesSlice";

interface User {
  idx: number;
  first_name: string;
  last_name: string;
}

// Since our primary key is `idx` and not `id`,
// pass in an ID selector to return that field instead
const usersAdapter = createEntityAdapter<User>({
  // id 값 매칭하기
  selectId: (user) => user.idx,
  // 정렬하기
  sortComparer: (a, b) => a.first_name.localeCompare(b.first_name),
});

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users);

// export const slice = createSlice({
//   name: "users",
//   initialState: usersAdapter.getInitialState(),
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchArticle.fulfilled, (state, action) => {
//       usersAdapter.upsertMany(state, action.payload.users);
//     });
//   },
// });

const slice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {
    userAdded: usersAdapter.addOne,
    usersReceived(state, action: PayloadAction<{ users: User[] }>) {
      usersAdapter.setAll(state, action.payload.users);
    },
  },
});

const userReducer = slice.reducer;
export default userReducer;
