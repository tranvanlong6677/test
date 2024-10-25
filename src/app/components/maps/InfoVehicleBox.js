import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Box, ButtonGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ExploreSharp, DataUsageOutlined }from '@material-ui/icons';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Slide, Fade } from '@material-ui/core';
import 'date-fns';
import DriveEtaSharpIcon from '@material-ui/icons/DriveEtaSharp';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { Tune as TuneIcon } from '@material-ui/icons'
import './style.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const rangeTimes = [{
    value: 2,
    label: "2H",
  }, {
    value: 4,
    label: "4H",
  }, {
    value: 8,
    label: "8H",
  }, {
    value: 24,
    label: "24H",
  }, {
    value: 72,
    label: "72H",
  }]

const  InfoVehiceBox = ({ open, handleClose, vehicle, clickRoadTracking }) => {
  const [selectedRange, setSelectedRange] = React.useState(2);

  const handleCloseBox = () => {
    handleClose();
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
      </MuiDialogTitle>
    );
  });
  
  const handleClickRoadTracking = () => {
    clickRoadTracking(vehicle, selectedRange)
    handleClose();
  }

  const classes = useStyles();


  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBox}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseBox}>
          Xe {vehicle?.license_plate} 
        </DialogTitle>        
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          <Box color="text.primary" marginBottom={5}>
            <Box display="flex" marginBottom={2}>
              <DriveEtaSharpIcon/>   Biển số: {vehicle?.license_plate}

            </Box>
              {
                vehicle  && vehicle.position &&
                  <Box display="flex" marginBottom={2}>

                    <ExploreSharp/> <span>Vĩ độ: {vehicle.position?.lat} </span>
                  </Box>
              }
              {
                vehicle && vehicle.position &&
                  <Box display="flex" marginBottom={2}>
                    <ExploreSharp/>  <span>Kinh độ: {vehicle.position?.lng} </span>
                  </Box>
              }
              {
                vehicle && vehicle.status &&
                  <Box display="flex" marginBottom={2}>
                    <DataUsageOutlined/> <span> Trạng thái : {vehicle.position?.status} </span>
                  </Box>
              }
          </Box>
            <form className={classes.container} noValidate>
              <Box lineHeight={2} marginTop={2}  >


                <ButtonGroup color="primary" aria-label="outlined primary button group" marginTop={5}>
                  {
                    rangeTimes.map((range) => 
                      (
                        <Button 
                          className={selectedRange === range.value ? "selected_range" : ""} 
                          onClick={() => setSelectedRange(range.value)}
                        >
                          { range.label }
                        </Button>
                      )
                    )
                  }
                  
                  <Button  className={!selectedRange ? "selected_range" : ""}  onClick={() => setSelectedRange(0)} > <TuneIcon /> </Button>
                </ButtonGroup>
              </Box>
              {
                !selectedRange ?
                <Box lineHeight={2} marginTop={2}  >
                  <Fade direction="down" in={!selectedRange}>
                    <div>
                      <TextField
                        id="datetime-local"
                        label="Từ"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="datetime-local"
                        label="Tới"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                  </Fade>
              </Box> : null
              
              }
             
            </form>
            <Box color="text.primary" marginTop={5} marginX="auto">
              <Button variant="contained" color="primary" onClick={handleClickRoadTracking} > 
                Xem lộ trình xe {selectedRange ? `${selectedRange} tiếng trước` : ''} 
              </Button>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default React.memo(InfoVehiceBox);