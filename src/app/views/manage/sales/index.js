import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListStaff, resetChange } from 'src/features/staffSlice';
import { getListSales, createSale } from 'src/features/saleSlice';

import { MESSAGE } from 'src/app/constant/message';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';

const SalesManage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.saleSlice.errors);
  const listSellers = useSelector(state => state.saleSlice.listSellers);

  const statusCreate = useSelector(state => state.saleSlice.statusCreate);
  const statusDelete = useSelector(state => state.saleSlice.statusDelete);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const getListSalesWithParams = data => {
    dispatch(getListSales(data));
  };

  useEffect(() => {
    getListSalesWithParams();
  }, [dispatch])

  useEffect(() => {
    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusCreate === STATUS_API.ERROR ||
      statusDelete === STATUS_API.SUCCESS ||
      statusDelete === STATUS_API.ERROR
    ) {
      dispatch(showToast());
    }

    if(statusCreate === STATUS_API.SUCCESS 
      || statusDelete === STATUS_API.SUCCESS) {
      getListSalesWithParams();
    }

  }, [statusCreate, statusDelete]);

  return (
    <>
      <div className={classes.root}>
        <div style={{width:'98%', margin: '0 auto'}}>
              <ToolBar
                searchRef={getListSalesWithParams}
              />
              <Results
                className="mt-5"
                listStaff={listSellers}
                getListSalesRef={getListSalesWithParams}
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
    overflow: 'hidden',
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


export default SalesManage;
