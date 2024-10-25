import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialogConfirm } from '../../features/uiSlice';
import Loading from "./Loading";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function ModalConfirm({title = '' , open, setOpen, content = '',loading = false, textOk = "OK" , textCancel = 'Cancel' , callbackOk , callbackCancel}) {
  const theme = useTheme();
  const handleCancel = () =>{
    setOpen(false)
    callbackCancel && callbackCancel()
  }
  const handleOk = ()=>{
    setOpen(true)
    callbackOk && callbackOk()
  }

  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <span style={{fontSize: '24px', color: '#3f51b5', minWidth: '600px'}}>{title}</span></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {content }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleOk} color="primary">
            {textOk}  {loading && <Loading/>}
          </Button>
          <Button variant="contained" onClick={handleCancel} color="danger">
            {textCancel}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
