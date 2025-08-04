import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    // Actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    toggleFollowing: (state, action) => {
      const userId = action.payload;
      if (!state.user?.following) {
        state.user.following = [];
      }

      if (state.user.following.includes(userId)) {
        state.user.following = state.user.following.filter((id) => id !== userId);
      } else {
        state.user.following.push(userId);
      }
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  toggleFollowing, // ✅ export this
} = authSlice.actions;

export default authSlice.reducer;
