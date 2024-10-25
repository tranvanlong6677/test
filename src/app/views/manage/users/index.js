import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListStaff  } from 'src/features/staffSlice';
import { getMembers, resetChange } from 'src/features/agencySlice';
import { MESSAGE } from 'src/app/constant/message';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';

const ServiceStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.agencySlice.errors);
  const statusCreateMember = useSelector(state => state.agencySlice.statusCreateMember);
  const statusDeleteMember = useSelector(state => state.agencySlice.statusDeleteMember);
  const listMembers = useSelector(state => state.agencySlice.listMembers);
  const listStaff = useSelector(state => state.staffSlice.listStaff);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const getListMembersWithParams = data => {
    dispatch(getMembers(data));
  };

  useEffect(() => {
    const isReload = JSON.parse(localStorage.getItem('query-value'));
    if(isReload){
      return;
    }else{
      getListMembersWithParams();
    }
  }, [])

  useEffect(() => {
    if (
      statusCreateMember === STATUS_API.SUCCESS ||
      statusCreateMember === STATUS_API.ERROR ||
      statusDeleteMember === STATUS_API.SUCCESS ||
      statusDeleteMember === STATUS_API.ERROR
    ) {
      dispatch(showToast());
    }

    if(statusCreateMember === STATUS_API.SUCCESS 
      || statusDeleteMember === STATUS_API.SUCCESS) {
      dispatch(getMembers());
    }

  }, [statusCreateMember, statusDeleteMember]);

  return (
    <>
      <div className={classes.root}>
        <div style={{width:'98%', margin: '0 auto'}}>
              <ToolBar
                searchRef={getListMembersWithParams}
              />
              <Results
                className="mt-5"
                listMembers={listMembers}
                getListMembersRef={getListMembersWithParams}
              />
          </div>
      </div>
      {Boolean(
        statusCreateMember === STATUS_API.SUCCESS ||
        statusCreateMember === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusCreateMember === STATUS_API.SUCCESS
              ? MESSAGE.CREATE_USER_SUCCESS
              : error
          }
          type={
            statusCreateMember === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}

      {Boolean(
        statusDeleteMember === STATUS_API.SUCCESS ||
        statusDeleteMember === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusDeleteMember === STATUS_API.SUCCESS
              ? MESSAGE.DELETE_STAFF_SUCCESS
              : error
          }
          type={
            statusDeleteMember === STATUS_API.SUCCESS
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
