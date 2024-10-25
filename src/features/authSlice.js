import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS_API } from 'src/app/constant/config';
import axios from 'axios';
import Cookie from 'js-cookie';
export const Login = createAsyncThunk(
  'AuthSlice/login',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      })
        .then(res => resolve(res.data))
        .catch(err => {
          console.log(err);
          if (!err.response) reject(err);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const GetUserInfo = createAsyncThunk(
  'User/GetInfo',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/users/information`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access-token')
        }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err?.message);
          reject(rejectWithValue(err.response?.data || null));
        });
    });
  }
);

export const UpdateInfoBySelf = createAsyncThunk(
  'User/UpdateInfoBySelf',
  (payload, { rejectWithValue }) => {
    // const {id , ...updateData} = payload
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/auth/update/self`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access-token')
        },
        data: payload
      })
        .then(res => resolve(payload))
        .catch(err => {
          if (!err.response) reject(err?.message);
          reject(rejectWithValue(err.response?.data || null));
        });
    });
  }
);
export const Register = createAsyncThunk(
  'AuthSlice/register',
  (payload, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'x-access-token': Cookies.get('access-token')
        },
        data: payload
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const ChangePassword = createAsyncThunk(
  'AuthSlice/ChangePassword',
  ({ new_password, id }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/auth/password/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access-token')
        },
        data: { new_password: new_password }
      })
        .then(res => resolve(res.data))
        .catch(err => {
          if (!err.response) reject(err.message);
          reject(rejectWithValue(err.response?.data));
        });
    });
  }
);

export const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isLoadingLogin: false,
    failStatus: null,
    dataLogin: null,
    isLogin: false,
    //  state for register
    isLoadingRegister: false,
    failRegisterStatus: null,
    dataRegister: null,
    isRegisterSuccess: false,
    // state for case reload
    isGettingInfo: false,
    errGetting: null,
    // update user by self
    isUpdatingInfoBySelf: false,
    isUpdateBySelfSuccess: false,
    errUpdateBySelf: null,
    isChangePassword: STATUS_API.PENDING,
    errorChangePassword: null,
    isLoadingChangePassword: false,
    isAdmin: false,
    yourAgencyId: null,
  },
  reducers: {
    logOutAction: state => {
      state.isLogin = false;
      Cookie.remove('access-token');
      localStorage.removeItem('access-token');
    },
    loginSuccessAction: state => {
      state.isLogin = true;
    },
    finishRegisterAction: state => {
      state.isRegisterSuccess = false;
    },
    clearMassageErrorAction: state => {
      state.failStatus = null;
      state.failRegisterStatus = null;
    },
    clearMsgUpdate: state => {
      state.errUpdateBySelf = null;
      state.isUpdateBySelfSuccess = false;
    },
    resetChangePassword: state => {
      state.isChangePassword = STATUS_API.PENDING;
      state.isLoadingChangePassword = false;
    }
  },
  extraReducers: {
    [Login.pending]: state => {
      state.isLoadingLogin = true;
      state.errGetting = null;
    },
    [Login.fulfilled]: (state, action) => {
      state.isLoadingLogin = false;
      state.dataLogin = action.payload.payload.user;
      console.log('dataLogin hahahahah', action.payload);

      const user = action.payload.payload.user;

      state.isAdmin = user && user.role && user.role.title === 'admin' ?  true : false;

      state.yourAgencyId = user && user.role && user.role.title === 'agency' ? user.role.id : null;

      // console.log('isAdmin', state.isAdmin);

      state.isLogin = true;
      Cookie.set('access-token', action.payload.payload['token']);

      Cookie.set('access-token', action.payload.payload['token'], { path: 'https://hiento.xyz/'});

      localStorage.setItem('access-token', action.payload.payload['token']);
    

      if(action.payload.payload.user.agency != null){
      // console.log("load agency-id");
      Cookie.set('agency-id', action.payload.payload.user.agency.id);
      localStorage.setItem('agency-id', action.payload.payload.user.agency.id);
      }
    },
    [Login.rejected]: (state, action) => {
      state.isLoadingLogin = false;
      state.failStatus = action.payload || action.error;
    },
    // register call api
    [Register.pending]: state => {
      state.isLoadingRegister = true;
      state.errGetting = null;
    },
    [Register.fulfilled]: (state, action) => {
      state.isLoadingRegister = false;
      state.dataRegister = action.payload.payload;
      state.isRegisterSuccess = true;
      Cookie.set('access-token', action.payload.payload['access-token']);
      localStorage.setItem('access-token', action.payload['access-token']);
    },
    [Register.rejected]: (state, action) => {
      state.isLoadingRegister = false;
      state.failRegisterStatus = action.payload || action.error;
    },
    // get user info api
    [GetUserInfo.pending]: state => {
      state.isGettingInfo = true;
      state.errGetting = null;
    },
    [GetUserInfo.fulfilled]: (state, action) => {
      state.isGettingInfo = false;
      state.dataLogin = action.payload.payload.user;

      const user = action.payload.payload.user;

      state.isAdmin = user && user.role && user.role.title === 'admin' ?  true : false;

      state.yourAgencyId = user && user.role && user.role.title === 'agency' ? user.role.id : null;

    },
    [GetUserInfo.rejected]: (state, action) => {
      state.isGettingInfo = false;
      state.errGetting = action.payload || action.error;
    },
    //   update user by self
    [UpdateInfoBySelf.pending]: state => {
      state.isUpdatingInfoBySelf = true;
      state.errUpdateBySelf = null;
      state.isUpdateBySelfSuccess = false;
      state.errGetting = null;
    },
    [UpdateInfoBySelf.fulfilled]: (state, action) => {
      state.isUpdatingInfoBySelf = false;
      state.isUpdateBySelfSuccess = true;
      state.dataLogin = action.payload;
    },
    [UpdateInfoBySelf.rejected]: (state, action) => {
      state.isUpdatingInfoBySelf = false;
      state.errUpdateBySelf = action.payload?.message || action.error;
    },
    //   Change password
    [ChangePassword.pending]: state => {
      state.isLoadingChangePassword = true;
      state.errorChangePassword = null;
      state.isChangePassword = STATUS_API.PENDING;
    },
    [ChangePassword.fulfilled]: (state, action) => {
      state.isLoadingChangePassword = false;
      state.errorChangePassword = null;
      state.isChangePassword = STATUS_API.SUCCESS;
    },
    [ChangePassword.rejected]: (state, action) => {
      state.isLoadingChangePassword = false;
      state.isChangePassword = STATUS_API.ERROR;
      state.errorChangePassword = action.payload?.message || action.error;
    }
  }
});
export const {
  logOutAction,
  loginSuccessAction,
  finishRegisterAction,
  clearMassageErrorAction,
  clearMsgUpdate,
  resetChangePassword
} = authSlice.actions;

export default authSlice.reducer;
