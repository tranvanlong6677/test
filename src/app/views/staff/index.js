import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, makeStyles } from '@material-ui/core';
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
import DetailsUser from './agency_details/index';
import { MESSAGE } from 'src/app/constant/message';
import { resetChange } from 'src/features/vehicleSlice';
import { getListAgency } from 'src/features/userSlice';

const AgencyListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // get data api
  const listUser = useSelector(state => state.userSlice.listAgency);
  const totalUser = useSelector(state => state.userSlice.totalUser);
  const isLoading = useSelector(state => state.userSlice.isLoading);
  const statusCreate = useSelector(state => state.userSlice.statusCreate);
  const statusDelete = useSelector(state => state.userSlice.statusDelete);
  const statusUpdate = useSelector(state => state.userSlice.statusUpdate);

  // const dataLogin = useSelector(state => state.authSlice.dataLogin);

  // set state
  const [isShowModalUserDetails, setIsShowModalUserDetails] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [sendData, setSendData] = useState({
    data: undefined,
    type: null
  });

  const [params, setParams] = useState({
    page: 1,
    pageSize: PAGE_SIZE_LIST
  });

  useEffect(() => {
    if (statusCreate === STATUS_API.SUCCESS) {
      setIsShowModalUserDetails(false);
      dispatch(showToast());
      const newparams = Object.assign({}, params, { page: 0 });
      setParams(newparams);
      dispatch(getListAgency());
    }
  }, [statusCreate]);

  useEffect(() => {
    if (statusDelete === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize });
      dispatch(getListAgency(params));
    }
  }, [statusDelete]);

  useEffect(() => {
    if (statusUpdate === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize });
      dispatch(getListAgency(params));
    }
  }, [statusUpdate]);

  useEffect(() => {
    dispatch(getListAgency());
  }, []);

  const getListAgencyWithParams = data => {
    const paramValue = Object.assign({}, params, data);

    setParams(paramValue);
    dispatch(getListAgency(paramValue));
  };

  const clearSearch = () => {
    const paramValue = {
      page: 1,
      pageSize: PAGE_SIZE_LIST
    };
    setParams(paramValue);
    dispatch(getListAgency(paramValue));
  };

  const showDetailsUser = data => {
    if (!data) return;
    setSendData(data);
    setIsShowModalUserDetails(true);
  };

  // const createNewUser = () => {
  //   setSendData({ data: {}, type: ACTION_TABLE.CREATE });
  //   setIsShowModalUserDetails(true);
  // };

  const handleDeleteUser = data => {
    if (!data) return;
    setDeleteItem(data);
    dispatch(showDialogConfirm());
  };

  const confirmDeleteUser = () => {
    console.log(deleteItem);
    if (!deleteItem) return;
    setIsDeleted(true);
    // dispatch(deleteUser({ id: deleteItem.id }));
  };

  const closeModalUserDetails = data => {
    setIsShowModalUserDetails(false);
    dispatch(resetChange());
  };

  return (
    <Page className={classes.root}>
      {statusCreate === STATUS_API.SUCCESS && (
        <ToastMessage
          type={messageToastType_const.success}
          message={MESSAGE.CREATE_USER_SUCCESS}
        />
      )}

      {statusDelete === STATUS_API.SUCCESS && (
        <ToastMessage
          type={messageToastType_const.success}
          message={MESSAGE.CREATE_USER_FAIL}
        />
      )}
      <Container maxWidth={false}>
        {/* tool bar */}
        <Toolbar
          isLoading={isLoading}
          searchRef={getListAgencyWithParams}
          clearSearchRef={clearSearch}
          // createNewUserRef={createNewUser}
          // checkPermissionCreate={checkPermissionEdit}
        />
        {/* result */}
        <Box mt={3}>
          <Results
            // checkPermissionEdit={checkPermissionEdit}
            // checkPermissionView={checkPermissionViewCustomer || checkPermissionViewUser}
            actionDetailsUserRef={showDetailsUser}
            actionDeleteUserRef={handleDeleteUser}
            listUser={listUser}
            totalUser={totalUser}
            isLoading={isLoading}
            getListAgencyRef={getListAgencyWithParams}
          />
        </Box>
      </Container>
      <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_DEVICE}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDeleteUser()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      />

      {isShowModalUserDetails && sendData ? (
        <DetailsUser
          open={isShowModalUserDetails}
          sendData={sendData}
          closeRef={closeModalUserDetails}
        />
      ) : (
        ''
      )}

      {/*{isChangeUser && isDeleted ? (*/}
      {/*  <ToastMessage*/}
      {/*    callBack={() => dispatch(resetChange())}*/}
      {/*    message={*/}
      {/*      isChangeUser == STATUS_API.SUCCESS*/}
      {/*        ? MESSAGE.DELETE_DEVICE_SUCCESS*/}
      {/*        : MESSAGE.DELETE_DEVICE_FAIL*/}
      {/*    }*/}
      {/*    type={*/}
      {/*      isChangeUser == STATUS_API.SUCCESS*/}
      {/*        ? messageToastType_const.success*/}
      {/*        : messageToastType_const.error*/}
      {/*    }*/}
      {/*  />*/}
      {/*) : (*/}
      {/*  ''*/}
      {/*)}*/}
    </Page>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

export default AgencyListView;
