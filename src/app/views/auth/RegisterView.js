import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import Page from 'src/app/components/Page';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearMassageErrorAction,
  finishRegisterAction,
  Register
} from '../../../features/authSlice';
import ToastMessage from '../../components/ToastMessage';
import { messageToastType_const, userShape_const } from '../../constant/config';
import { showToast } from '../../../features/uiSlice';
import * as Yup from 'yup';
import MsgError from '../../components/MsgError';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoadingRegister_gs = useSelector(
    state => state.authSlice.isLoadingRegister
  );
  const failRegisterStatus_gs = useSelector(
    state => state.authSlice.failRegisterStatus
  );
  // const dataRegister_gs = useSelector(state=>state.authSlice.dataRegister)
  const isRegisterSuccess_gs = useSelector(
    state => state.authSlice.isRegisterSuccess
  );
  const isShowToast_gs = useSelector(state => state.uiSlice.isShowToast);
  const [isHiddenMsg_ls, setIsHiddenMsg] = useState(false);

  useEffect(() => {
    if (isRegisterSuccess_gs) {
      dispatch(showToast());
      setIsHiddenMsg(true);
    }
  }, [isRegisterSuccess_gs, dispatch]);

  return (
    <Page className={classes.root} title="Đăng ký">
      {isRegisterSuccess_gs && isShowToast_gs && (
        <ToastMessage
          type={messageToastType_const.success}
          callBack={() => {
            dispatch(finishRegisterAction());
            navigate('/login');
          }}
          message={
            'Đăng ký tài khoản thành công, Bạn sẽ được chuyển sang đăng nhập '
          }
        />
      )}
      <Box
        display="flex"
        flexDirection="column"
        // height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              full_name: '',
              phone: '',
              password: '',
              address: ''
            }}
            validationSchema={Yup.object().shape(userShape_const)}
            onSubmit={values => {
              // edit values format
              dispatch(Register(values));
              dispatch(clearMassageErrorAction());
              setIsHiddenMsg(false);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h1">
                    Trang đăng ký tài khoản
                  </Typography>
                  <br />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Xin chào đến với Vncss admin
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
                  type="text"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.full_name && errors.full_name)}
                  fullWidth
                  helperText={touched.full_name && errors.full_name}
                  label="Họ tên đầy đủ"
                  margin="normal"
                  name="full_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.full_name}
                  variant="outlined"
                />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      label="Số điện thoại"
                      margin="normal"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Mật khẩu"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />

                <TextField
                  error={Boolean(touched.address && errors.address)}
                  fullWidth
                  helperText={touched.address && errors.address}
                  label="Địa chỉ"
                  margin="normal"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  variant="outlined"
                />

                <Typography
                  color={'error'}
                  variant={'subtitle1'}
                  align={'center'}
                >
                  {!isHiddenMsg_ls && failRegisterStatus_gs && (
                    <MsgError content={failRegisterStatus_gs.message} />
                  )}
                </Typography>
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isLoadingRegister_gs}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Đăng ký{' '}
                    {isLoadingRegister_gs && (
                      <div style={{ marginLeft: 20 }}>
                        <CircularProgress color={'primary'} size={20} />
                      </div>
                    )}
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Đã có tài khoản?{' '}
                  <Link component={RouterLink} to={'/login'} variant="h6">
                    Đăng nhập !
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
