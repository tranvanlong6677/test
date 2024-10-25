import { createSlice } from '@reduxjs/toolkit'
import { HTTP_GETTYPE, STATUS_API } from 'src/app/constant/config'
import AxiosAdapter  from './AxiosAdapter'

export const getListStaff = AxiosAdapter.GetHttp(
    'staffSlice/getListStaff',
    '/users/customer_care',
    HTTP_GETTYPE.ALL_PAGINATION
)

export const createStaff = AxiosAdapter.HttpPost(
    'staffSlice/createStaff',
    '/users/customer_care'
)

export const deleteStaff = AxiosAdapter.HttpDelete(
    'staffSlice/deleteStaff',
    'users/customer_care',
)

export const updateStaff = AxiosAdapter.HttpUpdateById(
    'staffSlice/deleteStaff',
    '/users/customer_care',
)

export const staffSlice = createSlice({
    name: 'staffSlice',
    initialState: {
        listStaff: [],
        totalStaffs: 0,
        statusGet: null,
        statusCreate: null,
        statusDelete: null,
        statusUpdate: null,
        errors: null,
        isLoading: false,
    }, 
    
    reducers: {
        resetChange: state => {
            state.statusGet = null;
            state.statusCreate = null;
            state.statusDelete = null;
            state.statusUpdate = null;
            state.errors = null;
        }
    },

    extraReducers: {
        [getListStaff.pending]: state => {
            state.statusGet = STATUS_API.PENDING;
            state.errorGetAll = null;
            state.listStaff = [];
            state.isLoading = true;
        },
        [getListStaff.fulfilled]: (state, action) => {
            state.statusGet = STATUS_API.SUCCESS;
            state.listStaff = action.payload.payload.cusotmer_cares;
            state.totalStaffs = action.payload.payload.number_of_items;
            state.isLoading = false;
        },
        [getListStaff.rejected]: (state, action) => {
          state.statusGet = STATUS_API.ERROR;
          state.isLoading = false;
        },
        [createStaff.pending]: state => {
            state.statusCreate = STATUS_API.PENDING;
        },
        [createStaff.fulfilled]: (state, action) => {

            state.statusCreate = STATUS_API.SUCCESS;
        },
        [createStaff.rejected]: (state, action) => {
            state.statusCreate = STATUS_API.ERROR;
            state.errors = action.payload.message;
        },
        [deleteStaff.pending]: state => {
            state.statusDelete = STATUS_API.PENDING;
        },
        [deleteStaff.fulfilled]: (state, action) => {

            state.statusDelete = STATUS_API.SUCCESS;
        },
        [deleteStaff.rejected]: (state, action) => {
            state.statusDelete = STATUS_API.ERROR;
            state.errors = action.payload.message;
        },
        [updateStaff.pending]: state => {
            state.statusUpdate = STATUS_API.PENDING;
        },
        [updateStaff.fulfilled]: (state, action) => {

            state.statusUpdate = STATUS_API.SUCCESS;
        },
        [updateStaff.rejected]: (state, action) => {
            state.statusUpdate = STATUS_API.ERROR;
            state.errors = action.payload.message;
        }
    }
})

export const { resetChange } = staffSlice.actions;

export default staffSlice.reducer;
