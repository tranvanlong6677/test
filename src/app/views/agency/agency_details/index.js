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
  makeStyles,
  Slide,
  TextField
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import {
  ACTION_TABLE,
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';
import { MESSAGE } from 'src/app/constant/message';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ToolbarEdit from './ToolBar';
import LoadingComponent from 'src/app/components/Loading';
// import {
//   CreateUser,
//   resetChangeUpdateUser,
//   UpdateUser
// } from 'src/features/userSlice';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DetailsUser({ open, sendData, closeRef }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoadingUpdateUser = useSelector(
    //TODO : need remove ||false
    state => state.userSlice.isLoadingUpdateUser || false
  );
  const isChangeUpdateUser = useSelector(
    //TODO : need remove ||false
    state => state.userSlice.isChangeUpdateUser || false
  );

  const isLoadingCreateUser = useSelector(
    //TODO : need remove ||false
    state => state.userSlice.isLoadingCreateUser || false
  );
  const isChangeCreateUser = useSelector(
    state => state.userSlice.isChangeCreateUser
  );

  const [user, setUser] = useState(sendData.data);
  const [isEditUser] = useState(sendData.type);
  const [isLoading] = useState(false);

  useEffect(() => {
    if (
      isChangeUpdateUser !== STATUS_API.PENDING ||
      isChangeCreateUser !== STATUS_API.PENDIN
    ) {
      dispatch(showToast());
    }
  }, [isChangeUpdateUser, isChangeCreateUser]);

  const handleClose = isSaved => {
    if (!closeRef) return;
    closeRef();
  };

  const handleSubmit = data => {
    setUser(data);
    console.log(data);
    // if (isEditUser == ACTION_TABLE.CREATE) {
    //   dispatch(CreateUser(data));
    //   return;
    // }
    // dispatch(UpdateUser(data));
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <ToolbarEdit closeToolbarRef={handleClose} />
        </AppBar>
        {isLoadingUpdateUser || isLoadingCreateUser ? (
          <LoadingComponent />
        ) : (
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid
                item
                lg={12}
                md={12}
                xs={12}
                style={{
                  paddingTop: '50px',
                  pointerEvents: isEditUser ? '' : 'none'
                }}
              >
                <Card className={classes.shadowBox}>
                  <CardContent>
                    <Formik
                      initialValues={{ ...user }}
                      validationSchema={Yup.object().shape({
                        name: Yup.string()
                          .max(255)
                          .required('Tên không được để trống')
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
                          <Grid container spacing={1}>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Tên đại lý"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Tên đại lý"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Tên đại lý"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Tên đại lý"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                          <Box mt={5}>
                            <div className={classes.groupButtonSubmit}>
                              {isEditUser ? (
                                <div className="left-button">
                                  <div className={classes.wrapper}>
                                    <Button
                                      className={classes.styleInputSearch}
                                      style={{ marginRight: '10px' }}
                                      color="primary"
                                      size="large"
                                      type="submit"
                                      variant="contained"
                                    >
                                      {isEditUser == ACTION_TABLE.CREATE
                                        ? 'Tạo mới'
                                        : 'Cập nhật'}
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
                                    onClick={handleClose}
                                  >
                                    Thoát
                                  </Button>
                                </div>
                              ) : (
                                ''
                              )}
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
        )}

        {isChangeUpdateUser ? (
          <ToastMessage
            // callBack={() => dispatch(resetChangeUpdateUser())}
            message={
              isChangeUpdateUser == STATUS_API.SUCCESS
                ? MESSAGE.UPDATE_LOCATION_SUCCESS
                : MESSAGE.UPDATE_LOCATION_FAIL
            }
            type={
              isChangeUpdateUser == STATUS_API.SUCCESS
                ? messageToastType_const.success
                : messageToastType_const.error
            }
          />
        ) : (
          ''
        )}
        {isChangeCreateUser ? (
          <ToastMessage
            // callBack={() => dispatch(resetChangeUpdateUser())}
            message={
              isChangeCreateUser == STATUS_API.SUCCESS
                ? MESSAGE.CREATE_LOCATION_SUCCESS
                : MESSAGE.CREATE_LOCATION_FAIL
            }
            type={
              isChangeCreateUser == STATUS_API.SUCCESS
                ? messageToastType_const.success
                : messageToastType_const.error
            }
          />
        ) : (
          ''
        )}
      </Dialog>
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
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  groupButtonSubmit: {
    display: 'flex',
    justifyContent: 'space-between',
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

export default DetailsUser;
