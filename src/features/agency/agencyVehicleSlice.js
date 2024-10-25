import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from '../AxiosAdapter';
import axios from 'axios';
import { _convertObjectToQuery } from '../../app/utils/apiService';
import Cookie from 'js-cookie';

export const getListVehicles = createAsyncThunk(
  'agencyVehicleSlice/GetListVehicles',
  ({payload, agencyId}, { rejectWithValue }) => {
    console.log('agencyId createAsyncThunk',agencyId);
    console.log('payload createAsyncThunk',payload);
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/vehicles/agency/${agencyId}/management?${_convertObjectToQuery(payload)}`,
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        },
      })
      .then(res => resolve(res.data.payload))
        .catch(err => {
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

// export const getListVehicles = AxiosAdapter.GetHttp(
//   'agencyVehicleSlice/getListVehicles',
//   '/devices',
//   HTTP_GETTYPE.ALL
// );


export const getDetailVehicle = AxiosAdapter.GetHttp(
  'agencyVehicleSlice/GetDetailVehicle',
  '/vehicles/',
  HTTP_GETTYPE.DETAIL
);

export const createVehicle = AxiosAdapter.HttpPost(
    'agencyVehicleSlice/createVehicle',
    '/vehicles'
)

export const deleteVehicle = AxiosAdapter.HttpDelete(
    'agencyVehicleSlice/deleteVehicle',
    'vehicles',
)

export const agencyVehicleSlice = createSlice({
  name: 'agencyVehicleSlice',
  initialState: {
    isLoading: false,
    listVehicles: null,
    totalVehicle: 0,
    statusCreate: null,
    errors: null,
  
  },

  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.statusGetDetail = null;
      state.userSelected = null;
      state.selectedLicensePlate = null;
      state.isLoading = false;
    }
  },

  extraReducers: {
    [getListVehicles.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listVehicles = null;
      state.totalVehicle = 0;
      state.isLoading = true;
    },
    [getListVehicles.fulfilled]: (state, action) => {
      console.log('action >>>', action);
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listVehicles = action.payload.vehicles

      state.totalVehicle = action.payload.number_of_item;
      state.isLoading = false;
    },
    [getListVehicles.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
      state.isLoading = false;

    },
    [createVehicle.pending]: state => {
        state.statusCreate = STATUS_API.PENDING;
    },
    [createVehicle.fulfilled]: (state, action) => {

        state.statusCreate = STATUS_API.SUCCESS;
    },
    [createVehicle.rejected]: (state, action) => {
        state.statusCreate = STATUS_API.ERROR;
        state.errors = action.payload.message;
    },
  }
});
export const {
  resetChange,
} = agencyVehicleSlice.actions;

export default agencyVehicleSlice.reducer;
