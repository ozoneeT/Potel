import { createSlice } from "@reduxjs/toolkit";

const initialCategories = [
  { id: "1", iconName: "✨", categoryName: "All" },
  { id: "2", iconName: "♾️", categoryName: "Routine" },
  { id: "3", iconName: "🌐", categoryName: "Collaboration" },
  { id: "4", iconName: "💖", categoryName: "Self-Care" },
  { id: "5", iconName: "💼", categoryName: "Project" },
];

const masterCategory = { id: "1", iconName: "✨", categoryName: "All" };

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: initialCategories,
    expandedId: "1", // Initial expanded category
    selectedCategory: { id: "1", categoryName: "All", iconName: "✨" }, // Initial selected category
    masterCategory: masterCategory, // Initial master category
  },
  reducers: {
    setMasterCategory: (state, action) => {
      state.masterCategory = {
        id: action.payload.id,
        categoryName: action.payload.categoryName,
        iconName: action.payload.iconName,
      };
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setExpandedId: (state, action) => {
      state.expandedId = action.payload;
    },
    setSelectedCategory: (state, action) => {
      const selectedCategory = state.categories.find(
        (category) => category.id === action.payload
      );
      if (selectedCategory) {
        state.selectedCategory = selectedCategory;
      }
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
  setMasterCategory,
  addCategory,
  updateCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
