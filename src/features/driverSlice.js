import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  HTTP_GETTYPE, PAGE_SIZE_IMAGE, STATUS_API,
  MSG_TIMEOUT_REQUEST, TIMEOUT_DEFAULT
} from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

import axios from 'axios';
import Cookie from 'js-cookie';

export const getListDriver = AxiosAdapter.GetHttp(
  'driverSlice/GetListDriver',
  '/drivers/agency/',
  //HTTP_GETTYPE.ALL_PAGINATION
);

export const addDriver = AxiosAdapter.HttpPost(
  'driverSlice/AddDriver',
  '/drivers'
);
export const getListDriverLicenseType = AxiosAdapter.GetHttp(
  'driver/drivertype',
  '/driver_license_type',
  HTTP_GETTYPE.ALL_PAGINATION
)

export const deleteDrivers = createAsyncThunk(
  'deviceSlice/deleteDrivers',
  (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/drivers/agency/${payload.agencyId}`,
          method: 'Delete',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token'),
            timeout: TIMEOUT_DEFAULT
          },
          data: payload.listAgenciesId,
        })
          .then(res => resolve(res.data))
          .catch(err => {
            if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
            if (!err.response) reject(err);
            reject(rejectWithValue(err.response?.data));
          });
      });
  });

export const driverSlice = createSlice({
  name: 'driverSlice',
  initialState: {
    listDriver: null,
    totalDriver: 0,
    errorGetList: null,
    statusGetAll: null,
    statusCreate: null,
    statusDelete: null,
    statusAddDriver: null,
    errorAddDriver: null,
    errors: null,
    listDriverLicenseType: null,
    totalPage: 0,
    isLoading: false
  },


  reducers: {
    // setUserSelected: (state, action) => {
    //   state.userSelected = action.payload;
    // },
    // setSelectedLicensePlate: (state, action) => {
    //   state.selectedLicensePlate = action.payload;
    // },
    // setExistLincesePlate: (state, action) => {
    //   state.selectedLicensePlate = action.payload;
    // },
  
    resetChange: state => {
      state.statusGetAll = null;
      state.statusGetDetail = null;
      state.userSelected = null;
      state.selectedLicensePlate = null;
      state.statusCreate = null;
      state.statusDelete = null;
    }
  },
  extraReducers: {
    [getListDriver.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listDriver = null;
      state.totalDriver = 0;
      state.isLoading = true;
    },
    [getListDriver.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listDriver = action.payload.payload.drivers;
      state.totalDriver = action.payload.payload.numberOfItem;
      state.totalPage =
        action.payload.payload.numberOfItem % PAGE_SIZE_IMAGE === 0
          ? action.payload.payload.numberOfItem / PAGE_SIZE_IMAGE
          : Math.ceil(action.payload.payload.numberOfItem / PAGE_SIZE_IMAGE);

      state.isLoading = false;
    },
    [getListDriver.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
      state.isLoading = false;
    },
    [addDriver.pending]: state => {
      state.statusCreate = STATUS_API.PENDING;
      state.statusAddDriver = STATUS_API.PENDING;
      state.errorAddDriver = null;
    },
    [addDriver.fulfilled]: (state, action) => {
      state.statusCreate = STATUS_API.SUCCESS;
      state.statusAddDriver = STATUS_API.SUCCESS;
      state.errorAddDriver = null;
    },
    [addDriver.rejected]: (state, action) => {
      state.statusCreate = STATUS_API.ERROR;
      state.statusAddDriver = STATUS_API.ERROR;
      state.errorAddDriver = action.payload?.message || action.error;
      state.errors = action.payload?.message || action.error;
    },
    [getListDriverLicenseType.fulfilled]: (state, action) => {
      state.listDriverLicenseType = action.payload;
    },
    [deleteDrivers.pending]: state => {
      state.statusDelete = STATUS_API.PENDING;
    },
    [deleteDrivers.fulfilled]: (state, action) => {
      state.statusDelete = STATUS_API.SUCCESS;
    },
    [deleteDrivers.rejected]: (state, action) => {
      state.statusDelete = STATUS_API.ERROR;
      state.errors = action.payload.message;
    }
  }
});
export const { resetChange, setUserSelected, setSelectedLicensePlate, setExistLincesePlate } = driverSlice.actions;

export default driverSlice.reducer;
