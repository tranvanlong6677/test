import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  Typography,
  MenuItem,
  Chip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  ACTION_TABLE,
  messageToastType_const,
  STATUS_API,
  DEVICE_STATUS
} from '../../../constant/config';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import LoadingComponent from '../../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import ToastMessage from '../../../components/ToastMessage';
import { resetChange } from '../../../../features/vehicleSlice';
import { getListDevice } from 'src/features/deviceSlice';
import { MESSAGE } from '../../../constant/message';
import { showToast } from '../../../../features/uiSlice';
import {
  setActiveStep,
  setObjectCreating,
  updateDevice,
  activeDevice
} from '../../../../features/deviceSlice';
import { getListAgencies } from 'src/features/agencySlice';

Step1.propTypes = {
  isLoading: PropTypes.bool,
  isEditDevice: PropTypes.bool.isRequired,
  device: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    status: PropTypes.number,
    sim_serial: PropTypes.string,
    mfg: PropTypes.string,
    device_type_id: PropTypes.bool,
    serial: PropTypes.string,
    vehicle_license_plate_exists: PropTypes.bool,
    vehicle_license_plate: PropTypes.string,
    customer_id: PropTypes.string
  }),
  sendDate: PropTypes.object,
  closeRef: PropTypes.func.isRequired
};
const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

