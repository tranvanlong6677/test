import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results.js';
import ToolBar from './ToolBar.js';
import { getListVehicleTypes, resetChange } from 'src/features/vehicleTypeSlice'
import { MESSAGE } from 'src/app/constant/message';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';

const ServiceStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const error = useSelector(state => state.vehicleTypeSlice.errors);
  const statusCreate = useSelector(state => state.vehicleTypeSlice.statusCreate);
  const statusDelete = useSelector(state => state.vehicleTypeSlice.statusDelete);
  const statusUpdate = useSelector(state => state.vehicleTypeSlice.statusUpdate);
  const listVehicleTypes = useSelector(state => state.vehicleTypeSlice.listVehicleTypes);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    page_size: 10,
  });

  const getListVehicleTypesWithParams = (query) => {
    dispatch(getListVehicleTypes(query));
  };

  useEffect(() => {
    dispatch(getListVehicleTypes());
  }, [dispatch]);

  const [showCreate, setShowCreate] = useState(false);



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
      getListVehicleTypesWithParams()  
    }
  }, [statusCreate, statusDelete, statusUpdate]);

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
                listVehicleTypes={listVehicleTypes}
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
              ? "Xóa thành công"
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
              ?  "Cập nhật thành công"
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
