import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import {
  CREATE_DEVICE_STEP,
  messageToastType_const,
  STATUS_API
} from '../../../constant/config';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingComponent from '../../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import ToastMessage from '../../../components/ToastMessage';
import { resetChange } from '../../../../features/vehicleSlice';
import { MESSAGE } from '../../../constant/message';
import { showToast } from '../../../../features/uiSlice';
import {
  activeDevice,
  setActiveStep,
  setObjectCreating 
} from '../../../../features/deviceSlice';
import { useStyles } from './Step1';
import AutoCompleteOffline from '../../../components/AutoCompleteOffline';
import { getListAgency } from '../../../../features/userSlice';
import { 
  getVehicleByOwnerId, 
  setUserSelected,
  setSelectedLicensePlate
} from '../../../../features/vehicleSlice';

Step2.propTypes = {
  isLoading: PropTypes.bool,
  isEditDevice: PropTypes.bool.isRequired,
  device: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    serial: PropTypes.string,
    version: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.number
  }),
  sendDate: PropTypes.object,
  closeRef: PropTypes.func.isRequired
};

function Step2({ isLoading, isEditDevice, sendData, closeRef, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSubmitted, setSubmit] = React.useState(false);
  const err = useSelector(state => state.deviceSlice.err);
  const statusCreate = useSelector(state => state.deviceSlice.statusCreate);
  const statusUpdate = useSelector(state => state.deviceSlice.statusUpdate);

  const objectCreating = useSelector(state => state.deviceSlice.objectCreating);

  const listAgency = useSelector(state => state.userSlice.listAgency);
  const listVehicle = useSelector(state => state.vehicleSlice.listVehicle);
  const userSelected = useSelector(state => state.vehicleSlice.userSelected);
  const selectedLicensePlate = useSelector(state => state.vehicleSlice.selectedLicensePlate);

  const statusGetListAgency = useSelector(
    state => state.userSlice.statusGetAll
  );
  const [device, setDevice] = useState(objectCreating);

  const [chooseUser, setChooseUser] = React.useState(userSelected?.id ?? null);
  const [chooseBsx, setChooseLicensePlate] = React.useState(selectedLicensePlate?.license_plate ?? null);
  const [vehicle_license_plate_exists, setExist] = React.useState(true);
 
  const onSendBsx = value => {
    dispatch(setSelectedLicensePlate(value))

    value?.license_plate ? setChooseLicensePlate(value.license_plate) : setChooseLicensePlate(null);
  };

  const onSendUser = value => {
    if (value?.id) {
      dispatch(setUserSelected(value))

      setChooseUser(value.id);
      dispatch(getVehicleByOwnerId({ id: value.id }));
    } else {
      setChooseLicensePlate(null);
      setChooseUser(null);
    }
  };

  const handleChange = e => {
    setChooseLicensePlate(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!chooseUser || !chooseBsx) alert('chưa đủ thông tin');
    else {
      // console.log({
      //   ...objectCreating,
      //   device_type_id: 1,
      //   customer_id: parseInt(chooseUser),
      //   vehicle_license_plate: chooseBsx,
      //   vehicle_license_plate_exists: vehicle_license_plate_exists
      // })
      // let objCreated = {
      //   ...objectCreating,
      //   device_type_id: 1,
      //   customer_id: parseInt(chooseUser),
      //   vehicle_license_plate: chooseBsx,
      //   vehicle_license_plate_exists: vehicle_license_plate_exists
      // };
      // dispatch(setObjectCreating(objCreated));
      // dispatch(activeDevice(objCreated));
    
    }
  };

  const handleExist = () => {
    setExist(!vehicle_license_plate_exists)
    dispatch(setSelectedLicensePlate(null))
  }


  useEffect(() => {
    if (
      (statusUpdate && statusUpdate !== STATUS_API.PENDING) ||
      (statusCreate && statusCreate !== STATUS_API.PENDING)
    ) {
      dispatch(showToast());
    }
  }, [statusUpdate || statusCreate]);
  useEffect(() => {
    if (sendData && sendData.data.user) {
      const { id } = sendData.data.user
      const { license_plate } = sendData.data.vehicle

      setChooseUser(id);

      setChooseLicensePlate(license_plate)

      dispatch(getVehicleByOwnerId({ id }));

      
    }
    if (!listAgency || (listAgency && listAgency.length === 0))
      dispatch(getListAgency());
  }, [dispatch]);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid
          item
          lg={12}
          md={12}
          xs={12}
          style={{
            pointerEvents: isEditDevice ? '' : 'none'
          }}
        >
          <Card className={classes.shadowBox}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/*========================user ===========================*/}
                <Grid container spacing={3}>
                  <Grid item xs={0} md={2} />

                  <Grid item xs={2}>
                    <Typography id="vehicle-device" variant={'h5'}>
                      Người dùng:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={6}>
                    {listAgency && (
                      <AutoCompleteOffline
                        value={isEditDevice &&  sendData.data.user ? sendData.data.user : userSelected}
                        options={listAgency}
                        labelDisplay={'phone'}
                        placeHoldInput={'Gõ số điện thoại người dùng'}
                        primaryProperRender={'phone'}
                        defaultValue={'334'}
                        secondaryProperRender={'full_name'}
                        handleSendValue={onSendUser}
                      />
                    )}
                  </Grid> 
                </Grid>
                {/*=========================type =============================*/}
                <Grid
                  container
                  spacing={3}
                  style={{ justifyContent: 'center', margin: 20 }}
                >
                  <Grid item id="vehicle-device" variant={'h5'}>
                    Xe đã tồn tại:
                  </Grid>

                  <Box style={{ display: 'flex', justifyContent: 'start' }}>
                    <FormControl
                      variant="outlined"
                      style={{
                        width: '100%',
                        marginLeft: 0,
                        marginTop: 0
                      }}
                    >
                      <Checkbox
                        checked={vehicle_license_plate_exists}
                        onChange={handleExist}

                        name="checkBsx"
                        color="primary"
                      />
                    </FormControl>
                  </Box>
                </Grid>
                {/*=========================bsx============================*/}
                <Grid container spacing={3}>
                  <Grid item xs={0} md={2} />
                  <Grid item xs={2}>
                    <Typography variant={'h5'} id="user-device">
                      Biển số xe:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={6}>
                    {vehicle_license_plate_exists ?  (
                      <AutoCompleteOffline
                        value={isEditDevice &&  sendData.data.vehicle ? sendData.data.vehicle : selectedLicensePlate}
                        options={listVehicle}
                        labelDisplay={'license_plate'}
                        placeHoldInput={'Chọn biển số xe hoặc bỏ tick để thêm biển số xe mới'}
                        primaryProperRender={'license_plate'}
                        handleSendValue={onSendBsx}
                      />
                    ) : (
                      <TextField
                        name={'vehicle_license_plate'}
                        fullWidth
                        placeholder={'Nhập biển số xe'}
                        onChange={handleChange}
                      />
                    )}
                  </Grid>
                </Grid>

                {err && isSubmitted && (
                  <Typography
                    color={'error'}
                    variant={'subtitle1'}
                    style={{ marginTop: 30 }}
                  >
                    {err}
                  </Typography>
                )}
                <Box my={12} mt={5}>
                  <div className={classes.groupButtonSubmit}>
                    {Boolean(isEditDevice) && (
                      <div className="left-button">
                        <div className={classes.wrapper}>
                          <Button
                            size="large"
                            onClick={() => {
                                dispatch(
                                  setActiveStep(
                                    CREATE_DEVICE_STEP.ADD_INFO_DEVICE
                                  )
                                );
                            }}
                          >
                            Trở lại
                          </Button>
                          <Button
                            className={classes.styleInputSearch}
                            style={{
                              marginRight: '10px',
                              marginLeft: '10px'
                            }}
                            color="primary"
                            size="large"
                            type="submit"
                            variant="contained"
                          >
                            Hoàn thành
                          </Button>
                          {isLoading && (
                            <CircularProgress
                              size={24}
                              className={classes.buttonProgress}
                            />
                          )}
                        </div>
                        <Button
                          size="large"
                          variant="contained"
                          onClick={() => handleClose()}
                        >
                          Thoát
                        </Button>
                      </div>
                    )}
                  </div>
                </Box>
              </form>
            </CardContent>
            <Divider />
          </Card>
        </Grid>
      </Grid>

      {statusUpdate === STATUS_API.SUCCESS ||
      (statusUpdate === STATUS_API.ERROR && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusUpdate === STATUS_API.SUCCESS
              ? MESSAGE.UPDATE_DEVICE_SECCESS
              : err
          }
          type={
            statusUpdate === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      ))}

      {statusCreate === STATUS_API.SUCCESS ||
      (statusCreate === STATUS_API.ERROR && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusCreate === STATUS_API.SUCCESS
              ? MESSAGE.CREATE_DEVICE_SUCCESS
              : err
          }
          type={
            statusCreate === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      ))}
    </React.Fragment>
  );
}

export default Step2;
