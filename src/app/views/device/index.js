import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, makeStyles } from '@material-ui/core';
import NotFoundView from '../errors/NotFoundView';
import {
  PAGE_SIZE_LIST,
  ACTION_TABLE,
  STATUS_API,
  messageToastType_const,
  CREATE_DEVICE_STEP
} from 'src/app/constant/config';
import ToastMessage from 'src/app/components/ToastMessage';
import DialogConfirm from 'src/app/components/DialogConfirm';
import Page from 'src/app/components/Page';
import {
  closeDialogConfirm,
  showDialogConfirm,
  showToast
} from 'src/features/uiSlice';
import Results from './Results';
import Toolbar from './ToolBar';
import DetailsDevice from './device_details/index';
import { MESSAGE } from 'src/app/constant/message';
import { resetChange } from 'src/features/vehicleSlice';
import {
  resetObjectCreating,
  setActiveStep,
} from '../../../features/deviceSlice';
import { getListDevice, deleteDevice } from 'src/features/deviceSlice'
import { roles } from 'src/app/constant/roles'
import { useNavigate, useLocation } from 'react-router-dom';
import { _convertObjectToQuery } from 'src/app/utils/apiService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DeviceListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  // get data api
  const listDevice = useSelector(state => state.deviceSlice.listDevice);
  const totalDevice = useSelector(state => state.deviceSlice.totalDevice);
  const isLoading = useSelector(state => state.deviceSlice.isLoading);
  const statusCreate = useSelector(state => state.deviceSlice.statusCreate);
  const statusDelete = useSelector(state => state.deviceSlice.statusDelete);
  const statusUpdate = useSelector(state => state.deviceSlice.statusUpdate);
  const statusGetSellers = useSelector(state => state.userSlice.statusGetSellers);
  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAdmin = dataLogin && dataLogin.role && (dataLogin.role.title === roles.ADMIN);
  const statusActive = useSelector(state => state.deviceSlice.statusActive);
  const statusImport = useSelector(state => state.deviceSlice.statusImport);
  const err = useSelector(state => state.deviceSlice.err);
  // set state
  const [isShowModalDeviceDetails, setIsShowModalDeviceDetails] = useState(
    false
  );
  const resultImport = useSelector(state => state.deviceSlice.resultImport);

  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [sendData, setSendData] = useState({
    data: undefined,
    type: null
  });

  const [params, setParams] = useState({
    page: query.get('page') || 1,
    page_size: query.get('page_size') || PAGE_SIZE_LIST,
    is_pagination: true
  });

  useEffect(() => {
    if (statusActive !== null || resultImport !== null) {
      dispatch(showToast())
    }
  }, [statusActive, resultImport])

  useEffect(() => {
    if (!localStorage.getItem('access-token')) return;
    dispatch(getListDevice(params));
  }, [])

  useEffect(() => {
    if (statusCreate === STATUS_API.SUCCESS) {
      setIsShowModalDeviceDetails(false)
      dispatch(showToast())
      const newparams = Object.assign({}, params, { page: 0 });
      setParams(newparams);
      navigate(`/app/device?${_convertObjectToQuery(newparams)}`);

      dispatch(getListDevice());
    }
  }, [statusCreate]);

  useEffect(() => {
    if (statusDelete === STATUS_API.SUCCESS) {
      dispatch(showToast())
      setParams(params);
      navigate(`/app/device?${_convertObjectToQuery(params)}`);
      dispatch(getListDevice(params));
    }
  }, [statusDelete]);

  useEffect(() => {
    if (statusUpdate === STATUS_API.SUCCESS) {
      dispatch(showToast())
      setParams({ page: 1, page_size: params.page_size });
      dispatch(getListDevice(params));
    }
  }, [statusUpdate]);

  useEffect(() => {
    if (isShowModalDeviceDetails) {
      dispatch(getListDevice({ is_pagination: false }));
    } else {
      dispatch(getListDevice({ ...params }));
    }
  }, [isShowModalDeviceDetails]);


  const getListDeviceWithParams = data => {
    const paramValue = Object.assign({}, params, data);
    setParams(paramValue);
    dispatch(getListDevice(paramValue));
  };

  const clearSearch = () => {
    const paramValue = {
      page: 1,
      page_size: PAGE_SIZE_LIST
    };
  };

  const showDetailsDevice = data => {
    if (!data) return;
    setSendData(data);
    setIsShowModalDeviceDetails(true);
  };

  const createNewDevice = () => {
    setSendData({ data: {}, type: ACTION_TABLE.CREATE });
    setIsShowModalDeviceDetails(true);
    dispatch(setActiveStep(CREATE_DEVICE_STEP.ADD_INFO_DEVICE));
    dispatch(resetObjectCreating());
  };

  const handleDeleteDevice = data => {
    if (!data) return;
    setDeleteItem(data);
    dispatch(showDialogConfirm());
  };

  const confirmDeleteDevice = () => {
    if (!deleteItem) return;
    setIsDeleted(true);
    dispatch(deleteDevice({ id: deleteItem.id }));
  };

  const closeModalDeviceDetails = data => {
    setIsShowModalDeviceDetails(false);
    dispatch(resetChange());
  }

  return isAdmin ? (
    <Page className={classes.root}>
      {statusGetSellers === STATUS_API.SUCCESS &&
        <ToastMessage type={messageToastType_const.success}
          message={'Cập nhật thành công'} />
      }

      {statusCreate === STATUS_API.SUCCESS &&
        <ToastMessage type={messageToastType_const.success}
          message={'Thêm thiết bị thành công'} />
      }

      {statusDelete === STATUS_API.SUCCESS &&
        <ToastMessage type={messageToastType_const.success}
          message={'Xóa thiết bị thành công'} />
      }
      <div className="container-fluid max-width-1600 mb-5 mt-4">
        {/* tool bar */}
        <Toolbar
          isLoading={isLoading}
          searchRef={getListDeviceWithParams}
          clearSearchRef={clearSearch}
          createNewDeviceRef={createNewDevice}
        // checkPermissionCreate={checkPermissionEdit}
        />
        {/* result */}
        <Box mt={5}>
          <Results
            // checkPermissionEdit={checkPermissionEdit}
            // checkPermissionView={checkPermissionViewCustomer || checkPermissionViewUser}
            actionDetailsDeviceRef={showDetailsDevice}
            actionDeleteDeviceRef={handleDeleteDevice}
            listDevice={listDevice}
            totalDevice={totalDevice}
            isLoading={isLoading}
            getListDeviceRef={getListDeviceWithParams}
          />
        </Box>
      </div>
      {/* <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_DEVICE}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDeleteDevice()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      /> */}

      {isShowModalDeviceDetails && sendData ? (
        <DetailsDevice
          open={isShowModalDeviceDetails}
          sendData={sendData}
          closeRef={closeModalDeviceDetails}
        />
      ) : (
        ''
      )}
      {statusActive !== null && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusActive === STATUS_API.SUCCESS
              ? MESSAGE.ACTIVE_DEVICE_SUCCESS
              : err
          }
          type={
            statusActive === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}
      {resultImport !== null && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={statusImport === STATUS_API.SUCCESS ?
            `Import thành công ${resultImport?.insert_success} và có  ${resultImport?.duplicate} bị trùng serial`
            : err}
          type={
            statusImport === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}
    </Page>
  ) : (<Page className={classes.root} title="Not Found">
    <Container maxWidth={false}>
      <NotFoundView />
    </Container>
  </Page>);
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

export default DeviceListView;
