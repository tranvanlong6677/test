import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config';
import AxiosAdapter from './AxiosAdapter';
import axios from 'axios';
import { _convertObjectToQuery } from '../app/utils/apiService';
import Cookie from 'js-cookie';

export const getListVod = createAsyncThunk(
  'vodSlice/getListVod',
  ({ channelId, date }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_CDN_API_SERVER}/api/search/box/${channelId}/${date}`,
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + Cookie.get('access-token')
        }
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);
export const vodSlice = createSlice({
  name: 'vodSlice',
  initialState: {
    isLoading: false,
    listVod: null,
    totalVod: 0,
    statusGetAll: null,
    vehicleSelected: null,
    vseekbar: null,
    gpsPayload: null
  },
  reducers: {
    setVehicleSelected: (state, action) => {
      state.vehicleSelected = action.payload;
    },
    setGPSPayload: (state, action) => {
      state.gpsPayload = action.payload;
    }

  },
  extraReducers: {
    [getListVod.pending]: state => {
      state.statusGetAll = STATUS_API.PENDING;
      state.errorGetList = null;
      state.listVod = null;
      state.totalVod = 0;
    },
    [getListVod.fulfilled]: (state, action) => {
      state.statusGetAll = STATUS_API.SUCCESS;
      state.listVod = action.payload.data;
      state.totalVod = action.payload.data.length;
    },
    [getListVod.rejected]: (state, action) => {
      state.statusGetAll = STATUS_API.ERROR;
      state.errorGetList = action.payload?.message || action.error;
    }
  }
});
export const { setVehicleSelected, setGPSPayload } = vodSlice.actions;
export default vodSlice.reducer;
