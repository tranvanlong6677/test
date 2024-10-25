import React from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
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
import ToolBarMenu from './ToolBarMenu';
import VehicleTable from './VehicleTable';
import { STATUS_API, CAR_STATUS } from 'src/app/constant/config';


const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    width: '100%',
    height: '100vh'
  },
  listInformation: {
    width: '100%',
    maxWidth: 375,
    borderRadius: 8,
    maxHeight: 469,
    backgroundColor: theme.palette.background.paper
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

const MenuVideo = ({
                     statusGetAll,
                     listVehicle,
                     getVihicle,
                     setRoomID,
                     getDriverInfo
                   }) => {
  const classes = useStyles();

  // const totalVehicle = useSelector(state => state.vehicleSlice.totalVehicle)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const iconInfo = open ? 'notice' : 'notice_gray';
  const id = open ? 'simple-popover' : undefined;


  return (

    <Card className="menu_video_map">
      <ToolBarMenu
        vehicles={listVehicle}
      />
      <div className='table_driver'>
        <div>
          <span className="header_table">
            <b> Danh sách xe </b>
          </span>
          <div className="float-right">
            <span className="list_tracking_action"> <img src="/static/iconSvg/sync.svg" /> </span>
            <span className="list_tracking_action" aria-describedby={id} onClick={handleClick}>
              <img src={`/static/iconSvg/${iconInfo}.svg`} />
            </span>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <Typography className={classes.typography}>
                <div className={classes.popoverHeader}>
                  <b> Chú thích </b>
                  <span className='float-right'>
                    <img className="list_tracking_action" onClick={handleClose} width="12px" height="12px"
                        src="/static/iconSvg/close-btn.svg" />
                  </span>
                </div>
                <List className={classes.listInformation}>
                  {CAR_STATUS && CAR_STATUS.map((car, index) =>
                    <div key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <img src={`/static/iconSvg/cars/${car?.icon}.svg`} className="imageCarInfo" />
                        </ListItemAvatar>
                        <span className={classes.textInforCar}> {car?.info} </span>
                      </ListItem>
                      {
                        CAR_STATUS.length !== (index + 1) ?
                          <Divider variant="inset" component="li" /> : null
                      }
                    </div>
                  )}
                </List>

              </Typography>
            </Popover>
          </div>
        </div>
        <Box>
          <div>
            <VehicleTable
              getVihicle={getVihicle}
              vehicles={listVehicle}
              isLoading={statusGetAll === STATUS_API.PENDING}
            //  setRoomID={setRoomID}
              getDriverInfo = {getDriverInfo}
            />
          </div>
        </Box>
      </div>
    </Card>
  );
};

export default React.memo(MenuVideo);
