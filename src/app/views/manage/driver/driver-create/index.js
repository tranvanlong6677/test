import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  TextField,
  Chip,
  CircularProgress,
  Select,
  MenuItem
} from '@material-ui/core';
import { connect } from "react-redux";
import { green } from '@material-ui/core/colors';
import { useNavigate } from 'react-router-dom';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { AccountCircle } from '@material-ui/icons';
import { getListProvinces } from 'src/features/provinceSlice';
import { VpnKey, Phone, Email } from '@material-ui/icons';
import { getListAgencies } from 'src/features/agencySlice';
import { createStaff, getListStaff, resetChange } from 'src/features/staffSlice';
import { addDriver, getListDriverLicenseType, getListDriver } from 'src/features/driverSlice';
import { Driver } from 'src/app/model/Driver';
import moment from 'moment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CreateDriverForm({ closeRef }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const error = useSelector(state => state.driverSlice.errors);
  const statusCreate = useSelector(state => state.driverSlice.statusCreate);
  const listAgencies = useSelector(state => state.agencySlice.listAgencies);
  const listDriverLicenseType = useSelector(state => state.driverSlice.listDriverLicenseType);

  const [listAgenciesSelect, setListAgenciesSelect] = useState([]);
  const [initValue, setInitValue] = useState(new Driver());

  const handleSubmit = data => {
    dispatch(addDriver(data));
    setInitValue(data);
  };

  useEffect(() => {
    dispatch(getListDriverLicenseType());
  }, [dispatch]);

  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(100)
            .required('Tên không được để trống'),
          email: Yup.string()
            .email('Email chưa đúng định dạng')            
            .required('Email không được để trống'),
          phone: Yup.string()
            .matches(
              /^(84|0[3|5|7|8|9])+([0-9]{8})$/,
              'Số điện thoại chưa đúng định dạng'
            )
            .required('Số điện thoại không được để trống'),
          address: Yup.string()
              .max(100)
              .required('Địa chỉ không được để trống'),
          license_number: Yup.string()
              .max(100)
              .required('Số GPLX không được để trống'),
          license_type: Yup.string()
              .max(10)
              .required('Loại bằng lái không được để trống'),
          license_expire_date: Yup.date()
            .required('Ngày hết hạn không được để trống'),
          license_issue_date: Yup.date()
            .required('Ngày cấp bằng không được để trống'),
          date_of_birth: Yup.date()              
            .required('Ngày sinh không được để trống'),
          cmnd: Yup.string()
            .max(12)
            .required('Số chứng minh/ căn cước công dân không để trống'),

        })}
        onSubmit={handleSubmit}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values
          }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputLabel>Tên lái xe<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.name && errors.name
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.name && errors.name}
                  margin="normal"
                  name="name"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Số CCCD/CMT<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.cmnd && errors.cmnd
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.cmnd && errors.cmnd}
                  margin="normal"
                  name="cmnd"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cmnd}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
              <InputLabel> Ngày sinh: </InputLabel> 
                <TextField
                    format="DD/MM/yyyy"
                    fullWidth
                    helperText={touched.date_of_birth && errors.date_of_birth}
                    id="date"
                    margin="normal"
                    name="date_of_birth"
                    type="date"
                    className="input-no-fieldset"
                    defaultValue=""
                    value={values.date_of_birth}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    />
              </Grid>
              <Grid item md={2} xs={12}>
                  <InputLabel> Giới tính: </InputLabel> 
                  <TextField
                    id="outlined-select-gender"
                    className="input-no-fieldset"
                    margin="normal"
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    helperText={touched.gender && errors.gender}
                  >
                    <MenuItem key={'male'} value={'male'}>Nam</MenuItem>
                    <MenuItem key={'female'} value={'female'}>Nữ</MenuItem>
                  </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Email: </InputLabel>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  margin="normal"
                  className="input-no-fieldset"
                  name="email"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>{' '}
              <Grid item md={3} xs={12}>
                <InputLabel>Số giấy phép lái xe<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.license_number && errors.license_number
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.license_number && errors.license_number}
                  margin="normal"
                  name="license_number"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.license_number}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <InputLabel>Số điện thoại <span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(touched.phone && errors.phone)}
                  fullWidth
                  className="input-no-fieldset"
                  helperText={touched.phone && errors.phone}
                  margin="normal"
                  size="small"
                  name="phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Địa chỉ<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.address && errors.address
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.address && errors.address}
                  margin="normal"
                  name="address"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                  <InputLabel> Ngày cấp bằng lái: </InputLabel> 
                  <TextField
                      format="DD/MM/yyyy"
                      helperText={touched.license_issue_date && errors.license_issue_date}
                      id="date"
                      margin="normal"
                      name="license_issue_date"
                      type="date"
                      className="input-no-fieldset"
                      defaultValue=""
                      value={values.license_issue_date}
                      onChange={handleChange}
                      size="small"
                      variant="outlined"
                      />
              </Grid>
              <Grid item md={3} xs={12}>
                  <InputLabel> Ngày hết hạn bằng lái: </InputLabel> 
                  <TextField
                      format="DD/MM/yyyy"
                      id="date"
                      margin="normal"
                      helperText={touched.license_expire_date && errors.license_expire_date}
                      type="date"
                      name="license_expire_date"
                      className="input-no-fieldset"
                      defaultValue=""
                      value={values.license_expire_date}
                      onChange={handleChange}
                      size="small"
                      variant="outlined"
                      />
              </Grid>
              <Grid item md={6} xs={12}>
                  <InputLabel> Loại bằng: </InputLabel> 
                  <TextField
                    id="outlined-select-license_type"
                    className="input-no-fieldset"
                    margin="normal"
                    fullWidth
                    select
                    size="small"
                    variant="outlined"
                    name="license_type"
                    value={values.license_type}
                    onChange={handleChange}
                    helperText={touched.license_type && errors.license_type}
                  >
                    {
                      listDriverLicenseType && listDriverLicenseType.payload.driver_license_type.map((item, index) => {
                        return (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                        )
                      })
                    }
                  </TextField>
              </Grid>
            </Grid>
            <Box my={3}>
              <div className={classes.groupButtonSubmit}>
                <div className={classes.wrapper}>
                  <Button
                    style={{ marginRight: '10px', textTranform: 'none !important' }}
                    onClick={() => closeRef()}
                    className="btn-main btn-plain mx-3"
                    color="primary"
                    size="large"
                    variant="contained"
                  >
                    Thoát
                  </Button>
                  <Button
                    style={{ marginRight: '10px', textTranform: 'none !important' }}
                    className="btn-main mx-3"
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Thêm mới
                  </Button>
                  {statusCreate === STATUS_API.PENDING && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </div>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  shadowBox: {
    boxShadow: '0 2px 5px rgba(0,0,0,.18)'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  formHeader: {
    padding: theme.spacing(3)
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
    marginTop: '15px',

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

export default CreateDriverForm;
