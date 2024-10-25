import { createSlice } from '@reduxjs/toolkit';
import { number } from 'prop-types';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

export const getListVehicleTypes = AxiosAdapter.GetHttp(
  'vehicleTypeSlice/getListVehicleTypes',
  '/vehicle_type',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const getListVehicleTracking = AxiosAdapter.GetHttp(
  'vehicleTypeSlice/GetListVehiclesTracking',
  '/vehicles/tracking/agency/',
  HTTP_GETTYPE.DETAIL
);


export const createVehicleType = AxiosAdapter.HttpPost(
    'vehicleTypeSlice/createVehicleType',
    '/vehicle_type'
)

export const updateVehicleType = AxiosAdapter.HttpUpdateById(
  'vehicleTypeSlice/updateVehicleType',
  '/vehicle_type'
)

export const deleteVehicleType = AxiosAdapter.HttpDelete(
    'vehicleTypeSlice/deleteVehicleType',
    'vehicle_type',
)

export const vehicleTypeSlice = createSlice({
  name: 'vehicleTypeSlice',
  initialState: {
    listVehicleTypes: null,
    total: 0,
    errorGetList: null,
    statusGetAll: null,
    statusDelete: null, 
    statusCreate: null,
    statusUpdate: null,
    isLoading: false, 
  },

  reducers: {
    resetChange: state => {
      state.statusGetAll = null;
      state.isLoading = false;
      state.statusCreate = null;
      state.statusDelete = null;
      state.statusUpdate = null;
    }
  },
  extraReducers: {
    [getListVehicleTypes.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listVehicleTypes = null;
      state.total = 0;
      state.isLoading = true;
    },
    [getListVehicleTypes.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listVehicleTypes = action.payload.payload.types

      state.total = action.payload.payload.number_of_item;
      state.isLoading = false;

    },
    [getListVehicleTypes.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
      state.isLoading = false;
    },

    [createVehicleType.pending]: state => {
        state.statusCreate = STATUS_API.PENDING;
    },
    [createVehicleType.fulfilled]: (state, action) => {

        state.statusCreate = STATUS_API.SUCCESS;
    },
    [createVehicleType.rejected]: (state, action) => {
        state.statusCreate = STATUS_API.ERROR;
        state.errors = action.payload.message;
    },
    [deleteVehicleType.pending]: state => {
        state.statusDelete = STATUS_API.PENDING;
    },
    [deleteVehicleType.fulfilled]: (state, action) => {
        state.statusDelete = STATUS_API.SUCCESS;
    },
    [deleteVehicleType.rejected]: (state, action) => {
        state.statusDelete = STATUS_API.ERROR;
        state.errors = action.payload.message;
    },
    [updateVehicleType.pending]: state => {
      state.statusUpdate = STATUS_API.PENDING;
    },
    [updateVehicleType.fulfilled]: (state, action) => {
      state.statusUpdate = STATUS_API.SUCCESS;
    },
    [updateVehicleType.rejected]: (state, action) => {
      state.statusUpdate = STATUS_API.ERROR;
      state.errors = action.payload.message;
    }
  }
});
export const {
  resetChange,
} = vehicleTypeSlice.actions;

export default vehicleTypeSlice.reducer;
