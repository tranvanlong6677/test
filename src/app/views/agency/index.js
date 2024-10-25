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
import { getListAgencies, resetChange } from 'src/features/agencySlice';
import './style.css'

const AgencyListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // get data api
  const listAgency = useSelector(state => state.agencySlice.listAgencies);
  const totalAgency = useSelector(state => state.agencySlice.totalAgencies);

  const totalUser = useSelector(state => state.userSlice.totalUser);
  const isLoading = useSelector(state => state.agencySlice.isLoading);
  const statusDelete = useSelector(state => state.agencySlice.statusDelete);
  const statusUpdate = useSelector(state => state.agencySlice.statusUpdate);
  const statusCreate = useSelector(state => state.agencySlice.statusCreate);


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
    pageSize: PAGE_SIZE_LIST,
    is_pagination: true,
  });

  useEffect(() => {
    dispatch(getListAgencies(params));
  }, []);

  useEffect(() => {
    if (statusCreate === STATUS_API.SUCCESS) {
      setIsShowModalUserDetails(false);
      dispatch(showToast());
      const newparams = Object.assign({}, params, { page: 1 });
      setParams(newparams);
      dispatch(getListAgencies(newparams));
    }
  }, [statusCreate]);

  useEffect(() => {
    if (statusDelete === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize, is_pagination: params.is_pagination });
      dispatch(getListAgencies(params));
    }
  }, [statusDelete]);

  useEffect(() => {
    if (statusUpdate === STATUS_API.SUCCESS) {
      dispatch(showToast());
      setParams({ page: 1, pageSize: params.pageSize, is_pagination: params.is_pagination });
      dispatch(getListAgencies(params));
    }
  }, [statusUpdate]);

  useEffect(() => {
    dispatch(getListAgencies(params));
  }, []);

  const getListAgencyWithParams = data => {
    const paramValue = Object.assign({}, params, data);
    console.log(paramValue)
    setParams(paramValue);
    dispatch(getListAgencies(paramValue));
  };

  const clearSearch = () => {
    const paramValue = {
      page: 1,
      pageSize: PAGE_SIZE_LIST,
      is_pagination: true
    };
    setParams(paramValue);
    dispatch(getListAgencies(paramValue));
  };

  const showDetailsUser = data => {
    if (!data) return;
    setSendData(data);
    setIsShowModalUserDetails(true);
  };

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
          message={MESSAGE.CREATE_AGENCY_SUCCESS}
        />
      )}

      {statusDelete === STATUS_API.SUCCESS && (
        <ToastMessage
          type={messageToastType_const.success}
          message='Xóa xí nghiệp thành công'
        />
      )}
      <div className="container-fluid max-width-1600 mb-5 mt-4">
        {/* tool bar */}
        <Toolbar
          isLoading={isLoading}
          searchRef={getListAgencyWithParams}
          clearSearchRef={clearSearch}
        />
        <Box mt={5}>
          <Results
            actionDetailsUserRef={showDetailsUser}
            actionDeleteUserRef={handleDeleteUser}
            listAgency={listAgency}
            totalAgency={totalAgency}
            isLoading={isLoading}
            getListAgencyRef={getListAgencyWithParams}
          />
        </Box>
      </div>

      {isShowModalUserDetails && sendData ? (
        <DetailsUser
          open={isShowModalUserDetails}
          sendData={sendData}
          closeRef={closeModalUserDetails}
        />
      ) : (
        ''
      )}
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
