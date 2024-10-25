import { createSlice } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

export const getListProvinces = AxiosAdapter.GetHttp(
  'provinceSlice/getListProvinces',
  '/provinces',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const provinceSlice = createSlice({
  name: 'provinceSlice',
  initialState: {
    listProvinces: [],
    totalProvinces: 0,
    errorGetList: null,
    statusGetAll: null,
    statusCreate: null,
    statusUpdate: null,
    statusDelete: null,
    err: null

  },
  extraReducers: {
    [getListProvinces.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = [];
      state.listProvinces = null;
      state.totalProvinces = 0;
    },
    [getListProvinces.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listProvinces = action.payload.payload.provinces;
      state.totalProvinces = action.payload.payload.numberOfItem;
    },
    [getListProvinces.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    }
  }
});

export default provinceSlice.reducer;
