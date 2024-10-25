import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  AppBar,
  Container,
  Dialog,
  makeStyles,
  Slide,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Header from './vehicle-create/Header';

import { PAGE_SIZE_LIST } from 'src/app/constant/config';
import { resetChange } from 'src/features/vehicleSlice';

import CreateDriverForm from './vehicle-create/index';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const params = {
  page: 1,
  page_size: PAGE_SIZE_LIST,
  is_pagination: true
};

function CreateDriver({ open, sendData, closeRef }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClose = () => {
    if (!closeRef) return;
    dispatch(resetChange())

    closeRef();
  };

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
            <Header closeToolbarRef={handleClose} />
          </AppBar>
          <Container maxWidth="lg">
            <CreateDriverForm closeRef={closeRef}/>
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

export default CreateDriver;
