import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListStaff, resetChange } from 'src/features/staffSlice';
import { MESSAGE } from 'src/app/constant/message';
import { getListAgencies } from 'src/features/agencySlice';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';

const ServiceStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.staffSlice.errors);
  const statusCreate = useSelector(state => state.staffSlice.statusCreate);
  const statusDelete = useSelector(state => state.staffSlice.statusDelete);
  const statusUpdate = useSelector(state => state.staffSlice.statusUpdate);

  const listStaff = useSelector(state => state.staffSlice.listStaff);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const getListStaffsWithParams = data => {
    dispatch(getListStaff(data));
  };

  useEffect(() => {
    getListStaffsWithParams();
    getListAgencies();
  }, [dispatch])

  useEffect(() => {
    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusCreate === STATUS_API.ERROR ||
      statusDelete === STATUS_API.SUCCESS ||
      statusDelete === STATUS_API.ERROR ||
      statusUpdate === STATUS_API.SUCCESS ||
      statusUpdate === STATUS_API.ERROR
    ) {
      dispatch(showToast());
    }

    if(statusCreate === STATUS_API.SUCCESS 
      || statusDelete === STATUS_API.SUCCESS
      || statusUpdate === STATUS_API.SUCCESS) {
      dispatch(getListStaff());
    }

  }, [statusCreate, statusDelete, statusUpdate]);

  return (
    <>
      <div className={classes.root}>
        <div style={{width:'98%', margin: '0 auto'}}>
              <ToolBar
                searchRef={getListStaffsWithParams}
              />
              <Results
                className="mt-5"
                listStaff={listStaff}
                getListStaffRef={getListStaffsWithParams}
              />
        </div>
      </div>
      {Boolean(
        statusCreate === STATUS_API.SUCCESS ||
        statusCreate === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusCreate === STATUS_API.SUCCESS
              ? MESSAGE.CREATE_USER_SUCCESS
              : error
          }
          type={
            statusCreate === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}

      {Boolean(
        statusDelete === STATUS_API.SUCCESS ||
        statusDelete === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusDelete === STATUS_API.SUCCESS
              ? MESSAGE.DELETE_STAFF_SUCCESS
              : error
          }
          type={
            statusDelete === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}

      {Boolean(
        statusUpdate === STATUS_API.SUCCESS ||
        statusUpdate === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusUpdate === STATUS_API.SUCCESS
              ? 'Cập nhật thành công'
              : error
          }
          type={
            statusUpdate === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}
    </>
  );
}


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    width: '100%',
    marginTop: '17px'
  },
  wrapper: {
    display: 'flex',
    position: 'relative',
    flex: '1 1 auto',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));


export default ServiceStaff;