function Step1({ isLoading, isEditDevice, sendData, closeRef, open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSubmitted, setSubmit] = React.useState(false);
  const err = useSelector(state => state.deviceSlice.err);
  const statusCreate = useSelector(state => state.deviceSlice.statusCreate);
  const statusActive = useSelector(state => state.deviceSlice.statusActive);
  const statusUpdate = useSelector(state => state.deviceSlice.statusUpdate);
  const objectCreating = useSelector(state => state.deviceSlice.objectCreating);
  const listAgencies = useSelector(state => state.agencySlice.listAgencies);
  const listDevice = useSelector(state => state.deviceSlice.listDevice);
  const [openSelectDevice, setOpenSelectDevice] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const loadingSelectDevice = openSelectDevice && devices.length === 0;

  const getStatusDevice = status => {
    switch (status) {
      case DEVICE_STATUS.ACTIVE:
        return <Chip label={'Đã Kích hoạt'} variant="outlined" size="small" color='primary' />;
      case DEVICE_STATUS.INACTIVE:
        return <Chip label={'Chưa Kích hoạt'} variant="outlined" size="small" color='default' />;
      default:
        return '-';
    }
  };

  const [device, setDevice] = useState(isEditDevice ? sendData.data : objectCreating);
  const [params, setParams] = useState({
    is_pagination: false
  });
  const handleSubmit = data => {
    console.log("12312");
    console.log(data);
    setDevice(data);
    dispatch(setObjectCreating(data));
    dispatch(activeDevice(data));
    handleClose();
  };

  useEffect(() => {
    if (
      (statusUpdate && statusUpdate !== STATUS_API.PENDING) ||
      (statusCreate && statusCreate !== STATUS_API.PENDING) ||
      (statusActive && statusActive !== STATUS_API.PENDING)
    ) {
      dispatch(showToast());
    }
  }, [statusUpdate || statusCreate || statusActive]);

  useEffect(() => {
    dispatch(getListAgencies());
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!loadingSelectDevice) {
      return undefined;
    }

    (async () => {
      const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
      const countries = await response.json();

      if (active) {
        setDevices(Object.keys(countries).map((key) => countries[key].item[0]));
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingSelectDevice]);

  React.useEffect(() => {
    if (!openSelectDevice) {
      setDevices([]);
    }
  }, [openSelectDevice]);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...device }}
        validationSchema={Yup.object().shape({
          agency_id: Yup.number()
            .max(100)
            .required('Vui lòng chọn đại lí'),
          device_id: Yup.number()
            .required('string không được để trống'),
          vehicle_license_plate: Yup.string()
            .max(100)
            .required('Biển số không được để trống')
        })}
        onSubmit={handleSubmit}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            setFieldValue,
            handleSubmit,
            touched,
            values
          }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              <Grid item md={6} xs={6}>
                <InputLabel>Xí nghiệp <span className="text-danger">*</span> :</InputLabel>
                <TextField
                  error={Boolean(touched.agency_id && errors.agency_id)}
                  className="input-no-fieldset"
                  size="small"
                  fullWidth
                  select
                  helperText={touched.agency_id && errors.agency_id}
                  margin="normal"
                  name="agency_id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  SelectProps={{
                    native: true
                  }}
                  value={values.agency_id}
                  variant="outlined"
                >
                  <option>Chọn đại lý</option>
                  {listAgencies && listAgencies.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={6}>
                <InputLabel>Loại phương tiện:</InputLabel>
                {listDevice && <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  size="small"
                  disableClearable
                  options={listDevice}
                  getOptionLabel={option => option.serial}
                  renderOption={(option) => (
                    <React.Fragment>
                      <span style={{ marginRight: '1em' }}>{getStatusDevice(option.status)} </span>
                      {option.serial}
                    </React.Fragment>
                  )}
                  name="device_id"
                  onChange={(e, value) => setFieldValue('device_id', value.id)}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      className="input-no-fieldset"
                      variant="outlined"
                      InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                  )}
                />}
              </Grid>
              <Grid item md={6} xs={6}>
                <InputLabel>Serial thiết bị <span className="text-danger">*</span> :</InputLabel>
                {listDevice && <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  size="small"
                  disableClearable
                  options={listDevice}
                  getOptionLabel={option => option.serial}
                  renderOption={(option) => (
                    <React.Fragment>
                      <span style={{ marginRight: '1em' }}>{getStatusDevice(option.status)} </span>
                      {option.serial}
                    </React.Fragment>
                  )}
                  name="device_id"
                  onChange={(e, value) => setFieldValue('device_id', value.id)}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="input-no-fieldset"
                      label="Tìm và chọn thiết bị"
                      margin="normal"
                      variant="outlined"
                      InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                  )}
                />}
              </Grid>
              <Grid item md={6} xs={6}>
                <InputLabel>Sim seri:</InputLabel>
                <TextField
                  size="small"  
                  className="input-no-fieldset"
                  fullWidth
                  // label="Phiên bản"
                  margin="normal"
                  name="sim_serial"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sim}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Biển số xe <span className="text-danger">*</span> :</InputLabel>
                <TextField
                  size="small"  
                  className="input-no-fieldset"
                  error={Boolean(touched.vehicle_license_plate && errors.vehicle_license_plate)}
                  fullWidth
                  helperText={touched.vehicle_license_plate && errors.vehicle_license_plate}
                  // label="Phiên bản"
                  margin="normal"
                  name="vehicle_license_plate"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.vehicle_license_plate}
                  variant="outlined"
                />
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
            <Box my={2} mt={5}>
              <div className={classes.groupButtonSubmit}>
                {Boolean(isEditDevice) && (
                  <div className="left-button">
                    <div className={classes.wrapper}>
                      <Button
                        className="btn-main btn-plain mx-3"
                        size="large"
                        variant="contained"
                        onClick={handleClose}
                      >
                        Thoát
                      </Button>
                      <Button
                        className="btn-main mx-3"
                        style={{ marginRight: '10px' }}
                        color="primary"
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        {isEditDevice == ACTION_TABLE.CREATE
                          ? 'Kích hoạt'
                          : 'Cập nhật'}
                      </Button>
                      {isLoading && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                    
                  </div>
                )}
              </div>
            </Box>
          </form>
        )}
      </Formik>
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
    </React.Fragment>
  );
}

export const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  shadowBox: {
    paddingTop: '30px',
    boxShadow: '0 2px 5px rgba(0,0,0,.18)'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  groupButtonSubmit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // justifyItems: 'center',
    marginTop: '10px',
    '& .left-button': {
      display: 'flex'
    }
  },
  avatar: {
    height: 100,
    width: 100
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  wrapper: {
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  disableForm: {
    pointerEvents: 'none'
  },
  colorWhite: {
    color: '#fff'
  }
}));

export default Step1;
