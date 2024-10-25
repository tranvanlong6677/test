import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { MenuOpen as MenuOpenIcon } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { CAR_STATUS } from 'src/app/constant/config';

import {
  getListVehicle,
  getListVehicleTracking,
  setGetListLoading,
  setAgencySelected
} from 'src/features/vehicleSlice';
import { getListDeviceType } from 'src/features/deviceTypeSlice';
import { getListAgencies } from 'src/features/agencySlice';
import { roles } from 'src/app/constant/roles';
import { STATUS_API } from 'src/app/constant/config';
import { string } from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '10px',
    width: 365,
    marginBottom: '20px'
  },
  input: {
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
    fontWeight: 700,
    marginBottom: '10px'
  },
  formControl: {
    height: '60px',
    marginTop: '10px',
    width: '360px',
    marginBottom: '10px'
  },
  titleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectDropdown: {
    padding: '5 5 5 5 '
  },
  dropDown: {
    width: '98%'
  }
}));

export default function ToolBar({
  setShowMenu,
  defaultAgencySelected,
  setCarStatus,
  setDeviceType,
  carStatus,
  deviceType
}) {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [deviceTypeSelected, setDeviceTypeSelected] = useState(null);
  const [statusSelected, setStatusSelected] = useState(null);
  const listVehicleTracking = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );
  const listDeviceType = useSelector(
    state => state.deviceTypeSlice.listDeviceType
  );
  const listAgencies = useSelector(state => state.agencySlice.listAgencies);
  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAdmin =
    dataLogin && dataLogin.role && dataLogin.role.title === roles.ADMIN;
  const dispatch = useDispatch();

  const handleSearchDevice = () => {
    // GetVehicalPosition(data);
  };

  const handleChangeFilterStatus = e => {
    setStatusSelected(e.target.value);
  };

  const handleChangeInput = e => {
    e.preventDefault();
    const newValue = e.target.value;

    setValue(newValue);
    localStorage.setItem('input-search',newValue)
  };
  const keyPress = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      const newValue = e.target.value;

      setValue(newValue);
      dispatch(getListVehicle({ license_plate: newValue }));
    }
  };
  const [id, setId] = useState(null);
  let i;
  const [urlString, setUrl] = useState(`${id}`);
  const [device, setDevice] = useState('Tất cả');
  const handleChangeAgency = e => {
    window.clearInterval(i);
    e.preventDefault();
    dispatch(setGetListLoading(STATUS_API.LOADING));
    dispatch(setAgencySelected(e.target.value));
    setId(e.target.value);
    setUrl(e.target.value);
    setDevice('Tất cả');
    dispatch(getListVehicleTracking(e.target.value));
  };
  // Get list device type
  useEffect(() => {
    dispatch(getListDeviceType());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      i = window.setInterval(() => {
        dispatch(getListVehicleTracking(urlString));
      }, 2000);
      return () => {
        window.clearInterval(i);
      };
    }
  }, [id, urlString]);

  useEffect(() => {
    dispatch(getListAgencies());
  }, [dispatch]);

  useEffect(() => {
    const deviceStatus_local = localStorage.getItem('device-status');
    const deviceType_local = localStorage.getItem('device-type');
    const inputSearch_local = localStorage.getItem('input-search');
    setCarStatus(deviceStatus_local);
    setDeviceType(deviceType_local);
    setValue(inputSearch_local)
    if(inputSearch_local && inputSearch_local!==''){
      dispatch(getListVehicle({ license_plate: inputSearch_local }));
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('device-status')
      localStorage.removeItem('device-type')
      localStorage.removeItem('input-search')
    }
  }, []);


  const handleChangeFilterDeviceStatus = (e) => {
    setCarStatus(e.target.value);
    localStorage.setItem('device-status',e.target.value);
    console.log('device-status >>>',e.target.value);
    
  }

  const handleChangeFilterDeviceType = (e) => {
    setDeviceType(e.target.value);
    localStorage.setItem('device-type',e.target.value);
  }

  return (
    <Paper component="form" className={classes.root}>
      <div>
        <div className={classes.titleHeader}>
          <h6 className={classes.titleLotrinh}>Giám sát</h6>
          <Button title="Ẩn Menu" onClick={() => setShowMenu(false)}>
            {' '}
            <MenuOpenIcon />{' '}
          </Button>
        </div>
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column ',
              width: '100%',
              borderColor: '#E5E5E8',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '0.3em',
              marginBottom: '10px',
              borderRadius: '5px'
            }}
          >
            <Select
              style={{ width: '100%', borderWidth: '0px' }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              defaultValue={''}
              onChange={handleChangeAgency}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="">
                <small> Chọn xí nghiệp </small>
              </MenuItem>
              {listAgencies &&
                listAgencies.map(agency => (
                  <MenuItem
                    style={{ width: '100%', borderWidth: '0px' }}
                    value={agency.id}
                  >
                    {agency.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        )}
        <div
          style={{
            border: '1px solid #E5E5E8',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        >
          <IconButton onClick={e => handleSearchDevice(e)} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            size="small"
            placeholder="Tìm kiếm phương tiện"
            inputProps={{ 'aria-label': 'search google maps' }}
            value={value ? value : ''}
            onChange={e => handleChangeInput(e)}
            onKeyDown={keyPress}

          />
        </div>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column ',
              width: '48%',
              borderColor: '#E5E5E8',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '0.3em',
              marginBottom: '24px',
              borderRadius: '5px'
            }}
          >
            <Select
              style={{ width: '100%' }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={deviceType || ''}
              onChange={e => handleChangeFilterDeviceType(e)}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="">
                <small> Tất cả thiết bị </small>
              </MenuItem>
              {listDeviceType &&
                listDeviceType.map(deivceType => (
                  <MenuItem value={deivceType.name}>{deivceType.name}</MenuItem>
                ))}
            </Select>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column ',
              width: '48%',
              borderColor: '#E5E5E8',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '0.3em',
              marginBottom: '24px',
              borderRadius: '5px'
            }}
          >
            <Select
              labelId="demo-simple-select-outlined-label1"
              id="demo-simple-select-outlined1"
              size="small"
              onChange={e => handleChangeFilterDeviceStatus(e)}
              label="Trạng thái"
              value={carStatus || ''}
              className={classes.selectDropdown}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="">
                <small> Tất cả trạng thái </small>
              </MenuItem>
              {CAR_STATUS.map((car, index) => (
                <MenuItem value={car.value} key={index++}>
                  {car.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Paper>
  );
}
