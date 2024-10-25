import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//hanh trinh xe chay
export const reportSliceBGT = createAsyncThunk(
  'report/reportSliceBGT',
  ({licensePlate = '',groupID='', firstTime = '', lastTime = '', previousId = '', pageSize = 30,action=''}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/route/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&previousId=${previousId}&pageSize=${pageSize}&action=${action}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

//reportTocDocuaXe
export const reportTocDocuaXe = createAsyncThunk(
  'report/reportTocDocuaXe',
  ({licensePlate = '',groupID='', firstTime = '', lastTime = '', previousId = '', pageSize = 30,action=''}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/speed/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&previousId=${previousId}&pageSize=${pageSize}&action=${action}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

//quaTocDoGioiHan
export const quaTocDoGioiHan = createAsyncThunk(
  'report/quaTocDoGioiHan',
  ({licensePlate = '',groupID='', firstTime = '', lastTime = '', page = 1, pageSize = 30}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/overspeed/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

//thoiGianLaiXeLientuc
export const thoiGianLaiXeLientuc = createAsyncThunk(
  'report/thoiGianLaiXeLientuc',
  ({type = '', firstTime = '', lastTime = '', page = 1, pageSize = 30}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/drivetime/data?type=${type}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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


//BaoCaoTongHopTheoXe
export const BaoCaoTongHopTheoXe = createAsyncThunk(
  'report/BaoCaoTongHopTheoXe',
  ({licensePlate = '', groupID='',firstTime = '', lastTime = '', page = 1, pageSize = 30}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/general/vehicle/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

//BaoCaoTongHopTheoLaiXe
export const BaoCaoTongHopTheoLaiXe = createAsyncThunk(
  'report/BaoCaoTongHopTheoLaiXe',
  ({driverLicense = '', firstTime = '', lastTime = '', page = 1, pageSize = 30}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/general/driver/data?driverLicense=${driverLicense}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

//BaoCaoDungDo
export const BaoCaoDungDo = createAsyncThunk(
  'report/BaoCaoDungDo',
  ({licensePlate = '', groupID='',firstTime = '', lastTime = '', page = 1, pageSize = 30}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/stop/data?licensePlate=${licensePlate}&groupID=${groupID}&firstTime=${firstTime}&lastTime=${lastTime}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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
  ({}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/vehicles/tracking/agency/${localStorage.getItem('agency-id')}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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
  ({}, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/group_device/?agency_id=${localStorage.getItem('agency-id')}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
           ,Authorization: 'Bearer ' + localStorage.getItem('access-token')
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

export const reportSlice = createSlice({
  name: 'report',
  initialState: {
     
     dataLicensePlate:null,
     dataGroupID:null,

     dataReportBGT: null,
     dataReportTocDocuaXe:null,
     dataQuaTocDoGioiHan:null,
     dataThoiGianLaiXeLientuc:null,
     dataBaoCaoTongHopTheoXe:null,
     dataBaoCaoTongHopTheoLaiXe:null,
     dataBaoCaoDungDo:null,
     isLoading : false

  },
  reducers: {
    resetDataSceen: state => {
    state.dataReportBGT= null;
    state.dataReportTocDocuaXe=null;
    state.dataQuaTocDoGioiHan=null;
    state.dataThoiGianLaiXeLientuc=null;
    state.dataBaoCaoTongHopTheoXe=null;
    state.dataBaoCaoTongHopTheoLaiXe=null;
    state.dataBaoCaoDungDo=null;
    }
  },
  extraReducers: {

    [reportSliceBGT.pending]: state => {
        console.log('PENDING....VLL');
        state.isLoading= true;
    },
    [reportSliceBGT.fulfilled]: (state, action) => {
       state.dataReportBGT = action.payload;
       console.log('dataLogin', state.dataReportBGT);
       state.isLoading= false;
    },
    [reportSliceBGT.rejected]: (state, action) => {
        console.log('REJECTVV....VLL');
        state.dataReportBGT = null;
        state.isLoading= false;
    },

    /////1 Hanh trinh chay xe


  [reportTocDocuaXe.pending]: state => {
      console.log('reportTocDocuaXe PENDING....VLL');
      state.isLoading= true;
  },
  [reportTocDocuaXe.fulfilled]: (state, action) => {
     state.dataReportTocDocuaXe = action.payload;
     state.isLoading= false;
     console.log('reportTocDocuaXe dataLogin', state.dataReportTocDocuaXe);
  },
  [reportTocDocuaXe.rejected]: (state, action) => {
      console.log('reportTocDocuaXe REJECTVV....VLL');
      state.dataReportTocDocuaXe = null;
      state.isLoading= false;
  },
  /// 2 reportTocDocuaXe

  [quaTocDoGioiHan.pending]: state => {
      console.log('quaTocDoGioiHan PENDING....VLL');
      state.isLoading= true;
  },
  [quaTocDoGioiHan.fulfilled]: (state, action) => {
    state.dataQuaTocDoGioiHan = action.payload;
    console.log('quaTocDoGioiHan dataLogin', state.dataQuaTocDoGioiHan);
    state.isLoading= false;
  },
  [quaTocDoGioiHan.rejected]: (state, action) => {
      console.log('quaTocDoGioiHan REJECTVV....VLL');
      state.dataQuaTocDoGioiHan = null;
      state.isLoading= false;
  },
  /// 3 quaTocDoGioiHan

  [thoiGianLaiXeLientuc.pending]: state => {
    console.log('PENDING....VLL');
    state.isLoading= true;
  },
[thoiGianLaiXeLientuc.fulfilled]: (state, action) => {
  state.dataThoiGianLaiXeLientuc = action.payload;
  console.log('thoiGianLaiXeLientuc dataLogin', state.dataThoiGianLaiXeLientuc);
  state.isLoading= false;
},
[thoiGianLaiXeLientuc.rejected]: (state, action) => {
    console.log('REJECTVV....VLL');
    state.dataThoiGianLaiXeLientuc = null;
    state.isLoading= false;
},
/// 4 thoiGianLaiXeLientuc

[BaoCaoTongHopTheoXe.pending]: state => {
  console.log('PENDING....VLL');
  state.isLoading= true;
},
[BaoCaoTongHopTheoXe.fulfilled]: (state, action) => {
  state.dataBaoCaoTongHopTheoXe = action.payload;
  console.log('BaoCaoTongHopTheoXe dataLogin', state.dataBaoCaoTongHopTheoXe);
  state.isLoading= false;
},
[BaoCaoTongHopTheoXe.rejected]: (state, action) => {
  console.log('REJECTVV....VLL');
  state.dataBaoCaoTongHopTheoXe = null;
  state.isLoading= false;
},
/// 5 BaoCaoTongHopTheoXe

[BaoCaoTongHopTheoLaiXe.pending]: state => {
  console.log('PENDING....VLL');
  state.isLoading= true;
},
[BaoCaoTongHopTheoLaiXe.fulfilled]: (state, action) => {
  state.dataBaoCaoTongHopTheoLaiXe = action.payload;
  console.log('BaoCaoTongHopTheoLaiXe dataLogin', state.dataBaoCaoTongHopTheoLaiXe);
  state.isLoading= false;
},
[BaoCaoTongHopTheoLaiXe.rejected]: (state, action) => {
  console.log('REJECTVV....VLL');
  state.dataBaoCaoTongHopTheoLaiXe = null;
  state.isLoading= false;
},
/// 6 BaoCaoTongHopTheoLaiXe

[BaoCaoDungDo.pending]: state => {
  console.log('PENDING....VLL');
  state.isLoading= true;
},
[BaoCaoDungDo.fulfilled]: (state, action) => {
  state.dataBaoCaoDungDo = action.payload;
  console.log('BaoCaoDungDo dataLogin', state.dataBaoCaoDungDo);
  state.isLoading= false;
},
[BaoCaoDungDo.rejected]: (state, action) => {
  console.log('REJECTVV....VLL');
  state.dataBaoCaoDungDo = null;
  state.isLoading= false;
},
/// 7 BaoCaoDungDo

  /////licensePlate
  [licensePlate.pending]: state => {
    console.log('licensePlate PENDING....VLL');
   
  },

  [licensePlate.fulfilled]: (state, action) => {
    state.dataLicensePlate = action.payload.payload.latest_periodics;
    console.log('licensePlate', state.dataLicensePlate);
    
    },

  [licensePlate.rejected]: (state, action) => {
    console.log('licensePlate REJECTVV....VLL');
    state.dataLicensePlate = null;
     
  },

  /////group_device
  [groupID.pending]: state => {
    console.log('dataGroupID PENDING....VLL');
   
  },

  [groupID.fulfilled]: (state, action) => {
    state.dataGroupID = action.payload.payload.groupDevices;
    console.log('dataGroupID', state.dataGroupID);
    
    },

  [groupID.rejected]: (state, action) => {
    console.log('dataGroupID REJECTVV....VLL');
    state.dataGroupID = null;
  },

   
  }
});

export const {
  resetDataSceen
} = reportSlice.actions;

export default reportSlice.reducer;
