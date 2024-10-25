import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  Divider,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  Slide,
  TextField
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { useNavigate } from 'react-router-dom';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { MESSAGE } from 'src/app/constant/message';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';
import { Agency } from '../../../model/Agency';
import { AccountCircle } from '@material-ui/icons';
import { resetChange } from '../../../../features/userSlice';
import CustomErrorMessage from '../../../components/CustomErrorMsg';
import { getListProvinces } from 'src/features/provinceSlice';
import { VpnKey, Phone, Business, Email } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { createAgency, getListAgencyBusiness } from 'src/features/agencySlice';
import { Database } from 'react-feather';

function CreateAgencyForm({ closeRef, agency = null }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const statusCreate = useSelector(state => state.userSlice.statusCreate);
  const listProvinces = useSelector(state => state.provinceSlice.listProvinces);
  const listAgencyBusiness = useSelector(state => state.agencySlice.listAgencyBusiness);
  const err = useSelector(state => state.userSlice.err);

  const [isLoading] = useState(false);

  useEffect(() => {
    if (
      statusCreate === STATUS_API.SUCCESS ||
      statusCreate === STATUS_API.ERROR
    ) {
      dispatch(showToast());
    }
  }, [statusCreate]);

  useEffect(() => {
    dispatch(getListProvinces());
    dispatch(getListAgencyBusiness());
  }, [dispatch]);

  const handleSubmit = data => {
    let newData = {
      agency_name: data.agency_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      full_name: data.full_name,
      province_id: data.province_id,
      business_id: data.business_id
    };
    dispatch(createAgency(newData));
    closeRef();
    // navigate('/app/agency')
  };
  const [initValue] = useState(new Agency());
  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          agency_name: Yup.string()
            .max(100)
            .required('Tên không được để trống'),
          password: Yup.string()
            .max(100)
            .required('Mật khẩu không được để trống'),
          confirm_password: Yup.string()
            .oneOf(
              [Yup.ref('password'), null],
              'Mật khẩu chưa khớp'
            )
            .required('Xác nhận lại mật khẩu'),
          email: Yup.string()
            .email('Email chưa đúng định dạng')
            .required('email không được để trống'),
          phone: Yup.string()
            .matches(
              /^(84|0[3|5|7|8|9])+([0-9]{8})$/,
              'Số điện thoại chưa đúng định dạng'
            )
            .required('Số điện thoại không được để trống'),
          full_name: Yup.string()
            .max(100)
            .required('Tên không được để trống'),
          province_id: Yup.number()
            .max(100)
            .required('Địa chỉ không được để trống'),
          business_id: Yup.number().max(100).required('Vui lòng chọn loại hình kinh doanh')
        })}
        onSubmit={handleSubmit}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            touched,
            values
          }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputLabel>Tên xí nghiệp <span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.agency_name && errors.agency_name
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.agency_name && errors.agency_name}
                  margin="normal"
                  name="agency_name"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.agency_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Tên chủ xí nghiệp <span style={{ color: 'red' }}>*</span> : </InputLabel>
                <TextField
                  error={Boolean(
                    touched.full_name && errors.full_name
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.full_name && errors.full_name}
                  margin="normal"
                  name="full_name"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.full_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Địa chỉ <span style={{ color: 'red' }}>*</span>: </InputLabel>
                {listProvinces && <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={listProvinces}
                  size="small"
                  getOptionLabel={option => option.name}
                  renderOption={(option) => (
                    <React.Fragment>
                      <span> </span>
                      {option.name}
                    </React.Fragment>
                  )}
                  name="province_id"
                  onChange={(e, value) => setFieldValue('province_id', value.id)}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="input-no-fieldset"
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps, type: 'search'
                      }}
                    />
                  )}
                />}
              </Grid>
              <Grid item md={6} xs={12}>
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
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Email <span style={{ color: 'red' }}>*</span>: </InputLabel>
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
                  variant="outlined"
                />
              </Grid>{' '}
              <Grid item md={3} xs={12}>
                <InputLabel>Mật khẩu <span style={{ color: 'red' }}>*</span>: </InputLabel>

                <TextField
                  error={Boolean(
                    touched.password && errors.password
                  )}
                  fullWidth
                  helperText={touched.password && errors.password}
                  margin="normal"
                  className="input-no-fieldset"
                  name="password"
                  type="password"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <InputLabel>Xác nhận lại mật khẩu <span style={{ color: 'red' }}>*</span>: </InputLabel>

                <TextField
                  error={Boolean(
                    touched.confirm_password &&
                    errors.confirm_password
                  )}
                  fullWidth
                  helperText={
                    touched.confirm_password &&
                    errors.confirm_password
                  }
                  margin="normal"
                  className="input-no-fieldset"
                  name="confirm_password"
                  size="small"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirm_password}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Loại hình kinh doanh <span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(touched.business_id && errors.business_id)}
                  className="input-no-fieldset"
                  size="small"
                  fullWidth
                  select
                  helperText={touched.business_id && errors.business_id}
                  margin="normal"
                  name="business_id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.business_id}
                  SelectProps={{
                    native: true
                  }}
                  variant="outlined"
                >
                  <option>Chọn loại hình kinh doanh</option>
                  {listAgencyBusiness && listAgencyBusiness.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <CustomErrorMessage content={err} />
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
                  {isLoading && (
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

      {Boolean(
        statusCreate === STATUS_API.SUCCESS ||
        statusCreate === STATUS_API.ERROR
      ) && (
        <ToastMessage
          callBack={() => dispatch(resetChange())}
          message={
            statusCreate === STATUS_API.SUCCESS
              ? MESSAGE.CREATE_USER_SUCCESS
              : MESSAGE.CREATE_USER_FAIL
          }
          type={
            statusCreate === STATUS_API.SUCCESS
              ? messageToastType_const.success
              : messageToastType_const.error
          }
        />
      )}
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

export default CreateAgencyForm;
