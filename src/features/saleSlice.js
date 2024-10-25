import { createSlice } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

export const getListAgency = AxiosAdapter.GetHttp(
  'saleSlice/GetListAgency',
  '/agencies/member',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const createSale = AxiosAdapter.HttpPost(
  'saleSlice/AddMemberToAgency',
  '/sale_agent'
);

export const getListSales = AxiosAdapter.GetHttp(
  'saleSlice/getListSales',
  '/sale_agent',
  HTTP_GETTYPE.ALL_PAGINATION
);


export const deleteSale = AxiosAdapter.HttpDelete(
  'saleSlice/deleteStaff',
  'sale_agent',
)

export const userSlice = createSlice({
  name: 'saleSlice',
  initialState: {
    listAgency: [],
    listSellers: [],
    statusGetAll: null,
    statusCreate: null, 
    errors: null, 
    totalSellers: 0,
    isLoading: false,
  },
  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.statusCreate = null;
      state.errors = null;
      state.isLoading = false;
    }
  },
  extraReducers: {
    [createSale.pending]: state => {
      state.statusCreate = STATUS_API.PENDING;
      state.errorGetAll = null;
    },
    [createSale.fulfilled]: (state, action) => {
      state.statusCreate = STATUS_API.SUCCESS;
    },
    [createSale.rejected]: (state, action) => {
      state.statusCreate = STATUS_API.ERROR;
      state.errors = action.payload?.message || action.error;
    },

    [getListSales.pending]: state => {
        state.statusGetAll = STATUS_API.PENDING;
        state.errors = null;
        state.listSellers = null;
        state.isLoading = true;
    },
    [getListSales.fulfilled]: (state, action) => {
        state.statusGetAll = STATUS_API.SUCCESS;
        state.listSellers = action.payload.payload.sale_agents;
        state.totalSellers = action.payload.payload.number_of_items;
        state.isLoading = false;
    },
    [getListSales.rejected]: (state, action) => {
        state.statusGetAll = STATUS_API.ERROR;
        state.errors = action.payload?.message || action.error;
        state.isLoading = false;
    },

    
    [deleteSale.pending]: state => {
        state.statusDelete = STATUS_API.PENDING;
    },
    [deleteSale.fulfilled]: (state, action) => {

        state.statusDelete = STATUS_API.SUCCESS;
    },
    [deleteSale.rejected]: (state, action) => {
        state.statusDelete = STATUS_API.ERROR;
        state.errors = action.payload.message;
    }
    
  }
});
export const { resetChange } = userSlice.actions;

export default userSlice.reducer;
