import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//BaoCaoTT09PhuLuc5 TT09
export const BaoCaoTT09PhuLuc5 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc5',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc5/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//BaoCaoTT09PhuLuc8 TT09
export const BaoCaoTT09PhuLuc8 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc8',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc8/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//BaoCaoTT09PhuLuc14 TT09
export const BaoCaoTT09PhuLuc14 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc14',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc14/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//BaoCaoTT09PhuLuc16 TT09
export const BaoCaoTT09PhuLuc16 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc16',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc16/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//BaoCaoTT09PhuLuc17 TT09
export const BaoCaoTT09PhuLuc17 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc17',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc17/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//BaoCaoTT09PhuLuc19 TT09
export const BaoCaoTT09PhuLuc19 = createAsyncThunk(
  'report/BaoCaoTT09PhuLuc19',
  ({ licensePlate = '', groupID = '', firstTime = '', lastTime = '', page = 1, pageSize = 30 }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/tt09/phuluc19/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
        // ,data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

//license_plate
export const licensePlate = createAsyncThunk(
  'report/licensePlate',
  ({ }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/vehicles/tracking/agency/${localStorage.getItem('agency-id')}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);


//group_id 
export const groupID = createAsyncThunk(
  'report/groupID',
  ({ }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/group_device/?agency_id=${localStorage.getItem('agency-id')}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          , Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);


export const reportTT09Slice = createSlice({
  name: 'report',
  initialState: {
    dataLicensePlate: null,
    dataGroupID: null,

    dataBaoCaoTT09PhuLuc8: null,
    isLoading: false

  },
  reducers: {
    resetDataSceen: state => {
      state.dataBaoCaoTT09PhuLuc5 = null;
      state.dataBaoCaoTT09PhuLuc8 = null;
      state.dataBaoCaoTT09PhuLuc14 = null;
      state.dataBaoCaoTT09PhuLuc16 = null;
      state.dataBaoCaoTT09PhuLuc17 = null;
      state.dataBaoCaoTT09PhuLuc19 = null;
    }
  },
  extraReducers: {

    [BaoCaoTT09PhuLuc5.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc5.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc5 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc5 ', state.dataBaoCaoTT09PhuLuc5);
    },
    [BaoCaoTT09PhuLuc5.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc5 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc5

    [BaoCaoTT09PhuLuc8.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc8.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc8 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc8 ', state.dataBaoCaoTT09PhuLuc8);
    },
    [BaoCaoTT09PhuLuc8.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc8 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc8

    [BaoCaoTT09PhuLuc14.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc14.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc14 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc14 ', state.dataBaoCaoTT09PhuLuc14);
    },
    [BaoCaoTT09PhuLuc14.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc14 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc14

    [BaoCaoTT09PhuLuc16.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc16.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc16 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc16 ', state.dataBaoCaoTT09PhuLuc16);
    },
    [BaoCaoTT09PhuLuc16.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc16 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc16

    [BaoCaoTT09PhuLuc17.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc17.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc17 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc17 ', state.dataBaoCaoTT09PhuLuc17);
    },
    [BaoCaoTT09PhuLuc17.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc17 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc17

    [BaoCaoTT09PhuLuc19.pending]: state => {
      console.log('PENDING....');
      state.isLoading = true;
    },
    [BaoCaoTT09PhuLuc19.fulfilled]: (state, action) => {
      state.dataBaoCaoTT09PhuLuc19 = action.payload;
      state.isLoading = false;
      console.log('BaoCaoTT09PhuLuc19 ', state.dataBaoCaoTT09PhuLuc19);
    },
    [BaoCaoTT09PhuLuc19.rejected]: (state, action) => {
      console.log('REJECT....');
      state.dataBaoCaoTT09PhuLuc19 = null;
      state.isLoading = false;
    },
    /// BaoCaoTT09PhuLuc19

    ///licensePlate
    [licensePlate.pending]: state => {
      console.log('licensePlate PENDING....');
    },

    [licensePlate.fulfilled]: (state, action) => {
      state.dataLicensePlate = action.payload.payload.latest_periodics;
      console.log('licensePlate', state.dataLicensePlate);
    },

    [licensePlate.rejected]: (state, action) => {
      console.log('licensePlate REJECT....');
      state.dataLicensePlate = null;
    },

    ///group_device
    [groupID.pending]: state => {
      console.log('dataGroupID PENDING....');
    },

    [groupID.fulfilled]: (state, action) => {
      state.dataGroupID = action.payload.payload.groupDevices;
      console.log('dataGroupID', state.dataGroupID);
    },

    [groupID.rejected]: (state, action) => {
      console.log('dataGroupID REJECT....');
      state.dataGroupID = null;
    },
  }
});

export const {
  resetDataSceen
} = reportTT09Slice.actions;

export default reportTT09Slice.reducer;
