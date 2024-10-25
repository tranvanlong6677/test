import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getListVehicle } from 'src/features/vehicleSlice';
import Grid from '@material-ui/core/Grid';
import { CAR_STATUS } from 'src/app/constant/config'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    marginBottom: '20px'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    padding: '0 ',
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
    width: 360,
    marginBottom: '10px'
  },
  titleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectDropdown: {
    padding: '5 5 5 5 ',

  },
  dropDown: {
    width: '98%',
  }
}));

export default function ToolBar({ vehicles, setShowMenu }) {

  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [statusSelected, setStatusSelected] = React.useState('');

  const [schedule, setSchedule] = React.useState(null);
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const statusSelected_local = localStorage.getItem('status-selected');
    const inputSearchValue_local = localStorage.getItem('input-search');
    if(statusSelected_local && inputSearchValue_local){
      setStatusSelected(statusSelected_local);
      setValue(inputSearchValue_local)
      dispatch(getListVehicle({ license_plate: inputSearchValue_local }))
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('status-selected');
      localStorage.removeItem('input-search')
    }
  }, []);

  const handleSearchDevice = () => {
    const data = {
      id: schedule,
      first_time: startTime,
      last_time: endTime
    };
  };
  
  const handleChangeFilterStatus = (e) => {
    setStatusSelected(e.target.value)
    localStorage.setItem('status-selected',e.target.value)
  }

  const handleChangeInput = e => {
    e.preventDefault();
    const newValue = e.target.value;
    setValue(newValue)
    localStorage.setItem('input-search',e.target.value)
  };
  const keyPress = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      const newValue = e.target.value;
      localStorage.setItem('input-search',e.target.value)
      dispatch(getListVehicle({ license_plate: newValue }));
    }
  };

  return (
    <Paper component="form" className={classes.root}>
      <div>
        <div className={classes.titleHeader}>
          <h6 className={classes.titleLotrinh}>Giám sát</h6>
       
        </div>
          <div style={{ border: '1px solid #E5E5E8', borderRadius: '4px', marginBottom: "10px"}}>
            <IconButton  onClick={(e) => handleSearchDevice(e)} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Tìm kiếm phương tiện"
              inputProps={{ 'aria-label': 'search google maps' }}
              value={value || ''}
              onChange={(e) => handleChangeInput (e)}
              onKeyDown={keyPress}
           
            />
          </div>

          <Grid container >
    
            <FormControl  className={classes.dropDown} size="small">
              <div style={{ display: "flex", flexDirection: "column ", width: "100%", borderColor: "#E5E5E8", borderWidth: "1px", borderStyle: "solid", padding: '0.5em', borderRadius: "3px" }}>
                <Select
                  labelId="demo-simple-select-outlined-label1"
                  id="demo-simple-select-outlined1"
                  value={statusSelected ? statusSelected : ''}
                  size="small"
                  onChange={handleChangeFilterStatus}
                  label="Age"
                  //defaultValue={''}
                  className={classes.selectDropdown}
                  displayEmpty
                  disableUnderline
                >
                  <MenuItem value="">
                    Tất cả trạng thái
                  </MenuItem>
                  {
                      CAR_STATUS.map((car, index) => 
                      <MenuItem value={car.value} key={index++}>{car.label}</MenuItem>
                    )
                  }
                </Select>
              </div>
            </FormControl>
          </Grid>
      </div>
    </Paper>
  );
}
