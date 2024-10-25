import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CREATE_DEVICE_STEP,
  HTTP_GETTYPE, MSG_TIMEOUT_REQUEST,
  STATUS_API, TIMEOUT_DEFAULT
} from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';
import axios from 'axios';
import Cookie from 'js-cookie';
import * as positions from '../factory/positions.json'

export const getListDevice = AxiosAdapter.GetHttp(
  'deviceSlice/GetListDevices',
  '/devices',
  HTTP_GETTYPE.ALL_PAGINATION
);
export const activeDevice = AxiosAdapter.HttpPost(
  'deviceSlice/activeSlice',
  '/devices/active'
);
export const getDetailDevice = AxiosAdapter.GetHttp(
  'deviceSlice/GetDetailDevice',
  '/devices/',
  HTTP_GETTYPE.DETAIL
);

export const updateDevice = AxiosAdapter.HttpPut(
  'deviceSlice/updateDevice',
  '/devices/',
)

export const updateMultiDevices = AxiosAdapter.HttpUpdate(
  'deviceSlice/updateMultiDevices',
  '/devices/assign/sales',
)

export const importDevice = AxiosAdapter.HttpPostUploadFile(
  'deviceSlice/importDevice',
  '/devices/import',
)

export const deleteDevices = AxiosAdapter.HttpDeleteMulti(
  'deviceSlice/deleteDevices',
  '/devices'
)

export const getDetailDevicePosition = createAsyncThunk(
  'deviceSlice/getDetailDevicePosition',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/devices/${payload.id}/position?first_time=${payload.first_time}&last_time=${payload.last_time}`,
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token'),
          timeout: TIMEOUT_DEFAULT
        }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  });

export const deleteDevice = createAsyncThunk(
  'deviceSlice/DeleteDevice',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/devices/${payload.id}`,
        method: 'Delete',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token'),
          timeout: TIMEOUT_DEFAULT
        }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  });

export const deviceSlice = createSlice({
  name: 'deviceSlice',
  initialState: {
    listDevice: [],
    totalDevice: 0,
    errorGetList: null,
    statusGetAll: null,
    statusGetPositions: null,
    statusCreate: null,
    statusActive: null,
    statusUpdate: null,
    statusDelete: null,
    statusImport: null,
    resultImport: null,
    resultDelete: null,


    err: null,
    detailDevice: null,
    statusGetDetail: null,

    activeStep: CREATE_DEVICE_STEP.ADD_INFO_DEVICE,
    objectCreating: {
      id: '',
      name: '',
      status: 'active',
      sim: '',
      mfg: '',
      device_type_id: '',
      serial: '',
      vehicle_license_plate_exists: '',
      vehicle_license_plate: '',
      customer_id: ''
    },

    positionsDevice: null,
    numberOfItemPosition: null,
    isLoading: false,
  },
  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.statusGetDetail = null;
      state.isLoading = false;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setObjectCreating: (state, action) => {
      state.objectCreating = action.payload;
    },
    resetObjectCreating: state => {
      state.objectCreating = {
        name: '',
        status: 'active',
        sim: '',
        mfg: '',
        device_type_id: '',
        serial: '',
        vehicle_license_plate_exists: '',
        vehicle_license_plate: '',
        customer_id: 0
      };
    }
  },
  extraReducers: {
    [getListDevice.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listDevice = null;
      state.totalDevice = 0;
      state.isLoading = true;
    },
    [getListDevice.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listDevice = action.payload.payload.devices;
      state.totalDevice = action.payload.payload.numberOfItem;
      state.isLoading = false;
    },
    [getListDevice.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
      state.isLoading = false;
    },
    [getDetailDevice.pending]: state => {
      state.statusGetDetail = STATUS_API.PENDING;
      state.err = null;
      state.detailDevice = null;
    },
    [getDetailDevice.fulfilled]: (state, action) => {
      state.statusGetDetail = STATUS_API.SUCCESS;
      state.detailDevice = action.payload.payload.device;
    },
    [getDetailDevice.rejected]: (state, action) => {
      state.statusGetDetail = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    },
    [getDetailDevicePosition.pending]: state => {
      state.statusGetPositions = STATUS_API.PENDING;
      state.err = null;
      state.positionsDevice = null;
    },
    [getDetailDevicePosition.fulfilled]: (state, action) => {
      state.statusGetPositions = STATUS_API.SUCCESS;
      state.positionsDevice = action.payload.payload.path;
      state.numberOfItemPosition = action.payload.payload.number_of_items;
    },
    [getDetailDevicePosition.rejected]: (state, action) => {
      state.statusGetPositions = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    },
    [activeDevice.pending]: state => {
      state.statusActive = STATUS_API.PENDING;
      state.err = null;
    },
    [activeDevice.fulfilled]: (state, action) => {
      state.statusActive = STATUS_API.SUCCESS;
      state.detailDevice = action.payload.payload.device;
    },
    [activeDevice.rejected]: (state, action) => {
      state.statusActive = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
    [deleteDevice.pending]: state => {
      state.statusDelete = STATUS_API.PENDING;
      state.err = null;
    },
    [deleteDevice.fulfilled]: (state, action) => {
      state.statusDelete = STATUS_API.SUCCESS;
      state.err = null;
    },
    [deleteDevice.rejected]: (state, action) => {
      state.statusDelete = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
    [updateDevice.pending]: state => {
      state.statusUpdate = STATUS_API.PENDING;
      state.err = null;
    },
    [updateDevice.fulfilled]: (state, action) => {
      state.statusUpdate = STATUS_API.SUCCESS;
      state.err = null;
    },
    [updateDevice.rejected]: (state, action) => {
      state.statusUpdate = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
    [importDevice.pending]: state => {
      state.statusImport = STATUS_API.PENDING;
      state.err = null;
    },
    [importDevice.fulfilled]: (state, action) => {
      state.statusImport = STATUS_API.SUCCESS;
      state.resultImport = action.payload.payload
      state.err = null;
    },
    [importDevice.rejected]: (state, action) => {
      state.statusImport = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
    [deleteDevices.pending]: state => {
      state.statusDelete = STATUS_API.PENDING;
      state.err = null;
    },
    [deleteDevices.fulfilled]: (state, action) => {
      state.statusDelete = STATUS_API.SUCCESS;
      state.resultDelete = action.payload.payload
      state.err = null;
    },
    [deleteDevices.rejected]: (state, action) => {
      state.statusDelete = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
    [updateMultiDevices.pending]: state => {
      state.statusUpdate = STATUS_API.PENDING;
      state.err = null;
    },
    [updateMultiDevices.fulfilled]: (state, action) => {
      state.statusUpdate = STATUS_API.SUCCESS;
      state.err = null;
    },
    [updateMultiDevices.rejected]: (state, action) => {
      state.statusUpdate = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    },
  }
});
export const {
  resetChange,
  setActiveStep,
  setObjectCreating,
  resetObjectCreating
} = deviceSlice.actions;

export default deviceSlice.reducer;
