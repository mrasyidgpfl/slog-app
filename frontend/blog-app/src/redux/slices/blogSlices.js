import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  title: "",
  content: "",
  categories: [],
  selectedCategories: [],
  image: null,
  fileName: "",
  status: "idle",
  error: null,
};

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "blog/fetchCategories",
  async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/");
      return response.data;
    } catch (error) {
      throw Error("Failed to fetch categories");
    }
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload; // Update categories state
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
      state.fileName = action.payload.fileName;
    },
    resetBlogState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload; // Update categories state on success
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setTitle,
  setContent,
  setCategories, // Export setCategories action
  setSelectedCategories,
  setImage,
  resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;
