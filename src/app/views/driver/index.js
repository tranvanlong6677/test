import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, makeStyles } from '@material-ui/core';
import {
  PAGE_SIZE_LIST,
  STATUS_API,
  messageToastType_const
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
import { MESSAGE } from 'src/app/constant/message';

import { getListDriver, resetChange } from 'src/features/driverSlice';
import DriverCreate from './popup/DriverCreate';
import { GetUserInfo } from 'src/features/authSlice';
const DriverListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // get data api
  const listUser = useSelector(state => state.driverSlice.listDriver);
  const totalUser = useSelector(state => state.driverSlice.totalDriver);
  const isLoading = useSelector(state => state.driverSlice.isLoading);
  const statusGetAll = useSelector(state => state.driverSlice.statusGetAll);
  const statusCreate = useSelector(state => state.userSlice.statusCreate);
  const statusDelete = useSelector(state => state.userSlice.statusDelete);
  const statusUpdate = useSelector(state => state.userSlice.statusUpdate);
  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const totalPage = useSelector(state => state.driverSlice.totalPage);
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
    dispatch(GetUserInfo());
  }, []);
  useEffect(() => {
    if (statusCreate === STATUS_API.SUCCESS) {
      setIsShowModalUserDetails(false);
      dispatch(showToast());
      const newparams = Object.assign({}, params, { page: 0 });
      setParams(newparams);
      getListAgencyWithParams();
    }
  }, [statusCreate]);

  useEffect(() => {
    if (statusDelete === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize });
      getListAgencyWithParams();
    }
  }, [statusDelete]);

  useEffect(() => {
    if (statusUpdate === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize });
      getListAgencyWithParams();
    }
  }, [statusUpdate]);

  useEffect(() => {
    getListAgencyWithParams();
  }, [dataLogin, params.page]);

  const getListAgencyWithParams = () => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
      const stringUrl = `${dataLogin.agency.id}?is_pagination=true&page=${params.page}&pageSize=${PAGE_SIZE_LIST}`;
      dispatch(getListDriver(stringUrl));
    }
  };
  
  const clearSearch = () => {
    const paramValue = {
      page: 1,
      pageSize: PAGE_SIZE_LIST
    };
  };
  const changePage = (value) => {
    setParams({ page: value });
  }


  const handleDeleteUser = data => {
    if (!data) return;
    setDeleteItem(data);
    dispatch(showDialogConfirm());
  };

  const confirmDeleteUser = () => {
    if (!deleteItem) return;
    setIsDeleted(true);
    // dispatch(deleteUser({ id: deleteItem.id }));
  };

  const closeModalUserDetails = data => {
    setIsShowModalUserDetails(false);
    dispatch(resetChange());
  };
  const [showCreate, setShowCreate] = useState(false);
  const onCreateNewUser = () => {
    setShowCreate(!showCreate);
  }
  const showMessageCreateDriver = () => {
    dispatch(showToast());
  }
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
        <Toolbar
          isLoading={isLoading}
          searchRef={getListAgencyWithParams}
          clearSearchRef={clearSearch}
          onCreateNewUser={onCreateNewUser}
        />
        <Box mt={3}>
          <Results
            actionDeleteUserRef={handleDeleteUser}
            listUser={listUser}
            totalUser={totalUser}
            isLoading={isLoading}
            getListAgencyRef={getListAgencyWithParams}
            totalPage={totalPage}
            currentPage={params.page}
            changePage={changePage}
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
      <DriverCreate success={showMessageCreateDriver} show={showCreate} close={onCreateNewUser} />
      <ToastMessage message={"Thêm tài xế thành công!"} />
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

export default DriverListView;
