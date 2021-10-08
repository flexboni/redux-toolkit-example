import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { normalize, schema } from "normalizr";

const userData = {
  users: [
    {
      idx: 1,
      first_name: "Test",
    },
    {
      idx: 2,
      first_name: "Two",
    },
  ],
};

const articlesAdapter = createEntityAdapter();

// -------------------------------------------------------------------------- //
// normalizr entity schema 정의
// export const userEntity = new schema.Entity("user");
// export const commentEntity = new schema.Entity("comments", {
//   commenter: userEntity,
// });
// export const articleEntity = new schema.Entity("articles", {
//   author: userEntity,
//   comments: [commentEntity],
// });

// export const fetchArticle = createAsyncThunk(
//   "articles/fetchArticle",
//   async (id) => {
//     const data = await fakeAPI.articles.show(id);
//     const data = {};

//     // Normalize the data so reducers can load a predictable payload,
//     // Like: `action.payload = { users: {}, articles: {}, comments: {} }`
//     const normalized = normalize(data, articleEntity);
//     return normalized.entities;
//   }
// );
// ========================================================================== //

// -------------------------------------------------------------------------- //
export const userEntity = new schema.Entity("user");
export const commentEntity = new schema.Entity("comments", {
  commenter: userEntity,
});
export const articleEntity = new schema.Entity("articles", {
  author: userEntity,
  comments: [commentEntity],
});
type Author = { id: number; name: string };
type Article = { id: number; title: string };
type Comment = { id: number; commenter: number };

export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async (id: number) => {
    const data = await fakeAPI.articles.show(id);
    // Normalize the data so reducers can responded to a predictable payload.
    // Note: at the time of writing, normalizr does not automatically infer the result,
    // so we explicitly declare the shape of the returned normalized data as a generic arg.
    const normalized = normalize<
      any,
      {
        articles: { [key: string]: Article };
        users: { [key: string]: Author };
        comments: { [key: string]: Comment };
      }
    >(data, articleEntity);
    return normalized.entities;
  }
);
// ========================================================================== //

export const slice = createSlice({
  name: "articles",
  initialState: articlesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticle.fulfilled, (state, action) => {
      articlesAdapter.upsertMany(state, action.payload.articles); // 음... 타입이 어떤걸까?
    });
  },
});
////////////////////////////////////////////////////////////////////////////////

// * createAsyncThunk - 1
const fetchSampleCall = createAsyncThunk(
  "users/fetchById",
  async (userId: number) => {
    const response = await fetch(`https://reqres.in/api/users/${userId}`);
    // Inferred return type: Promise<MyData>
    return (await response.json()) as MyData;
  }
);
// the parameter of `fetchUserById` is automatically inferred to `number` here
// and dispatching the resulting thunkAction will return a Promise of a correctly
// typed "fulfilled" or "rejected" action.
const lastReturnedAction = await store.dispatch(fetchSampleCall);
////////////////////////////////////////////////////////////////////////////////

// * createAsyncThunk - 2
const fetchSampleCall = createAsyncThunk<
  // Return type of the payload creator
  MyData,
  // First argument to the payload creator
  number,
  // optional fields for defining thunkApi field types
  {
    dispatch: AppDispatch;
    state: State;
    extra: {
      jwt: string;
    };
  }
>("users/fetchById", async (userId, thunkApi) => {
  const response = await fetch(`https://reqres.in/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${thunkApi.extra.jwt}`,
    },
  });
  // Inferred return type: Promise<MyData>
  return (await response.json()) as MyData;
});
////////////////////////////////////////////////////////////////////////////////

// * createAyncThunk : Success or have an expected error format REQUEST
interface MyKnownError {
  errorMessage: string;
  // ...
}
interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const updateUser = createAsyncThunk<
  MyData,
  UserAttributes,
  {
    extra: { jwt: string };
    rejectValue: MyKnownError;
  }
>("users/update", async (user, thunkApi) => {
  const { id, ...userData } = user;
  const response = await fetch(`https://reqres.in/api/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${thunkApi.extra.jwt}`,
    },
    body: JSON.stringify(userData),
  });
  if (response.status === 400) {
    // Return the known error for future handling
    return thunkApi.rejectWithValue((await response.json()) as MyKnownError);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.entities[payload.id] = payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      if (action.payload) {
        // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error;
      }
    });
  },
});
// Go to UserList.ts
////////////////////////////////////////////////////////////////////////////////

const articleReducer = slice.reducer;
export default articleReducer;
