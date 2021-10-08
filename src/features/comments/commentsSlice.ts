import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { fetchArticle } from "../articles/articlesSlice";

const commentsAdapter = createEntityAdapter();

export const slice = createSlice({
  name: "comments",
  initialState: commentsAdapter.getInitialState(),
  reducers: {},
  // extraReducers: (builder) => {
  //   builder.addCase(fetchArticle.fulfilled, (state, action) => {
  //     commentsAdapter.upsertMany(state, action.payload.comments);
  //   });
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticle.pending, (state) => {})
      .addCase(fetchArticle.fulfilled, (state, action) => {
        commentsAdapter.upsertMany(state, action.payload.comments);
      })
      .addCase(fetchArticle.rejected, (state) => {});
  },
});

const commentReducer = slice.reducer;
export default commentReducer;
