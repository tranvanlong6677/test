import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListStaff, resetChange } from 'src/features/staffSlice';
import { getListDriver } from 'src/features/driverSlice';
import { MESSAGE } from 'src/app/constant/message';

import { messageToastType_const, STATUS_API } from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';

const ServiceStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  // console.log('dataLogin >>>>',dataLogin);
  const error = useSelector(state => state.driverSlice.errors);
  const statusCreate = useSelector(state => state.driverSlice.statusCreate);
  const statusDelete = useSelector(state => state.driverSlice.statusDelete);
  const listDriver = useSelector(state => state.driverSlice.listDriver);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    page_size: 10
  });

  const getListDriverWithParams = query => {
    if (dataLogin && dataLogin.role.title == 'agency' && dataLogin.agency) {
      let stringUrl = `${dataLogin.agency.id}?is_pagination=true&page=${params.page}&pageSize=${PAGE_SIZE_LIST}`;
      if (query) {
        stringUrl = `${dataLogin.agency.id}?is_pagination=true&page=${query.page}&pageSize=${PAGE_SIZE_LIST}&keyword=${query.keyword}`;
      }
      dispatch(getListDriver(stringUrl));
    }
  };

  useEffect(() => {
    const isReload = JSON.parse(localStorage.getItem('valueSearch-driver'));
    if (isReload) {
      getListDriverWithParams(isReload);
    } else {
      getListDriverWithParams();
    }
  }, [dataLogin, params.page]);

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusCreate === STATUS_API.ERROR ||
      statusDelete === STATUS_API.SUCCESS ||
      statusDelete === STATUS_API.ERROR
    ) {
      dispatch(showToast());
    }

    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusDelete === STATUS_API.SUCCESS
    ) {
      getListDriverWithParams();
    }
  }, [statusCreate, statusDelete]);

  return (
    <>
      <div className={classes.root}>
        <div style={{ width: '98%', margin: '0 auto' }}>
          <ToolBar
            searchRef={getListDriverWithParams}
            showCreate={setShowCreate}
          />
          <Results
            className="mt-5"
            listDriver={listDriver}
            getListDriverRef={getListDriverWithParams}
          />
        </div>
      </div>
      {Boolean(
        statusCreate === STATUS_API.SUCCESS || statusCreate === STATUS_API.ERROR
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
        statusDelete === STATUS_API.SUCCESS || statusDelete === STATUS_API.ERROR
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
};

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

export default ServiceStaff;
