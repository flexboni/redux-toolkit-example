import {
  combineReducers,
  configureStore,
  MiddlewareArray,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  getFirebase,
  actionTypes as rrfActionTypes,
} from "react-redux-firebase";
import { constants as rfConstants } from "redux-firestore";
import logger from "redux-logger";

import { pokemonApi } from "../services/pokemon";
import articleReducer from "../features/articles/articlesSlice";
import userReducer from "../features/users/usersSlice";
import commentReducer from "../features/comments/commentsSlice";
import additionalMiddleware from "additional-middleware";
import booksReducer from "../features/books/booksSlice";

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  articles: articleReducer,
  users: userReducer,
  comments: commentReducer,
  books: booksReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Working with Non-Serializable Data
      serializableCheck: {
        // // Ignore these action typesㅓ
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }).concat(pokemonApi.middleware),

  // getDefaultMiddleware({
  //   serializableCheck: {
  //     // just ignore every redux-firebase and react-redux-firebase action type
  //     ignoredActions: [
  //       ...Object.keys(rfConstants.actionTypes).map(
  //         (type) => `@@reactReduxFirebase/${type}`
  //       ),
  //       ...Object.keys(rrfActionTypes).map(
  //         (type) => `@@reactReduxFirebase/${type}`
  //       ),
  //     ],
  //     ignoredPaths: ["firebase", "firestore"],
  //   },
  //   thunk: {
  //     extraArgument: {
  //       getFirebase,
  //     },
  //   },
  // }).concat(pokemonApi.middleware),

  // Correct typing for the `Dispatch` type
  // getDefaultMiddleware().prepend(
  //   // correctly typed middlewares cna just be used
  //   additionalMiddleware,
  //   // you can also type middlewares manually
  //   untypedMiddleware as Middleware<AppDispatch(action: Action<'specialAction'>) => number,
  //   RootState
  // )
  // // prepend and contcat calls can be changed
  // .concat(logger),
});

// // MiddlewareArray without `getDefaultMiddleware - 1
// configureStore({
//   reducer: rootReducer,
//   middleware: new MiddlewareArray().concat(additionalMiddleware, logger),
// });
// // MiddlewareArray without `getDefaultMiddleware - 1
// configureStore({
//   reducer: rootReducer,
//   middleware: [additionalMiddleware, logger] as const,
// });

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
