import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { MenuOpen as MenuOpenIcon } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  getListVehicle,
  setSelectedLicensePlate,
  setCurrentInfoVehicle
} from 'src/features/vehicleSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { STATUS_API } from 'src/app/constant/config';
import { useLocation } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '10px',
    width: 365
    // height: '100%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  titleLotrinh: {
    fontSize: '18px',
    color: '#C62222',
    fontWeight: 700,
    marginBottom: '10px'
  },
  titleTime: {
    fontSize: '18px',
    color: '#0C1132',
    fontWeight: 600
  },
  formControl: {
    width: 340,
    marginTop: '10px',
    marginBottom: '10px'
  },
  titleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textRed: {
    color: 'red'
  }
}));

export default function ToolBarTracking({
  vehicles,
  setShowMenu,
  GetVehicalPosition,
  resetTracking,
  startFollow,
  setFollow
}) {
  const statusGetPositions = useSelector(
    state => state.deviceSlice.statusGetPositions
  );
  const classes = useStyles();
  const dispatch = useDispatch();


  const [value, setValue] = React.useState();
  const [schedule, setSchedule] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');

  


  const handleSearchDevice = (schedule, startTime, endTime) => {
    resetTracking();

    const startTimeTimeZone0 = Math.floor(
      moment(startTime)
        .utcOffset(0)
        .unix()
    );
    const endTimeZone0 = Math.floor(
      moment(endTime)
        .utcOffset(0)
        .unix()
    );

    //dispatch(getListVehicle({ license_plate: value }));
    const data = {
      id: +schedule,
      first_time: startTimeTimeZone0,
      last_time: endTimeZone0
    };
 
    GetVehicalPosition(data);
  };

  const handleChangeInput = e => {
    e.preventDefault();
    const newValue = e.target.value;

    setValue(newValue);
  };
  const keyPress = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      const newValue = e.target.value;

      setValue(newValue);
      dispatch(getListVehicle({ license_plate: newValue }));
    }
  };

  const handleChangeSchedule = event => {
    setSchedule(event.target.value);
  };

  const handleChangeStartTime = event => {
    setStartTime(event.target.value);
  };

  const handleChangeEndTime = event => {
    setEndTime(event.target.value);
  };

  const disabledLoadRoadMap = () => {
    if (startTime == '' || endTime == '' || !schedule) {
      return true;
    }
    return (
      statusGetPositions !== STATUS_API.SUCCESS && statusGetPositions !== null
    );
  };


  return (
    <Paper component="form" className={classes.root}>
      <div>
        <div className={classes.titleHeader}>
          <h6 className={classes.titleLotrinh}>Lộ trình</h6>
          <Button title="Ẩn Menu" onClick={() => setShowMenu(false)}>
            {' '}
            <MenuOpenIcon />{' '}
          </Button>
        </div>

        <FormControl size="small" className={classes.formControl}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column ',
              width: '100%',
              borderColor: '#E5E5E8',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '0.3em',
              borderRadius: '5px'
            }}
          >
            <Select
              style={{ width: '100%' }}
              value={schedule ? schedule : ''}
              onChange={handleChangeSchedule}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="">Chọn phương tiện</MenuItem>
              {vehicles &&
                vehicles.map(vehical => (
                  <MenuItem value={vehical.device_id}>
                    {vehical.license_plate}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </FormControl>
      </div>
      <div style={{ marginTop: '10px' }}>
        <span className={classes.titleTime}>Chọn khoảng thời gian</span>
        <FormControl variant="outlined" className={classes.formControl}>
          <form noValidate>
            <TextField
              style={{ width: '100%' }}
              id="datetime-local"
              label="Từ ngày"
              type="datetime-local"
              value={startTime || ''}
              className={classes.textField}
              onChange={handleChangeStartTime}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              style={{ width: '100%', marginTop: '15px' }}
              id="datetime-local"
              label="Đến ngày"
              type="datetime-local"
              value={endTime || ''}
              className={classes.textField}
              onChange={handleChangeEndTime}
              InputLabelProps={{
                shrink: true
              }}
            />
          </form>
        </FormControl>
      </div>
      {disabledLoadRoadMap() && (
        <span className={classes.textRed}>
          <small>
            <i>Vui lòng nhập tất cả các trường bên trên để xem lộ trình!</i>
          </small>
        </span>
      )}
      <Button
        style={{
          background: '#C62222',
          color: '#fff',
          paddingLeft: '30px',
          paddingRight: '30px',
          textTransform: 'inherit',
          fontSize: '16px',
          width: 340,
          marginTop: '15px'
        }}
        disabled={disabledLoadRoadMap()}
        variant="contained"
        onClick={e => {
          handleSearchDevice(schedule, startTime, endTime);
        }}
      >
        {statusGetPositions !== STATUS_API.SUCCESS &&
        statusGetPositions !== null ? (
          <>
            <CircularProgress size={24} style={{ color: 'white' }} />
            Vui lòng đợi ...
          </>
        ) : (
          <span> Tải lộ trình </span>
        )}
      </Button>
    </Paper>
  );
}
