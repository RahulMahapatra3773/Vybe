import { createSlice } from "@reduxjs/toolkit";
const chatSlice=createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        typingUserId: null,
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload;
        },
        setMessages:(state,action)=>{
            state.messages=action.payload;
        },
        setTypingUser: (state, action) => {
          state.typingUserId = action.payload;
  },
    }
})
export const {setOnlineUsers,setMessages,setTypingUser}=chatSlice.actions;
export default chatSlice.reducer;