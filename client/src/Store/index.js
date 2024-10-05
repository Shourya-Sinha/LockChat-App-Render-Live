import { create } from "zustand";
import { createAuthSlice } from "./Slices/auth-slice";
import { createChatSlice } from "./Slices/chat-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))