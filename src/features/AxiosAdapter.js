import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
import {
  HTTP_GETTYPE,
  MSG_TIMEOUT_REQUEST,
  TIMEOUT_DEFAULT
} from '../app/constant/config';
import { _convertObjectToQuery } from '../app/utils/apiService';
class AxiosAdapter {
  static HttpPost(nameSlice, url) {
    return createAsyncThunk(`${nameSlice}`, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.REACT_APP_BACKEND_URL + url,
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token')
          },
          data: payload,
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
  }

  static HttpPostUploadFile(nameSlice, url) {
    return createAsyncThunk(`${nameSlice}`, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.REACT_APP_BACKEND_URL + url,
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + Cookie.get('access-token')
          },
          data: payload,
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
  }
  static HttpPut(nameSlice, url) {
    return createAsyncThunk(`${nameSlice}`, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.REACT_APP_BACKEND_URL + url + `${payload.id}`,
          method: 'PUT',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token')
          },
          data: payload.body,
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
  }
  static HttpUpdate(nameSlice, url) {
    return createAsyncThunk(`${nameSlice}`, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.REACT_APP_BACKEND_URL + url,
          method: 'PUT',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token')
          },
          data: payload,
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
  }

  static HttpUpdateById(nameSlice, url) {
    return createAsyncThunk(`${nameSlice}`, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.REACT_APP_BACKEND_URL + url + `/${payload.id}`,
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
  } 
  static GetHttp(nameSlice, url, type) {
    //console.log('url, type getDriver >>>', url, type);
    return createAsyncThunk(nameSlice, (payload, { rejectWithValue }) => {
     // console.log('payload >>>',payload);
      return new Promise((resolve, reject) => {
        let tmp = '';
        if (type === HTTP_GETTYPE.ALL) {
          tmp = process.env.REACT_APP_BACKEND_URL + url;
        } else if (type === HTTP_GETTYPE.ALL_PAGINATION) {
         
          tmp =
            process.env.REACT_APP_BACKEND_URL +
            url +
            '?' +
            _convertObjectToQuery(payload);
        } else tmp = process.env.REACT_APP_BACKEND_URL + url + payload;
        axios({
          url: tmp,
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token'),
            timeout: TIMEOUT_DEFAULT
          }
        })
          .then(res => resolve(res.data))
          .catch(err => {
            if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
            if (!err.response) reject(err);
            reject(rejectWithValue(err.response?.data));
          });
      });
    });
  }
  static HttpDelete(nameSlice, uri) {
    return createAsyncThunk(nameSlice, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/${uri}/${payload.id}`,
          method: 'Delete',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token'),
            timeout: TIMEOUT_DEFAULT
          }
        })
          .then(res => resolve(res.data))
          .catch(err => {
            if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
            if (!err.response) reject(err);
            reject(rejectWithValue(err.response?.data));
          });
      });
    });
  }

  static HttpDeleteMulti(nameSlice, uri) {
    return createAsyncThunk(nameSlice, (payload, { rejectWithValue }) => {
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/${uri}`,
          method: 'Delete',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token'),
            timeout: TIMEOUT_DEFAULT
          },
          data: payload,
        })
          .then(res => resolve(res.data))
          .catch(err => {
            if (err.code === 'ECONNABORTED') reject(MSG_TIMEOUT_REQUEST);
            if (!err.response) reject(err);
            reject(rejectWithValue(err.response?.data));
          });
      });
    });
  }
}
export default AxiosAdapter;
