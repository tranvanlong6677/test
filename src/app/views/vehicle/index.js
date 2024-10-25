import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, makeStyles } from '@material-ui/core';
import {
  ACTION_TABLE,
  messageToastType_const,
  PAGE_SIZE_LIST,
  STATUS_API
} from 'src/app/constant/config';
import ToastMessage from 'src/app/components/ToastMessage';
import DialogConfirm from 'src/app/components/DialogConfirm';
import Page from 'src/app/components/Page';
import {
  closeDialogConfirm,
  showDialogConfirm
} from 'src/features/uiSlice';
import Results from './Results';
import Toolbar from './ToolBar';
import DetailsVehicle from './vehicle_details/index';
import { MESSAGE } from 'src/app/constant/message';
import { getListVehicle, resetChange } from 'src/features/vehicleSlice';
import Cookie from 'js-cookie';

const VehicleListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // get data api
  const listVehicle = useSelector(state => state.vehicleSlice.listVehicle);
  const totalVehicle = useSelector(state => state.vehicleSlice.totalVehicle);
  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const isChangeVehicle = useSelector(
    state => state.vehicleSlice.isChangeVehicle
  );
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  // set satte
  const [isShowModalVehicleDetails, setIsShowModalVehicleDetails] = useState(
    false
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [sendData, setSendData] = useState({
    data: undefined,
    type: null
  });

  const [params, setParams] = useState({
    page: 1,
    page_size: PAGE_SIZE_LIST
  });

  useEffect(() => {
    // TODO: ENABLE THIS
    // if (!Cookie.get('access-token')) return;
    dispatch(getListVehicle(params));
  }, []);

  const getListVehicleWithParams = data => {
    const paramValue = Object.assign({}, params, data);
    console.log('getListVehicle',paramValue);
    setParams(paramValue);
    dispatch(getListVehicle(paramValue));
  };

  const clearSearch = () => {
    const paramValue = {
      page: 1,
      page_size: PAGE_SIZE_LIST
    };
    setParams(paramValue);
    dispatch(getListVehicle(paramValue));
  };

  const showDetailsVehicle = data => {
    if (!data) return;
    setSendData(data);
    setIsShowModalVehicleDetails(true);
  };

  const createNewVehicle = () => {
    setSendData({ data: {}, type: ACTION_TABLE.CREATE });
    setIsShowModalVehicleDetails(true);
  };

  const handleDeleteVehicle = data => {
    if (!data) return;
    setDeleteItem(data);
    dispatch(showDialogConfirm());
  };

  const confirmDeleteVehicle = () => {
    if (!deleteItem) return;
    setIsDeleted(true);
    //dispatch(DeleteVehicle(deleteItem));
  };

  const closeModalVehicleDetails = data => setIsShowModalVehicleDetails(false);

  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        {/* tool bar */}
        <Toolbar
          isLoading={statusGetAll === STATUS_API.PENDING}
          searchRef={getListVehicleWithParams}
          clearSearchRef={clearSearch}
          createNewVehicleRef={createNewVehicle}
          // checkPermissionCreate={checkPermissionEdit}
        />
        {/* result */}
        <Box mt={3}>
          <Results
            actionDetailsVehicleRef={showDetailsVehicle}
            actionDeleteVehicleRef={handleDeleteVehicle}
            listVehicle={listVehicle}
            totalVehicle={totalVehicle}
            isLoading={statusGetAll === STATUS_API.PENDING}
            getListVehicleRef={getListVehicleWithParams}
          />
        </Box>
      </Container>
      <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_VEHICLE}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDeleteVehicle()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      />

      {isShowModalVehicleDetails && sendData ? (
        <DetailsVehicle
          open={isShowModalVehicleDetails}
          sendData={sendData}
          closeRef={closeModalVehicleDetails}
        />
      ) : (
        ''
      )}

      {isChangeVehicle && isDeleted ? (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            isChangeVehicle === STATUS_API.SUCCESS
              ? MESSAGE.DELETE_VEHICLE_SUCCESS
              : MESSAGE.DELETE_VEHICLE_FAIL
          }
          type={
            isChangeVehicle === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
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

export default VehicleListView;
