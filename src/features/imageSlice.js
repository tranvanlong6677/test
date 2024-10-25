import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PAGE_SIZE_IMAGE } from '../app/constant/config';
import { _convertObjectToQuery } from '../app/utils/apiService';
import Cookie from 'js-cookie';

export const GetImages = createAsyncThunk(
  'imageSlice/GetImage',
  ({ payload, agencyId }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/images/${agencyId}/?${_convertObjectToQuery(payload)}`,
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        }
      })
        .then(res => resolve(res.data.payload))
        .catch(err => {
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const AdminGetImages = createAsyncThunk(
  'imageSlice/GetImage',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/images/?${_convertObjectToQuery(payload)}`,
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        }
      })
        .then(res => resolve(res.data.payload))
        .catch(err => {
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const imageSlice = createSlice({
  name: 'imageSlice',
  initialState: {
    err: null,
    isLoading: false,
    currentPageId: 1,
    currentImageId: 1,
    totalPage: 0,
    listImage: null,
    
  },
  reducers: {
    setPageId: (state, action) => {
      state.currentPageId = action.payload;
    },
    setImageId: (state, action) => {
      state.currentImageId = action.payload;
    },
    resetListImg: (state, action) => {
      state.listImage = action.payload;
    },

  },
  extraReducers: {
    [GetImages.pending]: (state, action) => {
      state.isLoading = true;
      state.err = null;
    },
    [GetImages.fulfilled]: (state, action) => {
      state.isLoading = false;
      let images = action.payload.images;
      images?.map(
        image =>
          (image.url = `${process.env.REACT_APP_IMG_SERVER}/${image.url}`)
      );
      state.listImage = images;
      let totalImage = action.payload.numberOfItem;
      state.totalPage =
        totalImage % PAGE_SIZE_IMAGE === 0
          ? totalImage / PAGE_SIZE_IMAGE
          : Math.ceil(totalImage / PAGE_SIZE_IMAGE);
    },
    [GetImages.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = 'Có lỗi xảy ra , không tải được ảnh ';
    },
    [AdminGetImages.pending]: (state, action) => {
      state.isLoading = true;
      state.err = null;
    },
    [AdminGetImages.fulfilled]: (state, action) => {
      state.isLoading = false;
      let images = action.payload.images;
      images?.map(
        image =>
          (image.url = `${process.env.REACT_APP_IMG_SERVER}/${image.url}`)
      );
      state.listImage = images;
      let totalImage = action.payload.numberOfItem;
      state.totalPage =
        totalImage % PAGE_SIZE_IMAGE === 0
          ? totalImage / PAGE_SIZE_IMAGE
          : Math.ceil(totalImage / PAGE_SIZE_IMAGE);
    },
    [AdminGetImages.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = 'Có lỗi xảy ra , không tải được ảnh ';
    }
  }
});
export const { setImageId, setPageId, resetListImg } = imageSlice.actions;

export default imageSlice.reducer;
