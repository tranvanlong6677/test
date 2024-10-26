import { createSlice } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';

export const getListVehicle = AxiosAdapter.GetHttp(
  'vehicleSlice/GetListVehicles',
  '/vehicles',
  HTTP_GETTYPE.ALL_PAGINATION
);

export const getListVehicleTracking = AxiosAdapter.GetHttp(
  'vehicleSlice/GetListVehiclesTracking',
  '/vehicles/tracking/agency/',
  HTTP_GETTYPE.DETAIL
);

export const getDetailVehicle = AxiosAdapter.GetHttp(
  'vehicleSlice/GetDetailVehicle',
  '/vehicles/',
  HTTP_GETTYPE.DETAIL
);

export const getVehicleByOwnerId = AxiosAdapter.GetHttp(
  'vehicleSlice/GetVehicleByOwnerId',
  '/vehicles/users/',
  HTTP_GETTYPE.DETAIL
);

export const vehicleSlice = createSlice({
  name: 'vehicleSlice',
  initialState: {
    listVehicle: null,
    totalVehicle: 0,
    errorGetList: null,
    statusGetAll: null,
    centerMap: { lat: 20.983173, lng: 105.766006 },

    agencySelected: null,
    listVehicleTracking: [],

    totalVehicleTracking: 0,
    errorListTracking: null,
    statusGetListTracking: null,

    errorGetVehicleByOwnerId: null,
    statusGetVehicleByOwnerId: null,

    err: null,
    detailVehicle: null,
    statusGetDetail: null,
    userSelected: null,
    selectedLicensePlate: null,
    existLincesePlate: true,
    positionsVehicle: null,
    isLoading: false
  },

  reducers: {
    setUserSelected: (state, action) => {
      state.userSelected = action.payload;
    },

    setSelectedLicensePlate: (state, action) => {
      state.selectedLicensePlate = action.payload;
    },

    setCenterMap: (state, action) => {
      console.log('payload', action.payload);
      state.centerMap = action.payload;
    },

    setExistLincesePlate: (state, action) => {
      state.selectedLicensePlate = action.payload;
    },

    setGetListLoading: (state, action) => {
      state.statusGetListTracking = action.payload;
    },

    setAgencySelected: (state, action) => {
      state.agencySelected = action.payload;
    },

    resetChange: state => {
      state.statusGetAll = null;
      state.statusGetDetail = null;
      state.userSelected = null;
      state.selectedLicensePlate = null;
      state.isLoading = false;
    }
  },
  extraReducers: {
    [getListVehicle.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listVehicle = null;
      state.totalVehicle = 0;
    },
    [getListVehicle.fulfilled]: (state, action) => {
      console.log('action getListVehicle', action);
      state.statusGetAll = STATUS_API.SUCCESS;

      state.listVehicle = action.payload.payload.vehicles;

      state.totalVehicle = action.payload.payload.numberOfItem;
    },
    [getListVehicle.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    },

    [getListVehicleTracking.pending]: state => {
      state.isLoading = true;
      if (
        state.listVehicleTracking.length === 0 ||
        state.statusGetListTracking === STATUS_API.LOADING
      ) {
        state.listVehicleTracking = [];
      }
      state.totalVehicleTracking = 0;
    },
    [getListVehicleTracking.fulfilled]: (state, action) => {
      //console.log('action getListVehicleTracking',action);
      state.statusGetListTracking = STATUS_API.SUCCESS;
      state.listVehicleTracking = action.payload.payload.latest_periodics.sort(
        function(a, b) {
          if (a.license_plate < b.license_plate) {
            return -1;
          }
          if (a.license_plate > b.license_plate) {
            return 1;
          }
          return 0;
        }
      );
      state.statisticVehicleTracking = action.payload.payload.statistic;
      state.isLoading = false;
    },
    [getListVehicleTracking.rejected]: (state, action) => {
      state.statusGetListTracking = STATUS_API.ERROR;
      state.errorListTracking = action.payload?.message || action.error;
      state.isLoading = true;
    },

    [getDetailVehicle.pending]: state => {
      state.statusGetDetail = STATUS_API.PENDING;
      state.err = null;
      state.detailVehicle = null;
    },
    [getDetailVehicle.fulfilled]: (state, action) => {
      console.log('action getDetailVehicle', action);
      state.statusGetDetail = STATUS_API.SUCCESS;
      state.detailVehicle = action.payload.payload.vehicle;
    },
    [getDetailVehicle.rejected]: (state, action) => {
      state.statusGetDetail = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    },
    [getVehicleByOwnerId.pending]: state => {
      state.statusGetVehicleByOwnerId = STATUS_API.PENDING;
      state.errorGetVehicleByOwnerId = null;
      state.listVehicle = [];
    },
    [getVehicleByOwnerId.fulfilled]: (state, action) => {
      console.log('action getVehicleByOwnerId', action);
      state.statusGetVehicleByOwnerId = STATUS_API.SUCCESS;
      state.errorGetVehicleByOwnerId = null;
      state.listVehicle = action.payload.payload.vehicles;
    },
    [getVehicleByOwnerId.rejected]: (state, action) => {
      state.statusGetVehicleByOwnerId = STATUS_API.ERROR;
      state.errorGetVehicleByOwnerId = action.payload?.message || action.error;
      state.listVehicle = [];
    }
  }
});
export const {
  resetChange,
  setCenterMap,
  setUserSelected,
  setSelectedLicensePlate,
  setExistLincesePlate,
  setGetListLoading,
  setAgencySelected
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
