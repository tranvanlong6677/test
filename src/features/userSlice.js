import { createSlice } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

export const getListAgency = AxiosAdapter.GetHttp(
  'userSlice/GetListAgency',
  '/agencies/member',
  HTTP_GETTYPE.ALL_PAGINATION
);
export const addMemberToAgency = AxiosAdapter.HttpPost(
  'userSlice/AddMemberToAgency',
  '/agencies/create_user'
);

export const getListSales = AxiosAdapter.GetHttp(
  'deviceSlice/getListSales',
  '/users/sale',
  HTTP_GETTYPE.ALL_PAGINATION
);

// export const getDetailUser = AxiosAdapter.GetHttp(
//   'userSlice/GetDetailUser',
//   '/users/',
//   HTTP_GETTYPE.DETAIL
// );
export const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    // TODO: DUY rename
    listAgency: [],
    listSellers: [],
    totalUser: 0,

    errorGetAll: null,
    statusGetAll: null,

    statusGetSellers: null,
    errorGetSellers: null,

    err: null,
    detailUser: null,
    statusGetDetail: null,
    statusCreate: null,
    totalSellers: 0,
  },
  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.statusGetDetail = null;
      state.statusCreate = null;
    }
  },
  extraReducers: {
    [getListAgency.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetAll = null;
      state.listAgency = null;
    },
    [getListAgency.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listAgency = action.payload.payload.users;
      state.totalUser = action.payload.payload.numberOfItem;
    },
    [getListAgency.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetAll = action.payload?.message || action.error;
    },
    [getListSales.pending]: state => {
      state.statusGetSellers = STATUS_API.PENDING;
      state.errorGetSellers = null;
      state.listSellers = null;
    },
    [getListSales.fulfilled]: (state, action) => {
      state.statusGetSellers = STATUS_API.SUCCESS;
      state.listSellers = action.payload.payload.users;
      state.totalSellers = action.payload.payload.numberOfItem;
    },
    [getListSales.rejected]: (state, action) => {
      state.statusGetSellers = STATUS_API.ERROR;
      state.errorGetSellers = action.payload?.message || action.error;
    },
    [addMemberToAgency.pending]: state => {
      state.statusCreate = STATUS_API.PENDING;
      state.err = null;
    },
    [addMemberToAgency.fulfilled]: (state, action) => {
      state.statusCreate = STATUS_API.SUCCESS;
    },
    [addMemberToAgency.rejected]: (state, action) => {
      state.statusCreate = STATUS_API.ERROR;
      state.err = action.payload?.message || action.error;
    }
  }
});
export const { resetChange } = userSlice.actions;

export default userSlice.reducer;
