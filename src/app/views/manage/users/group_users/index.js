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
  getListDevicesAvailable,
  deleteGroupVehicle
} from 'src/features/groupVehicle'
import { getListGroupByUser, resetChange } from 'src/features/groupUser'
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
import { getMembers } from 'src/features/agencySlice';

import TranferList from './TranferList';
import Search from './Search';
import './style.css';

const Vehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const error = useSelector(state => state.groupUser.errors);
  const statusCreate = useSelector(state => state.groupVehicle.statusCreate);
  const statusDelete = useSelector(state => state.groupVehicle.statusDelete);
  const statusAddToGroup = useSelector(state => state.groupUser.statusAddToGroup);
  const statusRemoveToGroup = useSelector(state => state.groupUser.statusRemoveToGroup)
  const listGroupUser = useSelector(state => state.groupUser.listGroupUser);
  const isLoading = useSelector(state => state.groupVehicle.isLoading);
  const [selectedUser, setSelectedUser] = useState();
  const listVehicles = useSelector(state => state.agencyVehicleSlice.listVehicles);
  const listGroupVehicle = useSelector(state => state.groupVehicle.listGroupVehicle);

  const listGroupByUser = useSelector(state => state.groupUser.listGroupByUser);
  const listVehiclesAvailable = useSelector(state => state.groupVehicle.listVehiclesAvailable);
  const listMembers = useSelector(state => state.agencySlice.listMembers);

  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    page_size: 10,
  });

  const getListMembersWithParams = data => {
    dispatch(getMembers(data));
  };

  useEffect(() => {
    getListMembersWithParams();
  }, [dispatch])

  useEffect(() => {
    const userId_local = JSON.parse(localStorage.getItem('userId-selected'));
    if(userId_local){
      setSelectedUser(userId_local)
      //getGroupByUser(userId_local)
      dispatch(getListGroupByUser({ payload: { user_id: userId_local }, agencyId: dataLogin?.agency.id }));
    }
  }, []);

  useEffect(() => {
    return () => localStorage.removeItem('userId-selected')
  }, []);

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

  const getGroupByUser = (userId) => {
    if (dataLogin && dataLogin.role.title == "agency" && dataLogin.agency) {
      dispatch(getListGroupByUser({ payload: { user_id: userId }, agencyId: dataLogin.agency.id }));
    }

    setSelectedUser(userId);
    localStorage.setItem('userId-selected',userId)
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
      if(selectedUser) {
        getGroupByUser(selectedUser);
        getListAvailable();
      }
    }

  }, [statusRemoveToGroup, statusAddToGroup]);


  const handleDeleteGroup = () => {
    if(selectedUser) {
      dispatch(showDialogConfirm());
    }
  } 

  const confirmDeleteUser = () => {
    dispatch(deleteGroupVehicle({  id: selectedUser }));
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
                            Danh sách người dùng 
                        </b>
                      </div>
                    </div>
                  <div className='row mx-auto'>
                    <Search />
                  </div>
                  <div className="row list-vehicles mt-2">
                    { isLoading ? (
                        <LoadingInBox />
                      ) : (listMembers && listMembers.map((item) => 
                          <ListItem
                            className={selectedUser === item.id ? 'vehicle-group-selected' : ''}
                            key={item.id}
                            role="listitem"
                            button
                            onClick={() => getGroupByUser(item.id)}
                          >
                          <ListItemIcon>
                            <img
                              alt="Excel image"
                              className={classes.image}
                              src={selectedUser === item.id ? '/static/iconSvg/user_selected.svg' : '/static/iconSvg/userIcon.svg'}
                              onClick={() => {}}
                              class="ml-3"
                            />
                          </ListItemIcon>
                          <ListItemText primary={`${item.full_name }`} />
                          </ListItem>                    
                        )) }
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='col-8'>
                <TranferList selectedGroup={selectedUser} listGroupVehicle={listGroupVehicle} listGroupByUser={listGroupByUser} listVehicles={listVehiclesAvailable} />
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
              ? 'Thêm nhóm xe cho người dùng thành công'
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
