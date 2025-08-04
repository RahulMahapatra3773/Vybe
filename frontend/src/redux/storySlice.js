import { createSlice } from "@reduxjs/toolkit";
const storySlice = createSlice({
  name: "story",
  initialState: {
    stories: [], // stories from people the user follows
  },
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
  },
});

export const { setStories } = storySlice.actions;
export default storySlice.reducer;
