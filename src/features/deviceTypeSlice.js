import { createSlice } from '@reduxjs/toolkit';

import AxiosAdapter from './AxiosAdapter';
import { HTTP_GETTYPE, STATUS_API } from '../app/constant/config';

export const getListDeviceType = AxiosAdapter.GetHttp(
  'deviceTypeSlice/GetListDeviceType',
  '/devices/types',
  HTTP_GETTYPE.ALL
);


export const deviceTypeSlice = createSlice({
  name: 'deviceTypeSlice',
  initialState: {
    listDeviceType: [],
    totalDeviceType: 0,
    statusGetListDeviceType: null,
    errorGetList: null
  },
  reducers: {},
  extraReducers: {
    [getListDeviceType.pending]: state => {
      state.statusGetListDeviceType = STATUS_API.PENDING;
      state.listDeviceType = null;
      state.totalDeviceType = 0;
    },
    [getListDeviceType.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listDeviceType = action.payload.payload.types;
      state.totalDeviceType = action.payload.payload.number_of_items;
    },
    [getListDeviceType.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    }
  }
});

export default deviceTypeSlice.reducer;
