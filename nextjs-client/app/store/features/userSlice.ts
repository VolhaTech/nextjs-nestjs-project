import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  users: Array<{ id: number; name: string; email: string }>;
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<Array<{ id: number; name: string; email: string }>>) {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
