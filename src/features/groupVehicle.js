import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosAdapter from './AxiosAdapter';
import axios from 'axios';
import { _convertObjectToQuery } from '../app/utils/apiService';
import Cookie from 'js-cookie';
import {
  HTTP_GETTYPE,
  STATUS_API,
  MSG_TIMEOUT_REQUEST,
  TIMEOUT_DEFAULT
} from '../app/constant/config';

export const getListVehiclesByGroup = createAsyncThunk(
  'groupVehicle/getListVehiclesByGroup',
  ({payload, agencyId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/${payload.group_device_id}/device?${_convertObjectToQuery(payload)}`,
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

export const getListDevicesAvailable = createAsyncThunk(
  'groupVehicle/getListDevicesAvailable',
  ({payload, agencyId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/devices/agency/${agencyId}/not_belong_to_any_group?${_convertObjectToQuery(payload)}`,
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

export const getListGroupVehicle = AxiosAdapter.GetHttp(
  'groupVehicle/getListGroupVehicle',
  '/group_device/',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const createGroupVehicle = AxiosAdapter.HttpPost(
  'groupVehicle/createGroupVehicle',
  '/group_device/'
);


export const deleteGroupVehicle = AxiosAdapter.HttpDelete(
  'staffSlice/deleteGroupVehicle',
  'group_device',
)

export const addDeviceToGroup =  createAsyncThunk(
  'groupVehicle/addDeviceToGroup',
  ({payload, groupDeviceId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/${groupDeviceId}/device`,
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        },
        data: { list_device_id: payload.list_device_id },
        timeout: TIMEOUT_DEFAULT
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const removeDeviceToGroup =  createAsyncThunk(
  'groupVehicle/removeDeviceToGroup',
  ({payload, groupDeviceId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/${groupDeviceId}/device`,
        method: 'Delete',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        },
        data: payload,
        timeout: TIMEOUT_DEFAULT
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const groupVehicle = createSlice({
  name: 'groupVehicle',
  initialState: {
    listGroupVehicle: null,
    listVehicleByGroup: null,
    totalVehicleByGroup: 0,
    totalGroupVehicle: 0,
    errorGetList: null,
    statusCreate: null,
    errors: null,
    statusGetAll: null,
    listVehiclesAvailable: null,
    isLoading: false,
    isLoadingVehicle: false,
    isLoadingVehicleA: false,
    statusAddToGroup: null,
    statusRemoveToGroup: null,
    statusDelete: null,
  },

  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.errorGetList = null;
      state.isLoading = false;
      state.isLoadingVehicle = false;
      state.statusCreate = null
      state.isLoadingVehicleA = null;
      state.statusAddToGroup = null;
      state.statusRemoveToGroup = null;
      state.statusDelete = null;
    }
  },

  extraReducers: {
    [getListGroupVehicle.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errors = null;
      state.listGroupVehicle = null;
      state.totalGroupVehicle = 0;
      state.isLoading = true;
    },
    [getListGroupVehicle.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listGroupVehicle = action.payload.payload.groupDevices

      state.totalGroupVehicle = action.payload.payload.numberOfItem;
      state.isLoading = false;
    },
    [getListGroupVehicle.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errors = action.payload?.message || action.error;
      state.isLoading = false;
    },
    [getListVehiclesByGroup.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errors = null;
      state.listVehicleByGroup = null;
      state.totalVehicleByGroup = 0;
      state.isLoadingVehicle = true;
    },
    [getListVehiclesByGroup.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listVehicleByGroup = action.payload.devices

      state.totalVehicleByGroup = action.payload.number_of_item;
      state.isLoadingVehicle = false;
    },
    [getListVehiclesByGroup.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errors = action.payload?.message || action.error;
      state.isLoadingVehicle = false;
    },

    [getListDevicesAvailable.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errors = null;
      state.listVehiclesAvailable = null;
      state.isLoadingVehicleA = true;
    },
    [getListDevicesAvailable.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listVehiclesAvailable = action.payload.devices

      state.isLoadingVehicleA = false;
    },
    [getListDevicesAvailable.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errors = action.payload?.message || action.error;
      state.isLoadingVehicleA = false;
    },
    [createGroupVehicle.pending]: state => {
      state.isLoading = true;
      state.statusCreate = STATUS_API.PENDING;
    },
    [createGroupVehicle.fulfilled]: (state, action) => {
      state.isLoading = false;

      state.statusCreate = STATUS_API.SUCCESS;
    },
    [createGroupVehicle.rejected]: (state, action) => {
      state.isLoading = true;

      state.statusCreate = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },
    [deleteGroupVehicle.pending]: state => {
      state.statusDelete = STATUS_API.PENDING;
    },
    [deleteGroupVehicle.fulfilled]: (state, action) => {
      state.statusDelete = STATUS_API.SUCCESS;
    },
    [deleteGroupVehicle.rejected]: (state, action) => {
      state.statusDelete = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },


    [addDeviceToGroup.pending]: state => {
      state.statusAddToGroup = STATUS_API.PENDING;
    },
    [addDeviceToGroup.fulfilled]: (state, action) => {
      state.statusAddToGroup = STATUS_API.SUCCESS;
    },
    [addDeviceToGroup.rejected]: (state, action) => {
      state.statusAddToGroup = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },

    [removeDeviceToGroup.pending]: state => {
      state.statusRemoveToGroup = STATUS_API.PENDING;
    },
    [removeDeviceToGroup.fulfilled]: (state, action) => {
      state.statusRemoveToGroup = STATUS_API.SUCCESS;
    },
    [removeDeviceToGroup.rejected]: (state, action) => {
      state.statusRemoveToGroup = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },
  }
});
export const {
  resetChange,
} = groupVehicle.actions;

export default groupVehicle.reducer;
