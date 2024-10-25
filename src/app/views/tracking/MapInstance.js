import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import MenuBoxTracking from 'src/app/components/maps/MenuBoxTracking';
import { ArrowRight } from '@material-ui/icons';
import { renderIconCar } from 'src/app/utils/mapService';
import './style.css';
import { Button, List, ListItem, Divider } from '@material-ui/core';
import { INFOR_CAR } from 'src/app/constant/config';
import { roles } from 'src/app/constant/roles';
import moment from 'moment';
import { getListVehicleTracking } from 'src/features/vehicleSlice';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import _orderBy from 'lodash/orderBy';
import { GetUserInfo } from 'src/features/authSlice';
import RotateIcon from 'src/app/utils/RotateIcon'
import { Select, Box, MenuItem } from '@mui/material';
const { InfoBox } = require('react-google-maps/lib/components/addons/InfoBox');



function Map(props) {
  const {setMapMode, mapMode} = props
  const dispatch = useDispatch();

  const listVehicleApi = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );
  const agencySelected = useSelector(
    state => state.vehicleSlice.agencySelected
  );
  const listVehicleTracking = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );

  //console.log('listVehicleTracking Map1',listVehicleTracking);

  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAgency =
    dataLogin && dataLogin.role && dataLogin.role.title == 'agency';
  const agencyID = isAgency && dataLogin.agency ?  dataLogin.agency.id : undefined;
  

  const statisticVehicleTracking = useSelector(
    state => state.vehicleSlice.statisticVehicleTracking
  );
  let listVehicle = useRef([]);
  useEffect(() => {
    dispatch(GetUserInfo());
  }, []);

  useEffect(() => {
    listVehicle.current = listVehicleApi;
  }, [listVehicleApi]);

  useEffect(() => {
    if (agencyID) {
      dispatch(getListVehicleTracking(agencyID));
      const i = window.setInterval(() => {
        dispatch(getListVehicleTracking(agencyID));
      }, 10000);
      return () => {
        window.clearInterval(i);
      };
    }
  }, [agencyID]);

  const trim = x => {
    return x.replace(/^\(+|\)+$/gm, '');
  };

  const centerDefaultLocal = localStorage.getItem('center')
    ? trim(localStorage.getItem('center')).split(', ')
    : [21.024683, 105.832495];

  const centerDefault = {
    lat: Number(centerDefaultLocal[0]),
    lng: Number(centerDefaultLocal[1])
  };
  const zoomDefault = localStorage.getItem('zoom')
    ? Number(localStorage.getItem('zoom'))
    : 10;

  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const [ref, setRef] = useState(null);
  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [center, setCenter] = useState(centerDefault);
  const [showMenu, setShowMenu] = useState(true);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [zoom, setZoom] = useState(10);

  const handleMarkerClick = vehicle => {
    if (vehicle && vehicle.lat && vehicle.lng) {
      setPositionsInfoBox({
        license_plate: vehicle.license_plate,
        lat: Number(vehicle.lat),
        lng: Number(vehicle.lng),
        created_at: vehicle.created_at,
        air_condition_status: vehicle.air_condition_status,
        engine_status: vehicle.engine_status,
        battery: vehicle.battery,
        charge_status: vehicle.charge_status,
        speed_gps: vehicle.speed_gps,
        door_status: vehicle.door_status,
        stop_times: vehicle.stop_times, // số lần dừng đỗ
        is_stopping: vehicle.is_stopping, // đang dừng đỗ
        total_distance: vehicle.total_distance, // Tổng quãng đường đi được trong ngày
        total_overspeed: vehicle.total_overspeed, // số lần quá tốc độ
        total_drive_time: vehicle.total_drive_time, // thời gian lái xe trong ngày
        driver_login: vehicle.driver_login,
        driver_logout: vehicle.driver_logout,
        driver_name: vehicle.driver_name, // tên lái xe
        driver_license: vehicle.driver_license, // bằng lái xe
        non_stop_driving_time: vehicle.non_stop_driving_time
      });
      localStorage.setItem('center', `(${vehicle.lat}, ${vehicle.lng})`);
    }
  };

  useEffect(() => {
    if (positionsInfoBox && positionsInfoBox.lat && positionsInfoBox.lng) {
      setShowInfoWindow(true);
    }
  }, [positionsInfoBox]);

  const handleCloseInfo = () => {
    setShowInfoWindow(false);
    setPositionsInfoBox();
  };

  const getVihicle = vehicle => {
    if (vehicle && vehicle.lat && vehicle.lng) {
      localStorage.setItem('center', `(${vehicle.lat}, ${vehicle.lng})`);

      setCenter({ lat: Number(vehicle.lat), lng: Number(vehicle.lng) });
      setZoom(15);
      if (ref.setZoom) {
        ref.setZoom(15);
      }
    }
  };

  const handleZoomChanged = () => {
    localStorage.setItem('zoom', ref.getZoom());
  };
  const handleCenterChanged = () => {
    localStorage.setItem('center', ref.getCenter().toString());
  };

  const renderValueInWindowBox = infor => {
    switch (infor.dataKey) {
      case 'created_at':
        return moment
          .unix(positionsInfoBox[infor.dataKey])
          .format('DD/MM HH:mm:ss');

      case 'speed_gps':
        return `${Math.floor(positionsInfoBox[infor.dataKey])} Km/h`;

      case 'engine_status':

      case 'air_condition_status':
        return positionsInfoBox[infor.dataKey] ? 'Bật' : 'Tắt';

      case 'is_stopping':
        return positionsInfoBox[infor.is_stopping] ? 'Dừng' : 'Không';

      default:
        return positionsInfoBox[infor.dataKey] ?? '--';
    }
  };

  useEffect(() => {
    setCenter(centerDefault);
  }, []);

  const options = {
    streetViewControl: false,
    mapTypeControlOptions: {
      style: 1,
      position: 9, //window.google.maps.ControlPosition.RIGHT_BOTTOM
      mapTypeIds: [
        'roadmap', //window.google.maps.MapTypeId.ROADMAP
        'satellite', //window.google.maps.MapTypeId.SATELLITE,
        'hybrid' //window.google.maps.MapTypeId.HYBRID
      ]
    },
    zoomControlOptions: {
      position: 7
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };
  

  const [carStatus, setCarStatus] = useState(undefined);
  const handleCarStatus = (e) => {
    console.log(e);
    setCarStatus(e);
  }
  const [deviceType, setDeviceType] = useState(undefined);
  const handleDeviceType = (e) => {
    console.log(e);
    setDeviceType(e);
  }

  const handleChange = (event) => {
    setMapMode(event.target.value);
  };

  return (
    <>
      <Button className="show_menu" sizeSmall onClick={() => setShowMenu(true)}>
        {' '}
        <ArrowRight />{' '}
      </Button>
      <span
        className="get_current_location"
        sizeSmall
        onClick={() => getCurrentLocation()}
      >
       {' '}
        <span>
          {' '}
          <GpsFixedIcon />{' '}
        </span>
      </span>

      <MenuBoxTracking
        getVihicle={getVihicle}
        statusGetAll={statusGetAll}
        listVehicle={_orderBy(listVehicle.current, 'license_plate', 'desc')}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
        statusActive={carStatus}
        setCarStatus={handleCarStatus}
        carStatus={carStatus}
        setDeviceType={handleDeviceType}
        deviceType={deviceType}
        defaultAgencySelected={agencyID}
      />
      <GoogleMap
        zoom={zoom}
        ref={mapRef => setRef(mapRef)}
        defaultCenter={{ lat: Number(center.lat), lng: Number(center.lng) }}
        center={center}
        defaultOptions={options}
        onZoomChanged={handleZoomChanged}
        onCenterChanged={handleCenterChanged}
      >
        <>
          {showInfoWindow && positionsInfoBox ? (
            <InfoWindow
              position={positionsInfoBox}
              className="info_vehicle_window"
              onCloseClick={handleCloseInfo}
            >
              <div style={{ zIndex: 10 }}>
                <span
                  color="primary"
                  style={{
                    color: '#C62222',
                    fontSize: '20px',
                    fontWeight: 600
                  }}
                >
                  Thông tin xe:
                </span>
                <List
                  component="nav"
                  style={{ padding: '0 !important', width: '375px !important' }}
                >
                  {INFOR_CAR.map((infor, index) => (
                    <>
                      <ListItem
                        disableGutters
                        style={{
                          padding: '0',
                          paddingTop: '5px',
                          paddingBottom: '5px',
                          display: 'inline-block'
                        }}
                      >
                        <div style={{ float: 'left' }}>
                          <img
                            src={`/static/iconSvg/${infor.icon}.svg`}
                            style={{ paddingRight: '5px' }}
                          />
                          <b> {infor.label} </b>
                        </div>

                        <div
                          style={{
                            float: 'right',
                            textAlign: 'right',
                            minWidth: '230px',
                            maxWidth: '248px'
                          }}
                        >
                          {renderValueInWindowBox(infor)}
                        </div>
                      </ListItem>
                      <Divider />
                    </>
                  ))}
                </List>
              </div>
            </InfoWindow>
          ) : null}
          {listVehicleTracking && listVehicleTracking.length > 0
            ? listVehicleTracking.map((vehicle, index) => {
              if (carStatus) {
                if (carStatus == vehicle.device_status) {
                  return (
                    <>
                      {vehicle && vehicle.lat && vehicle.lng ? (
                        <Marker
                          key={index}
                          style={{ transform: "rotate(90deg);" }}
                          options={{
                            rotation: 180,
                          }}
                          position={{
                            lat: Number(vehicle.lat),
                            lng: Number(vehicle.lng)
                          }}
                          onClick={() => handleMarkerClick(vehicle)}
                          icon={RotateIcon.makeIcon(renderIconCar(vehicle, statisticVehicleTracking)).setRotation({ deg: vehicle.direction }).getUrl()}
                        >
                          {
                            <InfoBox
                              options={{
                                closeBoxURL: '',
                                enableEventPropagation: true,
                                disableAutoPan: true,
                                anchor: (20, 50)
                              }}
                              position={new window.google.maps.LatLng(vehicle)}
                            >
                              {
                                !showInfoWindow &&
                                <div class="license_number_marker">
                                  {vehicle.license_plate}
                                </div>
                              }
                            </InfoBox>
                          }
                        </Marker>
                      ) : null}
                    </>
                  )
                }
              }
              else {
                return (
                  <>
                    {vehicle && vehicle.lat && vehicle.lng ? (
                      <Marker
                        key={index}
                        options={{
                          rotation: 180,
                        }}
                        position={{
                          lat: Number(vehicle.lat),
                          lng: Number(vehicle.lng)
                        }}
                        onClick={() => handleMarkerClick(vehicle)}
                        icon={RotateIcon.makeIcon(renderIconCar(vehicle, statisticVehicleTracking)).setRotation({ deg: vehicle.direction }).getUrl()}
                      >
                        {
                          <InfoBox
                            options={{
                              closeBoxURL: '',
                              enableEventPropagation: true,
                              disableAutoPan: true,
                              anchor: (20, 50)
                            }}
                            position={new window.google.maps.LatLng(vehicle)}
                          >
                            <>
                              {
                                !showInfoWindow &&
                                <div class="license_number_marker">
                                  {vehicle.license_plate}
                                </div>
                              }
                            </>
                          </InfoBox>
                        }
                      </Marker>
                    ) : null}
                  </>
                )
              }

            })
            : null}
          {currentLocation && (
            <Marker
              icon={{
                url: '/static/iconSvg/gps.svg',
                scaledSize: new window.google.maps.Size(20, 20)
              }}
              position={currentLocation}
            >
              <InfoBox
                options={{
                  anchor: (20, 50),
                  closeBoxURL: '',
                  enableEventPropagation: true,
                  disableAutoPan: true
                }}
              >
                <>
                  <div class="your_location"> Vị trí của bạn</div>
                </>
              </InfoBox>
            </Marker>
          )}
        </>
        <Box>
          <Select
            value={mapMode}
            onChange={handleChange}
            sx={{zIndex:500, position:'absolute', bottom:'50px !important', right:'100px !important'}}
            className='select-map'
          >
              <MenuItem value={"googleMap"}>Google Map</MenuItem>
              <MenuItem value={'streetMap'}>Street Map</MenuItem>
           
          </Select>
        </Box>
      </GoogleMap>
    </>
  );
}

export default withScriptjs(withGoogleMap(React.memo(Map)));
