import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListVehicles, resetChange } from 'src/features/agency/agencyVehicleSlice'
import { MESSAGE } from 'src/app/constant/message';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';

const Vehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const error = useSelector(state => state.vehicleTypeSlice.errors);
  const statusCreate = useSelector(state => state.vehicleTypeSlice.statusCreate);
  const statusDelete = useSelector(state => state.vehicleTypeSlice.statusDelete);
  const listVehicles = useSelector(state => state.agencyVehicleSlice.listVehicles);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    page_size: 10,
  });

  const getListVehicleTypesWithParams = (data) => {
    console.log('data search vehicle >>>',data);
    console.log('dataLogin 222 >>>', dataLogin);
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
     dispatch(getListVehicles({ payload: data, agencyId: dataLogin.agency.id }));
    }
  };

  useEffect(() => {
    getListVehicleTypesWithParams(params);
  }, [dataLogin]);

  const [showCreate, setShowCreate] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);

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
      getListVehicleTypesWithParams()  
    }

  }, [statusCreate, statusDelete]);

  return (
    <>
      <div className={classes.root}>
        <div style={{width:'98%', margin: '0 auto'}}>
              <ToolBar
                searchRef={getListVehicleTypesWithParams}
                showCreate={setShowCreate}
              />
              <Results
                className="mt-5"
                listVehicles={listVehicles}
                showEdit={setShowCreate}
                getListVehicleTypesWithParams={getListVehicleTypesWithParams}
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


export default Vehicle;
