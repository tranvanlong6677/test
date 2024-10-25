import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'date-fns';
import Slide from '@material-ui/core/Slide';
import { Box, Card } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ToolBar from 'src/app/components/ToolBar';
import VehicleRoadMapTable from 'src/app/components/tables/VehicleRoadMapTable';
import { STATUS_API } from 'src/app/constant/config';
import {
  Slider,
  Popover,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { useLocation } from 'react-router';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
    width: '304px',
    height: '408px'
  },
  listInformation: {
    width: '100%',
    maxWidth: 375,
    borderRadius: 8,
    maxHeight: 469,
    backgroundColor: theme.palette.background.paper
  },
  popoverHeader: {
    textAlign: 'left'
  }
}));
const MenuBox = ({
  getVihicle,
  clickRoadTrackingUpdate,
  startFollow,
  resetTracking,
  stoppedPoint,
  follow,
  statusGetAll,
  mode,
  listVehicle,
  center,
  setSpeed,
  setShowMenu,
  showMenu,
  setMode,
  setLine,
  setFollow
}) => {
  const location = useLocation()
  const pathName = location.pathname;

  const handleReset = () => {
    resetTracking();
  };

  const classes = useStyles();
  const statusGetPositions = useSelector(
    state => state.deviceSlice.statusGetPositions
  );
  const waiting =
    statusGetPositions !== STATUS_API.SUCCESS && statusGetPositions !== null;
  const [showButton, setShowButton] = useState(false);

  const [showColumns, setShowColumns] = useState({
    gpsSpeedCol: true,
    speedCol: true,
    doorStatusCol: true,
    airConditionStatusCol: true,
    engineStatusCol: true,
    latLngCol: true
  });

  const {
    gpsSpeedCol,
    speedCol,
    doorStatusCol,
    airConditionStatusCol,
    engineStatusCol,
    latLngCol
  } = showColumns;
  const handleShowColumns = event => {
    setShowColumns({
      ...showColumns,
      [event.target.name]: event.target.checked
    });
  };

  const GetVehicalPosition = data => {
    setShowButton(true);
    clickRoadTrackingUpdate(data);

    // setTimeout(() => {
    //   startFollow();
    // },2000);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickSetting = event => {
    // console.log(event)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const iconSetting = open ? 'iconSettingActive' : 'iconSetting';

  const PrettoSlider = withStyles({
    root: {
      height: 4,
      width: 250,
      marginLeft: '1.5em',
      marginRight: '1.5em'
    },
    thumb: {
      height: 16,
      width: 44,
      background: 'transparent',
      borderRadius: 'none !important',
      backgroundImage: "url('/static/iconSvg/carSliderIcon.svg')",
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit'
      },
      marginTop: -8,
      marginLeft: -12
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)'
    },
    track: {
      height: 4,
      borderRadius: 4
    },
    rail: {
      height: 4,
      borderRadius: 4
    }
  })(Slider);


  return (
    <Slide
      direction="right"
      in={showMenu}
      style={{
        height: 'max-content',
        width: '400px',
        borderRadius: '8px',
        boxShadow: '5px 5px 15px 0px #9e9e9ede',
        zIndex:450
      }}
    >
      <Card className="menu_map">
        <ToolBar
          resetTracking={resetTracking}
          vehicles={listVehicle}
          setShowMenu={setShowMenu}
          GetVehicalPosition={GetVehicalPosition}
          startFollow = {startFollow}
          setFollow={setFollow}
        />
        <Box style={{ marginTop: '10px' }}>
          {showButton && (
            <>
              <b> Trình phát </b>
              <div className="float-right">
                <span className="list_tracking_action">
                  {' '}
                  <img
                    alt="print_icon"
                    src="/static/iconSvg/iconPrint.svg"
                  />{' '}
                </span>
                <span className="list_tracking_action">
                  {' '}
                  <img
                    alt="excel_icon"
                    src="/static/iconSvg/iconExcel.svg"
                  />{' '}
                </span>
                <span className="list_tracking_action">
                  <img
                    src={`/static/iconSvg/${iconSetting}.svg`}
                    alt="setting"
                    aria-describedby="settings-table"
                    onClick={handleClickSetting}
                  />
                </span>
                <Popover
                  id="settings-table"
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
                      <b> Cài đặt hiển thị </b>
                      <span className="float-right">
                        <img
                          className="list_tracking_action"
                          onClick={handleClose}
                          alt="icon"
                          width="12px"
                          height="12px"
                          src="/static/iconSvg/close-btn.svg"
                        />
                      </span>
                    </div>
                    <List className={classes.listInformation}>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={gpsSpeedCol}
                              onChange={handleShowColumns}
                              name="gpsSpeedCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị vận tốc GPS"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={speedCol}
                              onChange={handleShowColumns}
                              name="speedCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị vận tốc cơ"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={<Checkbox name="checkedA" color="primary" />}
                          label="Hiển thị Km"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={doorStatusCol}
                              onChange={handleShowColumns}
                              name="doorStatusCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị trạng thái cửa"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={airConditionStatusCol}
                              onChange={handleShowColumns}
                              name="airConditionStatusCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị trạng thái điều hòa"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={engineStatusCol}
                              onChange={handleShowColumns}
                              name="engineStatusCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị trạng thái động cơ"
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={latLngCol}
                              onChange={handleShowColumns}
                              name="latLngCol"
                              color="primary"
                            />
                          }
                          label="Hiển thị kinh độ, vĩ độ"
                        />
                      </ListItem>
                    </List>
                  </Typography>
                </Popover>
              </div>
            </>
          )}
          {showButton && !waiting ? (
            <Box
              style={{
                marginTop: '25px',
                display: 'flex',
                verticalAlign: 'middle',
                alignItem: 'center'
              }}
            >
              {follow ? (
                <span style={{ cursor: 'pointer' }} onClick={handleReset}>
                  {' '}
                  <img alt="icon" src="/static/iconSvg/iconPause.svg" />{' '}
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }} onClick={startFollow}>
                  {' '}
                  <img alt="icon" src="/static/iconSvg/iconPlay.svg" />{' '}
                </span>
              )}
              <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={0}
              />
              <img alt="icon" src="/static/iconSvg/icon2x.svg" />
            </Box>
          ) : (
            ''
          )}
          <div className="vehicle_table_outer_roadmap">
            {follow && pathName ==='/app/map' ? (
              <VehicleRoadMapTable
                vehicles={stoppedPoint}
                getVihicle={getVihicle}
                mode={mode}
                showColumns={showColumns}
              />
            ) : (
              ''
            )}
          </div>
        </Box>
      </Card>
    </Slide>
  );
};

export default React.memo(MenuBox);
