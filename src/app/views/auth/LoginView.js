import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  makeStyles,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid
} from '@material-ui/core';
import Page from 'src/app/components/Page';
import { clearMassageErrorAction, Login } from '../../../features/authSlice';
import { DRAFT_USER } from 'src/app/constant/config';
import { useDispatch, useSelector } from 'react-redux';
import MsgError from '../../components/MsgError';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',

    position: 'relative',
    overflow: 'hidden'
  },
  textLogo: { fontWeight: 'bold', fontSize: '28px', marginBottom: '30px' },
  leftTextLogo: { color: '#000000' },
  rightTextLogo: { color: '#8F0A0C' },
  textRight: {
    padding: '30px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    background: '#C62222',
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '100%',
  },
  textBottomPage: {
    color: '#BDBDBD',
    textAlign: 'center',
    width: '100%',
    marginTop: '18vh'
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isLoadingLogin_gs = useSelector(
    state => state.authSlice.isLoadingLogin
  );
  const failStatus_gs = useSelector(state => state.authSlice.failStatus);
  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isLogin_gs = useSelector(state => state.authSlice.isLogin);
  const [isHiddenMsg_ls, setHiddenMsgStatus] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin_gs) {
      if (dataLogin && dataLogin.is_delete === DRAFT_USER.id) {
        navigate('/waiting-confirm', { replace: true });
      } else navigate('/app/dashboard', { replace: true });
    }
  }, [isLogin_gs, navigate]);

  const handleCheckRememberMe = () => {
    setRememberMe(!rememberMe)
  }
  return (
    <Page className={classes.root} title="Đăng nhập">
      <Grid item xs={12} style={{height: '100%'}}>
        <Grid container justify="space-between"  style={{height: '100%'}}>
          <Grid lg={6} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="center"
            >
              <Container maxWidth="sm">
                <Formik
                  initialValues={{
                    phone: '',
                    password: ''
                  }}
                  validationSchema={Yup.object().shape({
                    phone: Yup.string()
	              .matches(new RegExp('^[0-9-+]{9,11}$'), 'Số điện thoại phải đúng định dạng')
                      .required('Bạn cần nhập số điện thoại'),
                    password: Yup.string()
                      .max(255)
                      .required('Bạn cần nhập mật khẩu')
                  })}
                  onSubmit={values => {
                    dispatch(clearMassageErrorAction());
                    setHiddenMsgStatus(false);
                    dispatch(Login(values));
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
                      <Box mb={3} style={{ textAlign: 'center' }}>
                        <div >
                          <img
                            alt="Logo"
                            src="/static/logo.png"
                            width={'246px'}
                            height={'112px'}
                          />
                          {/* <div className={classes.textLogo}>
                            <span className={classes.leftTextLogo}>VN</span>
                            <span className={classes.rightTextLogo}>CSS</span>
                          </div> */}
                        </div>
                        <Typography style={{ color: '#AE0000', fontSize: '28px', marginTop: '50px' }} variant="h2">
                          Đăng nhập
                        </Typography>
                        <br />
                        <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="body2"
                        >
                          Đăng nhập để sử dụng các tính năng quản lý của hệ
                          thống giám sát.
                        </Typography>
                      </Box>
                      <TextField
                        error={Boolean(touched.phone && errors.phone)}
                        fullWidth
                        helperText={touched.phone && errors.phone}
                        label="Số điện thoại"
                        margin="normal"
                        name="phone"
                        onBlur={e => {
                          handleBlur(e);
                          setHiddenMsgStatus(true);
                        }}
                        onChange={e => {
                          handleChange(e);
                          setHiddenMsgStatus(true);
                        }}
                        type="text"
                        value={values.phone}
                      />
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label="Mật khẩu"
                        margin="normal"
                        name="password"
                        onBlur={e => {
                          handleBlur(e);
                          setHiddenMsgStatus(true);
                        }}
                        onChange={e => {
                          handleChange(e);
                          setHiddenMsgStatus(true);
                        }}
                        type="password"
                        value={values.password}
                      />
                      <Typography
                        color={'error'}
                        variant={'subtitle1'}
                        align={'center'}
                      >
                        {!isHiddenMsg_ls && failStatus_gs && (
                          <MsgError content={failStatus_gs.message} />
                        )}
                      </Typography>
                      <Box my={2}>
                        <Grid container>
                          <Grid lg={6} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={rememberMe}
                                color="primary"
                                onChange={handleCheckRememberMe} 
                                name="rememberMe"
                              />}
                            label="Nhớ đăng nhập"
                          />
                          </Grid>
                          <Grid lg={6} md={6}
                            justify="flex-end"
                            style={{ 
                                display: 'inline-flex', 
                                verticalAlign: 'middle', 
                                alignItems: 'center', 
                                fontSize: '18px', 
                                fontWeight: '700', 
                                color: '#C62222', 
                                textAlign: 'right' 
                              }}
                            >
                            Quên mật khẩu ? 
                          </Grid>
                        </Grid>
                       
                      </Box>
                      <Box my={2}>
                        <Button
                          style={{ background: '#C62222', color: '#fff' }}
                          disabled={isLoadingLogin_gs}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Đăng nhập
                          {isLoadingLogin_gs && (
                            <div style={{ marginLeft: 20 }}>
                              <CircularProgress color={'secondary'} size={20} />
                            </div>
                          )}
                        </Button>
                      </Box>
                      <div className={classes.textBottomPage}>
                        Copyright © 2021  
                        <a target="_blank" href="https://vntech24h.com/"> 
                           Vntech24h JSC.
                        </a>
                         
                        All Rights Reserved.
                      </div>


                      {/* <Typography color="textSecondary" variant="body1">
                        Chưa có tài khoản{' '}
                        <Link
                          style={{ color: '#C62222' }}
                          component={RouterLink}
                          to={'/register'}
                          variant="h6"
                          onClick={() => setHiddenMsgStatus(true)}
                        >
                          Đăng ký !
                        </Link>
                      </Typography> */}
                    </form>
                  )}
                </Formik>
              </Container>
            </Box>
          </Grid>
          <Grid lg={6} md={6} style={{margin: 0, padding: 0, height: '100%'}}>
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="center"
            >
              <div style={{position: 'relative', height: '100%'}}>
                <img alt="Logo" src="/static/bg_login.jpeg" width={'100%'} height={'100%'} />
                <div className={classes.textRight} >
                  <span className={classes.textBottomRight}>
                    HỆ THỐNG GIÁM SÁT HÀNH TRÌNH VGPS
                  </span>
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default LoginView;
