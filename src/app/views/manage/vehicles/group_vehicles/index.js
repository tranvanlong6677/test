import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, makeStyles, Card, CardContent, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getListVehicles } from 'src/features/agency/agencyVehicleSlice'
import { MESSAGE } from 'src/app/constant/message';
import { getListGroupVehicle, 
  getListVehiclesByGroup,
  resetChange,
  getListDevicesAvailable,
  deleteGroupVehicle
} from 'src/features/groupVehicle'
import CreateGroup from './create'
import {
  closeDialogConfirm,
  showDialogConfirm,
  showToast
} from 'src/features/uiSlice';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import ToastMessage from 'src/app/components/ToastMessage';
import LoadingInBox from 'src/app/components/LoadingInBox';
import DialogConfirm from 'src/app/components/DialogConfirm';

import TranferList from './TranferList';
import Search from './Search';
import './style.css';

const Vehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const closeModal = () => {
    setOpenCreateModal(false);
  }

  const error = useSelector(state => state.groupVehicle.errors);
  const statusCreate = useSelector(state => state.groupVehicle.statusCreate);
  const statusDelete = useSelector(state => state.groupVehicle.statusDelete);
  const statusAddToGroup = useSelector(state => state.groupVehicle.statusAddToGroup);
  const statusRemoveToGroup = useSelector(state => state.groupVehicle.statusRemoveToGroup)
  const listGroupVehicle = useSelector(state => state.groupVehicle.listGroupVehicle);
  const isLoading = useSelector(state => state.groupVehicle.isLoading);
  const [selectedGroup, setSelectedGroup] = useState();
  const listVehicles = useSelector(state => state.agencyVehicleSlice.listVehicles);
  const listVehicleByGroup = useSelector(state => state.groupVehicle.listVehicleByGroup);
  const listVehiclesAvailable = useSelector(state => state.groupVehicle.listVehiclesAvailable);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);


  useEffect(() => {
    const carId_local = JSON.parse(localStorage.getItem('carId-selected'));
    if(carId_local){
      setSelectedGroup(carId_local)
      //getGroupByUser(userId_local)
      dispatch(getListVehiclesByGroup({ payload: { group_device_id: carId_local }, agencyId: dataLogin?.agency.id }));
    }
  }, []);

  useEffect(() => {
    return () => localStorage.removeItem('carId-selected')
  }, []);

  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    page_size: 10,
  });

  const getListVehicleTypesWithParams = (data) => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
      dispatch(getListGroupVehicle({ agency_id: dataLogin.agency.id }));
    }
  };

  
  const getListVehiclesWithParams = (data) => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
     dispatch(getListVehicles({ payload: data, agencyId: dataLogin.agency.id }));
    }
  };

  const getListVehicleByGroup = (groupId) => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
      dispatch(getListVehiclesByGroup({ payload: { group_device_id: groupId }, agencyId: dataLogin.agency.id }));
    }

    setSelectedGroup(groupId);
    localStorage.setItem('carId-selected',groupId)
  }

  const getListAvailable = () => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {

      dispatch(getListDevicesAvailable({agencyId: dataLogin.agency.id }))
    }
  }

  useEffect(() => {
    getListVehicleTypesWithParams(params);
    getListVehiclesWithParams();
    getListAvailable();
  }, [dataLogin]);

  useEffect(() => {
    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusCreate === STATUS_API.ERROR ||
      statusRemoveToGroup === STATUS_API.SUCCESS ||
      statusRemoveToGroup === STATUS_API.ERROR ||
      statusAddToGroup === STATUS_API.SUCCESS ||
      statusAddToGroup === STATUS_API.ERROR ||
      statusDelete === STATUS_API.SUCCESS ||
      statusDelete === STATUS_API.ERROR 
    ) {
      dispatch(showToast());
    }

    if(statusCreate === STATUS_API.SUCCESS 
      || statusRemoveToGroup === STATUS_API.SUCCESS
      || statusAddToGroup === STATUS_API.ERROR
      || statusDelete === STATUS_API.SUCCESS) {
      getListVehicleTypesWithParams()  
    }

  }, [statusCreate, statusDelete]);

  
  useEffect(() => {
    if (
      statusRemoveToGroup === STATUS_API.SUCCESS ||
      statusRemoveToGroup === STATUS_API.ERROR ||
      statusAddToGroup === STATUS_API.SUCCESS ||
      statusAddToGroup === STATUS_API.ERROR 
   
    ) {
      dispatch(showToast());
    }

    if(statusRemoveToGroup === STATUS_API.SUCCESS
      || statusAddToGroup === STATUS_API.SUCCESS){
      if(selectedGroup) {
        getListVehicleByGroup(selectedGroup);
        getListAvailable();
      }
    }

  }, [statusRemoveToGroup, statusAddToGroup]);


  const handleDeleteGroup = () => {
    if(selectedGroup) {
      dispatch(showDialogConfirm());
    }
  } 

  const confirmDeleteUser = () => {
    dispatch(deleteGroupVehicle({  id: selectedGroup }));
  }

  return (
    <>
     <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_GROUP_DEVICE}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDeleteUser()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      />
      <CreateGroup open={openCreateModal} closeRef={closeModal} />
      <div >
        <Container maxWidth="lg">
          <Box mt={5}>
            <div className='row'>
              <div className='col-4'>
                <Card class="list-vehicle-group">
                  <CardContent>
                    <div className='row header mb-3'>
                      <div className='col-7 title'>
                        <b> 
                            Danh sách  nhóm 
                        </b>
                      </div>
                      <div className='col-5 float-right  title'>
                        <div className='flex'>
                          <span className='text-danger cursor-pointer ml-2 pl-2 float-left'  onClick={() => setOpenCreateModal(true)}>
                            <img
                              alt="Excell image"
                              className={classes.icon}
                              src="/static/iconSvg/plus.svg"
                            />
                            Thêm
                          </span>

                          <span className='text-danger cursor-pointer float-right'                               onClick={handleDeleteGroup}
                            onClick={handleDeleteGroup}
                            >
                            <img
                              alt="Excell image"
                              className={classes.icon}
                              src="/static/iconSvg/delete-icon.svg"
                              class="ml-3"
                            />
                            Xóa
                          </span>
                        </div>
                      </div>
                    </div>
                  <div className='row mx-auto'>
                    <Search />
                  </div>
                  <div className="row list-vehicles mt-2">
                    { isLoading ? (
                        <LoadingInBox />
                      ) : (listGroupVehicle && listGroupVehicle.map((item) => 
                          <ListItem
                            className={selectedGroup === item.id ? 'vehicle-group-selected' : ''}
                            key={item.id}
                            role="listitem"
                            button
                            onClick={() => getListVehicleByGroup(item.id)}
                          >
                          <ListItemIcon>
                            <img
                              alt="Excell image"
                              className={classes.image}
                              src={selectedGroup === item.id ? '/static/iconSvg/folders-selected.svg' : '/static/iconSvg/folders.svg'}
                              onClick={() => {}}
                              class="ml-3"
                            />
                          </ListItemIcon>
                          <ListItemText primary={`${item.name }`} />
                          </ListItem>                    
                        )) }
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='col-8'>
                <TranferList selectedGroup={selectedGroup} listVehicleByGroup={listVehicleByGroup} listVehicles={listVehiclesAvailable} />
              </div>
            </div>
          </Box>
        </Container>
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
        statusAddToGroup === STATUS_API.SUCCESS ||
        statusAddToGroup === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusAddToGroup === STATUS_API.SUCCESS
              ? 'Thêm xe vào nhóm thành công'
              : error
          }
          type={
            statusAddToGroup === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}
      {Boolean(
        statusRemoveToGroup === STATUS_API.SUCCESS ||
        statusRemoveToGroup === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusRemoveToGroup === STATUS_API.SUCCESS
              ? 'Gỡ bỏ thành công'
              : error
          }
          type={
            statusRemoveToGroup === STATUS_API.SUCCESS
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
              ? 'Xóa bỏ thành công'
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
  },
  icon: {
    display: 'inline-block',
    width: 17
  }
}));


export default Vehicle;
