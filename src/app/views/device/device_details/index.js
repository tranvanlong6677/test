import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  AppBar,
  Box,
  Card,
  Container,
  Dialog,
  makeStyles,
  Slide,
  Step,
  StepLabel,
  Stepper
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import ToolBarEdit from 'src/app/views/device/device_details/ToolBar';
import Step1 from './Step1';
import { useSelector } from 'react-redux';
import { Router } from '@material-ui/icons';
import { Truck } from 'react-feather';
import Typography from '@material-ui/core/Typography';
import { CREATE_DEVICE_STEP, PAGE_SIZE_LIST } from '../../../constant/config';
import Step2 from './Step2';
import { resetChange } from 'src/features/vehicleSlice';
import { getListDevice } from 'src/features/deviceSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const params = {
  page: 1,
  page_size: PAGE_SIZE_LIST,
  is_pagination: true
};

function DetailsDevice({ open, sendData, closeRef }) {
  const classes = useStyles();
  const [isEditDevice] = useState(sendData.type);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (!closeRef) return;
    dispatch(resetChange())

    closeRef();
  };
  const activeStep = useSelector(state => state.deviceSlice.activeStep);
  const steps = [
    {
      title: (
        <Typography
          variant={'caption'}
          style={{
            color:
              activeStep === CREATE_DEVICE_STEP.ADD_INFO_DEVICE ? '#3f51b5' : ''
          }}
        >
          Kích hoạt Thiết bị
        </Typography>
      ),
      icon: (
        <Router
          style={{
            fontSize: '50px',
            color:
              activeStep === CREATE_DEVICE_STEP.ADD_INFO_DEVICE ? '#3f51b5' : ''
          }}
        />
      )
    },
    // {
    //   title: (
    //     <Typography
    //       variant={'caption'}
    //       style={{
    //         color:
    //           activeStep === CREATE_DEVICE_STEP.ADD_INFO_VEHICLE
    //             ? '#3f51b5'
    //             : ''
    //       }}
    //     >
    //       Thông tin Phương tiện
    //     </Typography>
    //   ),
    //   icon: (
    //     <Truck
    //       size={45}
    //       style={{
    //         color:
    //           activeStep === CREATE_DEVICE_STEP.ADD_INFO_VEHICLE
    //             ? '#3f51b5'
    //             : ''
    //       }}
    //     />
    //   )
    // }
  ];
  return (
    <div>
      <Dialog
        fullWidth
        maxWidth={'md'}
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <div className="device-active-modal">
          <AppBar className={classes.appBar}>
            <ToolBarEdit closeToolbarRef={handleClose} />
          </AppBar>
          <Container maxWidth="lg">
            {/* <Stepper
              activeStep={activeStep}
              alternativeLabel
              className={classes.wrapStepBar}
            >
              {steps.map(item => (
                <Step key={item.title}>
                  <StepLabel icon={item.icon}>{item.title}</StepLabel>
                </Step>
              ))}
            </Stepper> */}
            {activeStep === CREATE_DEVICE_STEP.ADD_INFO_DEVICE ? (
              <Step1
                isEditDevice={isEditDevice}
                sendData={sendData}
                closeRef={closeRef}
                open={open}
                handleClose={handleClose}
              />
            ) : (
              <Step2
                isEditDevice={isEditDevice}
                sendData={sendData}
                closeRef={closeRef}
                handleClose={handleClose}
              />
            )}
          </Container>
        </div>
        
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    boxShadow: 'none !important',
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
    // position: 'relative'
    padding: theme.spacing(3)
  },
  wrapStepBar: {
    marginTop: 30,
    padding: 10
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

export default DetailsDevice;
