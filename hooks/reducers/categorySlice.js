import { createSlice } from "@reduxjs/toolkit";

const initialCategories = [
  { id: "1", iconName: "at", categoryName: "all" },
  { id: "2", iconName: "infinity", categoryName: "Routine" },
  { id: "3", iconName: "people-group", categoryName: "Collaboration" },
  { id: "4", iconName: "heart-pulse", categoryName: "Self-Care" },
  { id: "5", iconName: "briefcase", categoryName: "Project" },
];

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: initialCategories,
    expandedId: "1", // Initial expanded category
    selectedCategory: "All", // Initial selected category
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setExpandedId: (state, action) => {
      state.expandedId = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id
          ? {
              ...category,
              categoryName: action.payload.categoryName,
              iconName: action.payload.iconName,
            }
          : category
      );
    },
  },
});

export const {
  setCategories,
  setExpandedId,
  setSelectedCategory,
  addCategory,
  updateCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
