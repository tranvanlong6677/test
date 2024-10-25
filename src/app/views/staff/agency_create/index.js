import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import {
  ACTION_TABLE,
  messageToastType_const,
  PHONE_REGEX,
  STATUS_API,
  VALIDATE
} from 'src/app/constant/config';
import { MESSAGE } from 'src/app/constant/message';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ToolbarEdit from '../ToolBar';
import LoadingComponent from 'src/app/components/Loading';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';
import Page from '../../../components/Page';
import Typography from '@material-ui/core/Typography';
import { AgencyMember } from '../../../model/AgencyMember';
import { AccountCircle } from '@material-ui/icons';
import { addMemberToAgency, resetChange } from '../../../../features/userSlice';
import CustomErrorMessage from '../../../components/CustomErrorMsg';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateStaffOfAgency() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const statusCreate = useSelector(state => state.userSlice.statusCreate);
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

  const handleSubmit = data => {
    dispatch(addMemberToAgency(data));
  };
  const [initValue] = useState(new AgencyMember());
  return (
    <div>
      <Page className={classes.root} title="Tạo mới Đại lý">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid
              item
              lg={12}
              md={12}
              xs={12}
              style={
                {
                  // paddingTop: '50px'
                  // pointerEvents: isEditUser ? '' : 'none'
                }
              }
            >
              <Card className={classes.shadowBox}>
                <Box className={classes.formHeader}>
                  <Typography variant={'h1'}>
                    Biểu mẫu tạo mới người dùng
                  </Typography>
                </Box>

                <CardContent>
                  <Formik
                    initialValues={initValue}
                    validationSchema={Yup.object().shape({
                      username: Yup.string()
                        .max(100)
                        .required('Tên đăng nhập không được để trống'),
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
                        .matches(VALIDATE.PHONE, 'Số điện thoại không hợp lệ')
                        .required('Số điện thoại không được để trống'),
                      full_name: Yup.string()
                        .max(100)
                        .required('Tên không được để trống'),
                      address: Yup.string()
                        .max(100)
                        .required('Địa chỉ không được để trống')
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
                            <InputLabel>Tên đầy đủ(*) : </InputLabel>
                            <TextField
                              error={Boolean(
                                touched.full_name && errors.full_name
                              )}
                              fullWidth
                              helperText={touched.full_name && errors.full_name}
                              margin="normal"
                              name="full_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.full_name}
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
                            <InputLabel>Đại chỉ(*) : </InputLabel>
                            <TextField
                              error={Boolean(touched.address && errors.address)}
                              fullWidth
                              helperText={touched.address && errors.address}
                              margin="normal"
                              name="address"
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
                          <Grid item md={6} xs={12}>
                            <InputLabel>Số điện thoại(*) : </InputLabel>
                            <TextField
                              error={Boolean(touched.phone && errors.phone)}
                              fullWidth
                              helperText={touched.phone && errors.phone}
                              margin="normal"
                              name="phone"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.phone}
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
                            <InputLabel>Email(*) : </InputLabel>
                            <TextField
                              error={Boolean(touched.email && errors.email)}
                              fullWidth
                              helperText={touched.email && errors.email}
                              margin="normal"
                              name="email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.email}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                )
                              }}
                              variant="outlined"
                            />
                          </Grid>{' '}
                          <Grid item md={6} xs={12}>
                            <InputLabel>Tên tài khoản(*) : </InputLabel>

                            <TextField
                              error={Boolean(
                                touched.username && errors.username
                              )}
                              fullWidth
                              helperText={touched.username && errors.username}
                              margin="normal"
                              name="username"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.username}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                )
                              }}
                              variant="outlined"
                            />
                          </Grid>{' '}
                          <Grid item md={3} xs={12}>
                            <InputLabel>Mật khẩu(*) : </InputLabel>

                            <TextField
                              error={Boolean(
                                touched.password && errors.password
                              )}
                              fullWidth
                              helperText={touched.password && errors.password}
                              margin="normal"
                              name="password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.password}
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
                            <InputLabel>Xác nhận lại mật khẩu(*) : </InputLabel>

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
                              name="confirm_password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.confirm_password}
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
                        </Grid>
                        <CustomErrorMessage content={err} />
                        <Box mt={5}>
                          <div className={classes.groupButtonSubmit}>
                            <div className={classes.wrapper}>
                              <Button
                                className={classes.styleInputSearch}
                                style={{ marginRight: '10px' }}
                                color="primary"
                                size="large"
                                type="submit"
                                variant="contained"
                              >
                                Lưu
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
                </CardContent>
                <Divider />
              </Card>
            </Grid>
          </Grid>
        </Container>
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
      </Page>
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

export default CreateStaffOfAgency;
