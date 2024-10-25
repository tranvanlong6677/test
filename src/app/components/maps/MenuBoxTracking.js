import React, { useEffect } from 'react';
import Slide from '@material-ui/core/Slide';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import {
  Box,
  Card,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Divider
} from '@material-ui/core';
import ToolBarTracking from 'src/app/components/ToolBarTracking';
import VehicleTable from 'src/app/components/tables/VehicleTable';
import CarStatusBar from './CarStatusBar'

import { STATUS_API, CAR_STATUS } from 'src/app/constant/config';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    width: '375px',
    height: '469px'
  },
  listInformation: {
    width: '100%',
    maxWidth: 375,
    borderRadius: 8,
    maxHeight: 469,
    backgroundColor: theme.palette.background.paper,
  },
  popoverHeader: {
    textAlign: 'center'

  },
  textInforCar: {
    color: '#0C1132 !important',
    fontSize: '14px !important',
    lineHeight: '19.6px',
    fontWeight: 400,
    padding: '15px 0'
  }
}));

const MenuBox = ({
  getVihicle,
  statusGetAll,
  mode,
  listVehicle,
  setShowMenu,
  showMenu,
  defaultAgencySelected,
  carStatus,
  setCarStatus,
  deviceType,
  setDeviceType,
  statusActive,
  
}) => {
  const classes = useStyles();

  const totalVehicle = useSelector(state => state.vehicleSlice.totalVehicle)
  const [currentCount, setCurrentCount] = React.useState(totalVehicle);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const iconInfo = open ? 'notice' : 'notice_gray'
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    if (listVehicle) {
      setCurrentCount(listVehicle.length)
    }
  }, [listVehicle])

  const statisticVehicleTracking = useSelector(state => state.vehicleSlice.statisticVehicleTracking);
  return (
    <Slide
      direction="right"
      in={showMenu}
      style={{ 
        height: 'max-content',
         paddingBottom: '20px', 
         width: '400px', 
         borderRadius: '8px', 
         boxShadow: '5px 5px 15px 0px #9e9e9ede',
         position:'absolute',
         zIndex: 450
        }}
    >

      <Card className="menu_map">
        <ToolBarTracking
          vehicles={listVehicle}
          setShowMenu={setShowMenu}
          defaultAgencySelected={defaultAgencySelected}
          setCarStatus={setCarStatus}
          setDeviceType={setDeviceType}
          deviceType = {deviceType}
          carStatus = {carStatus}
        />
        <div>
          <span className="header_table">
            <b> Danh sách xe </b>
          </span>
          <div className="float-right">
            <span className="list_tracking_action"> <img alt="icon" src="/static/iconSvg/sync.svg" /> </span>
            <span className="list_tracking_action" aria-describedby={id} onClick={handleClick}>
              <img alt="icon" src={`/static/iconSvg/${iconInfo}.svg`} />
            </span>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Typography className={classes.typography}>

                <div className={classes.popoverHeader}>
                  <b> Chú thích </b>
                  <span className='float-right'>
                    <img alt="button_close" alt="icon" className="list_tracking_action" onClick={handleClose} width="12px" height="12px" src="/static/iconSvg/close-btn.svg" />
                  </span>
                </div>

                <List className={classes.listInformation}>
                  {CAR_STATUS && CAR_STATUS.map((car, index) =>
                    <>
                      <ListItem>
                        <ListItemAvatar>
                          <img alt="icon" alt="icon" src={`/static/iconSvg/cars/${car?.icon}.svg`} className="imageCarInfo" />
                        </ListItemAvatar>
                        <span className={classes.textInforCar}> {car?.info} </span>
                      </ListItem>
                      {
                        CAR_STATUS.length !== (index + 1) ?
                          <Divider variant="inset" component="li" /> : null
                      }
                    </>
                  )}
                </List>
              </Typography>
            </Popover>
          </div>
        </div>
        <Box>
          <div className="vehicle_table_map">
            <VehicleTable
              vehicles={listVehicle}
              getVihicle={getVihicle}
              mode={mode}
              isLoading={statusGetAll === STATUS_API.PENDING}
              carStatus={carStatus}
              deviceType={deviceType}
            />
          </div>
        </Box>
        <Box>
          <CarStatusBar statusActive={statusActive} setCarStatus={setCarStatus} statisticVehicleTracking={statisticVehicleTracking} />
        </Box>
        <Box paddingTop={3} paddingRight={4} color={'#AE0000'} textAlign={'right'}>
          <b> Tổng số xe: {currentCount}/{listVehicle.length}</b>
        </Box>
      </Card>
    </Slide >
  );
};

export default React.memo(MenuBox);
