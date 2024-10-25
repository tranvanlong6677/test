import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice';
import imageSlice from '../features/imageSlice';
import vehicleSlice from '../features/vehicleSlice';
import uiSlice from '../features/uiSlice';
import deviceSlice from '../features/deviceSlice';
import agencySlice from '../features/agencySlice';
import provinceSlice from '../features/provinceSlice';
import userSlice from '../features/userSlice';
import driverSlice from '../features/driverSlice';
import deviceTypeSlice from '../features/deviceTypeSlice';
import reportSlice from '../features/reportBgtQC31Slice';
import reportTT09Slice from '../features/reportBgtTT09Slice';
import staffSlice from '../features/staffSlice';
import saleSlice from '../features/saleSlice';
import vehicleTypeSlice from '../features/vehicleTypeSlice';
import agencyVehicleSlice from '../features/agency/agencyVehicleSlice';
import groupVehicle from '../features/groupVehicle';
import groupUser from '../features/groupUser';
import vodSlice from '../features/playback';

export default configureStore({
  reducer: {
    authSlice: authSlice,
    imageSlice: imageSlice,
    vehicleSlice: vehicleSlice,
    uiSlice: uiSlice,
    deviceSlice: deviceSlice,
    userSlice: userSlice,
    driverSlice,
    agencySlice,
    provinceSlice,
    deviceTypeSlice,
    reportSlice: reportSlice,
    reportTT09Slice: reportTT09Slice,
    staffSlice,
    saleSlice,
    vehicleTypeSlice,
    agencyVehicleSlice,
    groupVehicle,
    groupUser,
    vodSlice
  }
});
