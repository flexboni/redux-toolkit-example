import {
  createEntityAdapter,
  createSlice,
  configureStore,
} from "@reduxjs/toolkit";

const booksAdapter = createEntityAdapter({
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const booksSlice = createSlice({
  name: "books",
  initialState: booksAdapter.getInitialState({
    loading: "idle",
  }),
  reducers: {
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
    bookAdded: booksAdapter.addOne,
    booksLoading(state, action) {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    },
    booksReceived(state, action) {
      if (state.loading === "pending") {
        // Or, call them as "mutating" helers in a case reducer
        booksAdapter.setAll(state, action.payload);
        state.loading = "idle";
      }
    },
    bookUpdated: booksAdapter.updateOne,
  },
});

const { bookAdded, booksLoading, booksReceived, bookUpdated } =
  booksSlice.actions;

const booksReducer = booksSlice.reducer;
export default booksReducer;
