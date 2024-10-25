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
import ToolbarEdit from '../ToolBar';
import LoadingComponent from 'src/app/components/Loading';
import { showToast } from 'src/features/uiSlice';
import ToastMessage from 'src/app/components/ToastMessage';
import Page from '../../../components/Page';
import Typography from '@material-ui/core/Typography';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateDriver() {
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

  const [isLoading] = useState(false);

  useEffect(() => {
    if (
      isChangeUpdateUser !== STATUS_API.PENDING ||
      isChangeCreateUser !== STATUS_API.PENDING
    ) {
      dispatch(showToast());
    }
  }, [isChangeUpdateUser, isChangeCreateUser]);

  const handleSubmit = data => {
    // setUser(data);
    console.log(data);
    // if (isEditUser == ACTION_TABLE.CREATE) {
    //   dispatch(CreateUser(data));
    //   return;
    // }
    // dispatch(UpdateUser(data));
  };

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
                  <Typography variant={'h1'}>Biểu mẫu tạo lái xe</Typography>
                </Box>

                <CardContent>
                  <Formik
                    initialValues={{
                      license_plate: ''
                    }}
                    validationSchema={Yup.object().shape({
                      //TODO: add shape here
                      license_plate: Yup.string()
                        .max(100)
                        .required('Biển số phương tiện không được để trống')
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
                            <TextField
                              error={Boolean(
                                touched.license_plate && errors.license_plate
                              )}
                              fullWidth
                              helperText={
                                touched.license_plate && errors.license_plate
                              }
                              label="Biển số xe"
                              margin="normal"
                              name="license_plate"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.license_plate}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <TextField
                              error={Boolean(
                                touched.license_plate && errors.license_plate
                              )}
                              fullWidth
                              helperText={
                                touched.license_plate && errors.license_plate
                              }
                              label="Tên xe"
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
                              error={Boolean(
                                touched.license_plate && errors.license_plate
                              )}
                              fullWidth
                              helperText={
                                touched.license_plate && errors.license_plate
                              }
                              label="Tên xe"
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
                              error={Boolean(
                                touched.license_plate && errors.license_plate
                              )}
                              fullWidth
                              helperText={
                                touched.license_plate && errors.license_plate
                              }
                              label="Biển số xe"
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

export default CreateDriver;
