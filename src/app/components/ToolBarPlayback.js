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
import { getListVehicle } from 'src/features/vehicleSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { STATUS_API } from 'src/app/constant/config';
import { getListVod, setVehicleSelected } from 'src/features/playback';
import { setDate } from 'date-fns';
import shadow from '../theme/shadows';

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
  resetTracking
}) {
  const statusGetPositions = useSelector(
    state => state.deviceSlice.statusGetPositions
  );
  const classes = useStyles();
  const [value, setValue] = React.useState();
  const [schedule, setSchedule] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [playbackDate, setPlaybackDate] = React.useState('');
  const dispatch = useDispatch();

  const [vehicleItem, setVehicleItem] = useState('')


  useEffect(() => {
    const schedule_local = JSON.parse(localStorage.getItem('playback_license_plate'))
    const date_local = localStorage.getItem('playback_date')
    const startTime_local = localStorage.getItem('playback_start_time')
    const endTime_local = localStorage.getItem('playback_end_time')
    const vehicle_local = JSON.parse(localStorage.getItem('vehicle_item'))


   
    setSchedule(schedule_local)
    setPlaybackDate(date_local)
    setStartTime(startTime_local)
    setEndTime(endTime_local)
    setVehicleItem(vehicle_local)

    if (!!schedule_local && !!date_local && !!startTime_local && !!endTime_local && !!vehicle_local) {
      handleSearchDevice(schedule_local, date_local, startTime_local, endTime_local, vehicle_local);
    }

  }, []);


  useEffect(() => {
    return () => {
      localStorage.removeItem('playback_license_plate');
      localStorage.removeItem('playback_date');
      localStorage.removeItem('playback_start_time');
      localStorage.removeItem('playback_end_time');
      localStorage.removeItem('vehicle_item');

      dispatch(
        getListVod()
      );
    };
  }, []);


  const handleSearchDevice = (schedule, playbackDate, startTime, endTime, vehicleItem) => {
    resetTracking();
    const startTimeTimeZone0 = Math.floor(
      moment(`${playbackDate} ${startTime}`)
        .utcOffset(0)
        .unix()
    );
    const endTimeZone0 = Math.floor(
      moment(`${playbackDate} ${endTime}`)
        .utcOffset(0)
        .unix()
    );

    const channelId = `${vehicleItem?.device_serial}_01`;
    const data = {
      id: schedule,
      first_time: startTimeTimeZone0,
      last_time: endTimeZone0,
      deviceSerial: vehicleItem?.device_serial,
      channelId: channelId,
      channelName: 'CH01',
      vehicleId: schedule
    };

    console.log('data palyback >>>>', data);
    //GetVehicalPosition(data);
    //Lấy thông tin file playback
    const div0sec = data.first_time;
    const DIV = 86400;
    dispatch(setVehicleSelected(data));
    dispatch(
      getListVod({ channelId: data.channelId, date: div0sec - (div0sec % DIV) })
    );
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
    localStorage.setItem('playback_license_plate', JSON.stringify(event.target.value))
  };
  const handleChangePlaybackDate = event => {
    setPlaybackDate(event.target.value);
    localStorage.setItem('playback_date', event.target.value)
  };
  const handleChangeStartTime = event => {
    setStartTime(event.target.value);
    localStorage.setItem('playback_start_time', event.target.value)
  };

  const handleChangeEndTime = event => {
    setEndTime(event.target.value);
    localStorage.setItem('playback_end_time', event.target.value)
  };

  const handleSelectVehicle = (vehicle) => {
    setVehicleItem(vehicle)
    localStorage.setItem('vehicle_item', JSON.stringify(vehicle))
  }

  const disabledLoadRoadMap = () => {
    if (startTime == '' || endTime == '' || !schedule) {
      return true;
    }
    return (
      statusGetPositions !== STATUS_API.SUCCESS && statusGetPositions !== null
    );
  };

  return (
    <Paper component="form" className={classes.root} style={{ width: '100%' }}>
      <div>
        <div className={classes.titleHeader}>
          <h6 className={classes.titleLotrinh}>Lộ trình</h6>
          <Button title="Ẩn Menu" onClick={() => setShowMenu(false)}>
            {' '}
            <MenuOpenIcon />{' '}
          </Button>
        </div>
        <FormControl
          size="small"
          className={classes.formControl}
          style={{ width: '100%' }}
        >
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
              value={schedule || ''}
              defaultValue={''}
              onChange={handleChangeSchedule}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="">Chọn phương tiện</MenuItem>
              {vehicles &&
                vehicles.map(vehical => (
                  <MenuItem value={vehical.device_id} onClick={() => handleSelectVehicle(vehical)}>{vehical.license_plate}</MenuItem>
                ))}
            </Select>
          </div>
        </FormControl>
      </div>
      <div style={{ marginTop: '10px' }}>
        <span className={classes.titleTime}>Chọn thời gian</span>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ width: '100%' }}
        >
          <form noValidate>
            <TextField
              style={{ width: '100%' }}
              id="date"
              label="Ngày"
              type="date"
              value={playbackDate || ''}
              className={classes.textField}
              onChange={handleChangePlaybackDate}
              InputLabelProps={{
                shrink: true
              }}
            />
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column ',
                  width: '50%',
                  borderColor: '#E5E5E8',
                  paddingRight: '0.3em'
                }}
              >
                <TextField
                  style={{ width: '100%' }}
                  id="start-time"
                  label="Thời gian bắt đầu"
                  type="time"
                  value={startTime || ''}
                  className={classes.textField}
                  onChange={handleChangeStartTime}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column ',
                  width: '50%',
                  borderColor: '#E5E5E8',
                  paddingLeft: '0.3em'
                }}
              >
                <TextField
                  style={{ width: '100%' }}
                  id="end-time"
                  label="Thời gian kết thúc"
                  type="time"
                  value={endTime || ''}
                  className={classes.textField}
                  onChange={handleChangeEndTime}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </div>
            </div>
          </form>
        </FormControl>
      </div>

      <Button
        style={{
          background: '#C62222',
          color: '#fff',
          paddingLeft: '30px',
          paddingRight: '30px',
          textTransform: 'inherit',
          fontSize: '16px',
          width: '100%',
          marginTop: '15px'
        }}
        disabled={disabledLoadRoadMap()}
        variant="contained"
        onClick={() => {
          handleSearchDevice(schedule, playbackDate, startTime, endTime, vehicleItem);
        }}
      >
        {statusGetPositions !== STATUS_API.SUCCESS &&
          statusGetPositions !== null ? (
          <>
            <CircularProgress size={24} style={{ color: 'white' }} />
            Vui lòng đợi ...
          </>
        ) : (
          <span> Tìm kiếm theo video </span>
        )}
      </Button>
    </Paper>
  );
}
