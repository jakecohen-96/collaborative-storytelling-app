import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    user: { id: number; username: string } | null;
}

const initialState: AuthState = {
    accessToken: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{ accessToken: string; user: { id: number; username: string } }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;