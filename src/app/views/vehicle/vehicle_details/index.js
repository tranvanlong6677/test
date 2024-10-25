import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Dialog,
  Divider,
  Grid,
  makeStyles,
  Slide,
  Tab,
  Tabs
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import ToolBarEdit from 'src/app/views/device/device_details/ToolBar';
import LoadingComponent from 'src/app/components/Loading';
import Proptypes from 'prop-types';
import {
  AddAlarm,
  CameraAltOutlined,
  DateRange,
  ImageOutlined,
  SpeakerNotesTwoTone,
  TableChart
} from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { MapPin, PhoneOutgoing, User, Volume } from 'react-feather';
import ImageItem from '../../../components/ImageItem';
import { Pagination } from '@material-ui/lab';
import { MEDIA_VIEW_TYPE, STATUS_API } from '../../../constant/config';
import { getDetailVehicle } from '../../../../features/vehicleSlice';
import { setPageId } from '../../../../features/imageSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const InformationRow = ({ icon, title, value }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.rowInformation}>
      <Grid className={classes.rowInforName}>
        <Grid>{icon}</Grid>
        <Grid>{`\u00A0 ${title}`}</Grid>
      </Grid>
      <Grid>
        <Typography variant={'caption'}>{value}</Typography>
      </Grid>
    </Grid>
  );
};
InformationRow.propTypes = {
  icon: Proptypes.element,
  title: Proptypes.string.isRequired,
  value: Proptypes.string.isRequired
};

function DetailsDevice({ open, sendData, closeRef }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  console.log(sendData.data);

  // const errorGetImage = useSelector(state => state.imageSlice.err);
  const listImages = useSelector(state => state.imageSlice.listImage);
  const currentPageId = useSelector(state => state.imageSlice.currentPageId);
  const totalPage = useSelector(state => state.imageSlice.totalPage);

  const statusGetDetail = useSelector(
    state => state.vehicleSlice.statusGetDetail
  );

  const [isEditDevice] = useState(sendData.type);

  const [viewMediaType, setViewMediaType] = React.useState(
    MEDIA_VIEW_TYPE.IMAGES
  );
  const handleChangeMediaType = (event, newValue) => {
    setViewMediaType(newValue);
  };
  const handleClose = isSaved => {
    if (!closeRef) return;
    closeRef();
  };

  function handlePageChange(event, value) {
    dispatch(setPageId(value));
    // dispatch(GetImages({ pageId: value, deviceId: sendData.data.id }));
  }

  useEffect(() => {
    dispatch(getDetailVehicle({ id: sendData.data.id }));
    // dispatch(GetImages({ pageId: 1, deviceId: sendData.data.id }));
  }, [dispatch]);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <ToolBarEdit closeToolbarRef={handleClose} />
        </AppBar>
        {statusGetDetail === STATUS_API.PENDING ? (
          <LoadingComponent />
        ) : (
          <Container maxWidth='lg'>
            <Grid container spacing={6}>
              {/*=============================column information=========================*/}
              <Grid
                item
                lg={4}
                md={5}
                xs={12}
                style={{
                  paddingTop: '50px',
                  pointerEvents: isEditDevice ? '' : 'none'
                }}
              >
                <Card className={classes.shadowBox}>
                  <CardContent>
                    <InformationRow
                      icon={<AddAlarm />}
                      title={'Số sim'}
                      value={'03894443122'}
                    />
                    <InformationRow
                      icon={<SpeakerNotesTwoTone />}
                      title={'IMEI'}
                      value={'1238926348961549823'}
                    />
                    <InformationRow
                      icon={<DateRange />}
                      title={'Ngày đăng ký'}
                      value={'26/12/1993'}
                    />
                    <InformationRow
                      icon={<DateRange />}
                      title={'Ngày hết hạn'}
                      value={'26/12/1995'}
                    />
                    {/*====================Thông tin chung ==================================*/}
                    <Box className={classes.headerDivider}>
                      <Typography variant={'h6'}>Thông tin chung</Typography>
                    </Box>
                    <InformationRow
                      icon={<TableChart />}
                      title={'Biển kiểm soát'}
                      value={'30G657834'}
                    />
                    <InformationRow
                      icon={<MapPin />}
                      title={
                        '17 , Hồ Mễ Trì , P.Mễ Trì , Q.Nam Từ Liêm , Tp.Hà Nội'
                      }
                      value={''}
                    />
                    <InformationRow
                      icon={<Volume />}
                      title={'Vận tốc'}
                      value={'0km/h'}
                    />
                    {/*====================Thông tin BGT ==================================*/}
                    <Box className={classes.headerDivider}>
                      <Typography variant={'h6'}>Thông tin chung</Typography>
                    </Box>
                    <InformationRow
                      icon={<User />}
                      title={'Lái xe'}
                      value={'LAI XE DANG XUAT'}
                    />
                    <InformationRow
                      icon={<PhoneOutgoing />}
                      title={'Điện thoại'}
                      value={''}
                    />
                  </CardContent>
                </Card>
              </Grid>
              {/*=============================column video and image=========================*/}

              <Grid
                item
                lg={8}
                md={7}
                xs={12}
                style={{
                  paddingTop: '50px',
                  pointerEvents: isEditDevice ? '' : 'none'
                }}
              >
                <Card className={classes.shadowBox}>
                  <Box className={classes.tabHeader}>
                    <Tabs
                      value={viewMediaType}
                      onChange={handleChangeMediaType}
                      variant='fullWidth'
                      indicatorColor='secondary'
                      textColor='secondary'
                      aria-label='icon label tabs '
                    >
                      <Tab icon={<ImageOutlined />} label='Ảnh' />
                      <Tab icon={<CameraAltOutlined />} label='Video' />
                    </Tabs>
                  </Box>
                  {viewMediaType === MEDIA_VIEW_TYPE.IMAGES ? (
                    <CardContent>
                      <Grid container spacing={3}>
                        {listImages &&
                        listImages?.map(image => (
                          <Grid
                            item
                            key={image.id}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                          >
                            <ImageItem
                              // actionDetailsImgRef={showDetailsImg}
                              className={classes.productCard}
                              image={image}
                            />
                          </Grid>
                        ))}
                        <Grid container justify={'center'}>
                          <Pagination
                            color='primary'
                            count={totalPage}
                            size='small'
                            page={currentPageId}
                            onChange={handlePageChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <Typography>Video</Typography>
                    </CardContent>
                  )}

                  <Divider />
                </Card>
              </Grid>
            </Grid>
          </Container>
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
  rowInformation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  rowInforName: {
    display: 'flex'
  },
  headerDivider: {
    backgroundColor: '#e8e7e7',
    padding: theme.spacing(1),
    marginBottom: '15px'
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
  },
  tabHeader: {
    backgroundColor: 'aliceblue'
  }
}));

export default DetailsDevice;
