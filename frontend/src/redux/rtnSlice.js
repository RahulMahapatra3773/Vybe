import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: 'realTimeNotification',
  initialState: {
    likeNotification: [],
    hasUnread: false, // ✅ Track red dot
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const { type, userId } = action.payload;
      if (!type || !userId) return;

      const exists = state.likeNotification.some(
        n => n.userId === userId && n.type === type
      );
      if (!exists) {
        state.likeNotification.unshift(action.payload); // latest first
        state.hasUnread = true; // ✅ show red dot
      }
    },
    clearNotifications: (state) => {
      state.likeNotification = [];
      state.hasUnread = false; // ✅ hide red dot
    },
    markNotificationsAsRead: (state) => {
      state.hasUnread = false; // ✅ hide red dot without clearing notifications
    },
  },
});

export const {
  setLikeNotification,
  clearNotifications,
  markNotificationsAsRead
} = rtnSlice.actions;
export default rtnSlice.reducer;
