import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    uploading: false,
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUploading: (state, action) => {
            state.uploading = action.payload;
        },
    },
});

export const { setLoading, setUploading } = loaderSlice.actions;
export default loaderSlice.reducer;