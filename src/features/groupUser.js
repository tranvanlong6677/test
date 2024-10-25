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

export const getListGroupByUser = createAsyncThunk(
  'groupUser/getListGroupByUser',
  ({payload}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/user/${payload.user_id}?${_convertObjectToQuery(payload)}`,
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
  'groupUser/getListDevicesAvailable',
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
  'groupUser/getListGroupVehicle',
  '/group_device/',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const createGroupVehicle = AxiosAdapter.HttpPost(
  'groupUser/createGroupVehicle',
  '/group_device/'
);


export const deleteGroupVehicle = AxiosAdapter.HttpDelete(
  'groupUser/deleteGroupVehicle',
  'group_device',
)

export const addGroupToUser =  createAsyncThunk(
  'groupUser/addGroupToUser',
  ({payload, groupDeviceId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/assign`,
        method: 'POST',
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

export const removeGroupToUser =  createAsyncThunk(
  'groupUser/removeGroupToUser',
  ({payload, groupDeviceId}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${
          process.env.REACT_APP_BACKEND_URL
        }/group_device/unassign`,
        method: 'POST',
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

export const groupUser = createSlice({
  name: 'groupUser',
  initialState: {
    listGroupVehicle: null,
    listGroupByUser: null,
    totalVehicleByGroup: 0,
    totalGroupVehicle: 0,
    errorGetList: null,
    statusCreate: null,
    errors: null,
    statusGetAll: null,
    listVehiclesAvailable: null,
    isLoading: false,
    isLoadingGroup: false,
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
      state.isLoadingGroup = false;
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
    [getListGroupByUser.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errors = null;
      state.listGroupByUser = null;
      state.totalVehicleByGroup = 0;
      state.isLoadingGroup = true;
    },
    [getListGroupByUser.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listGroupByUser = action.payload.groupDevices

      state.totalVehicleByGroup = action.payload.numberOfItem;
      state.isLoadingGroup = false;
    },
    [getListGroupByUser.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errors = action.payload?.message || action.error;
      state.isLoadingGroup = false;
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


    [addGroupToUser.pending]: state => {
      state.statusAddToGroup = STATUS_API.PENDING;
    },
    [addGroupToUser.fulfilled]: (state, action) => {
      state.statusAddToGroup = STATUS_API.SUCCESS;
    },
    [addGroupToUser.rejected]: (state, action) => {
      state.statusAddToGroup = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },

    [removeGroupToUser.pending]: state => {
      state.statusRemoveToGroup = STATUS_API.PENDING;
    },
    [removeGroupToUser.fulfilled]: (state, action) => {
      state.statusRemoveToGroup = STATUS_API.SUCCESS;
    },
    [removeGroupToUser.rejected]: (state, action) => {
      state.statusRemoveToGroup = STATUS_API.ERROR;
      state.errors = action.payload?.message;
    },
  }
});
export const {
  resetChange,
} = groupUser.actions;

export default groupUser.reducer;
