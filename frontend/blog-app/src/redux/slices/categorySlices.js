import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [], // Array to hold selected category IDs
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategories.push(action.payload);
    },
    deselectCategory: (state, action) => {
      state.selectedCategories = state.selectedCategories.filter(
        (id) => id !== action.payload,
      );
    },
    clearSelectedCategories: (state) => {
      state.selectedCategories = [];
    },
  },
});

export const { selectCategory, deselectCategory, clearSelectedCategories } =
  categorySlice.actions;

export const selectSelectedCategories = (state) =>
  state.categories.selectedCategories;

export default categorySlice.reducer;
