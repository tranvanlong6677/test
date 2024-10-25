import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosAdapter from './AxiosAdapter';
import axios from 'axios';
import Cookie from 'js-cookie';
import {
  HTTP_GETTYPE,
  MSG_TIMEOUT_REQUEST,
  TIMEOUT_DEFAULT,
  STATUS_API
} from '../app/constant/config';

export const getListAgencyBusiness = AxiosAdapter.GetHttp(
  'agencySlice/getListAgencyBusiness',
  '/agencies/business',
  HTTP_GETTYPE.ALL
);

export const getMembers = AxiosAdapter.GetHttp(
  'agencySlice/getMembers',
  '/agencies/staff',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const createMember = AxiosAdapter.HttpPost(
  'agencySlice/createMember',
  '/agencies/staff',
  HTTP_GETTYPE.ALL
);

export const deleteMember = AxiosAdapter.HttpDelete(
  'agencySlice/deleteMember',
  '/agencies/staff',
  HTTP_GETTYPE.ALL
);

export const getListAgencies = AxiosAdapter.GetHttp(
  'agencySlice/getListAgencies',
  '/agencies',
  HTTP_GETTYPE.ALL_PAGINATION
);
export const createAgency = AxiosAdapter.HttpPost(
  'agencySlice/createAgency',
  '/agencies'
);

export const updateAgencyStatus = createAsyncThunk(
  'agencySlice/updateAgencyStatus', 
  (payload, { rejectWithValue }) => {
  return new Promise((resolve, reject) => {
    axios({
      url: process.env.REACT_APP_BACKEND_URL + `/agencies/${payload.id}/status`,
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': true,
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + Cookie.get('access-token')
      },
      data: payload.data,
      timeout: TIMEOUT_DEFAULT
    })
      .then(res => resolve(res.data))
      .catch(err => {
        if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
        if (!err.response) reject(err);
        reject(rejectWithValue(err.response?.data));
      });
  });
});


export const deleteAgency = AxiosAdapter.HttpDelete(
  'agencySlice/deleteAgency',
  '/agencies'
);

export const agencySlice = createSlice({
  name: 'agencySlice',
  initialState: {
    listAgencies: [],
    listMembers: [],
    listAgencyBusiness: [],
    totalAgencies: 0,
    totalMembers: 0,
    errorGetList: null,
    errorGetListAgencyBusiness: null,
    error: null,
    statusGetAgencyBusiness: null,
    statusGetMembers: null,
    statusCreateMember: null,
    statusDeleteMember: null,
    statusGetAll: null,
    statusCreate: null,
    statusUpdate: null,
    statusDelete: null,
    err: null,
    errors: null,
    isLoading: false

  },

  reducers: {
      resetChange: state => {
          state.statusGetMembers = null;
          state.statusCreateMember = null;
          state.statusGetAll = null;
          state.statusUpdate = null;
          state.statusDelete = null;
          state.statusDeleteMember = null;
          state.isLoading = false;
      }
  },

  extraReducers: {
    [getListAgencies.pending]: state => {
      state.statusGetAllAgencies = STATUS_API.PENDING;
      state.errorGetListAgencies = [];
      state.listAgencies = null;
      state.totalAgencies = 0;
      state.isLoading = true;
    },
    [getListAgencies.fulfilled]: (state, action) => {
      state.statusGetAllAgencies = STATUS_API.SUCCESS;
      state.listAgencies = action.payload.payload.agencies;
      state.totalAgencies = action.payload.payload.numberOfItem;
      state.isLoading = false;
    },
    [getListAgencies.rejected]: (state, action) => {
      state.statusGetAllAgencies = STATUS_API.ERROR;
      state.errorGetListAgencies = action.payload?.message || action.error;
      state.isLoading = false;
    },
    [createAgency.pending]: state => {
      state.statusCreate = STATUS_API.PENDING;
    },
    [createAgency.fulfilled]: (state, action) => {
      state.statusCreate = STATUS_API.SUCCESS;
    },
    [createAgency.rejected]: (state, action) => {
      state.statusCreate = STATUS_API.ERROR;
      state.error = action.payload?.message || action.error;
    },
    [updateAgencyStatus.pending]: state => {
      state.statusUpdate = STATUS_API.PENDING;
    },
    [updateAgencyStatus.fulfilled]: (state, action) => {
      state.statusUpdate = STATUS_API.SUCCESS;
    },
    [updateAgencyStatus.rejected]: (state, action) => {
      state.statusUpdate = STATUS_API.ERROR;
      state.error = action.payload?.message || action.error;
    },

    [getListAgencyBusiness.pending]: state => {
      state.statusGetAgencyBusiness = STATUS_API.PENDING;
      state.listAgencyBusiness = null;
      state.errorGetListAgencyBusiness = null;
    },
    [getListAgencyBusiness.fulfilled]: (state, action) => {
      state.statusGetAgencyBusiness = STATUS_API.SUCCESS;
      state.listAgencyBusiness = action.payload.payload.businesses;
      state.errorGetListAgencyBusiness = null;
    },
    [getListAgencyBusiness.rejected]: (state, action) => {
      state.statusGetAgencyBusiness = STATUS_API.ERROR;
      state.errorGetListAgencyBusiness = action.payload?.message || action.error;
    },
    [getMembers.pending]: state => {
      state.statusGetMembers = STATUS_API.PENDING;
      state.errorGetAll = null;
      state.isLoading = true;
      state.listMembers = [];
    },
    [getMembers.fulfilled]: (state, action) => {
      state.statusGetMembers = STATUS_API.SUCCESS;
      state.listMembers = action.payload.payload.users;
      state.totalMembers = action.payload.payload.numberOfItem;
      state.isLoading = false;
    },
    [getMembers.rejected]: (state, action) => {
      state.statusGetMembers = STATUS_API.ERROR;
      state.isLoading = true;
      state.errors = action.payload.message;
    },
    [createMember.pending]: state => {
      state.statusCreateMember = STATUS_API.PENDING;
    },
    [createMember.fulfilled]: (state, action) => {
      state.statusCreateMember = STATUS_API.SUCCESS;
    },
    [createMember.rejected]: (state, action) => {
      state.statusCreateMember = STATUS_API.ERROR;
      state.errors = action.payload.message;
    },
    [deleteMember.pending]: state => {
      state.statusDeleteMember = STATUS_API.PENDING;
    },
    [deleteMember.fulfilled]: (state, action) => {
      state.statusDeleteMember = STATUS_API.SUCCESS;
    },
    [deleteMember.rejected]: (state, action) => {
      state.statusDeleteMember = STATUS_API.ERROR;
      state.errors = action.payload.message;
    },
    [deleteAgency.pending]: state => {
      state.statusDelete = STATUS_API.PENDING;
    },
    [deleteAgency.fulfilled]: (state, action) => {
      state.statusDelete = STATUS_API.SUCCESS;
    },
    [deleteAgency.rejected]: (state, action) => {
      state.statusDelete = STATUS_API.ERROR;
      state.errors = action.payload.message;
    },
  }
});

export const { resetChange } = agencySlice.actions;

export default agencySlice.reducer;
