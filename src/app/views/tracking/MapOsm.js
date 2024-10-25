import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MenuBoxTracking from 'src/app/components/maps/MenuBoxTracking';
import { ArrowRight } from '@material-ui/icons';
import { renderIconCar } from 'src/app/utils/mapService';
import './style.css';
import { Button, List, ListItem, Divider } from '@material-ui/core';
import { INFOR_CAR } from 'src/app/constant/config';
import { roles } from 'src/app/constant/roles';
import moment, { duration } from 'moment';
import { getListVehicleTracking } from 'src/features/vehicleSlice';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import _orderBy from 'lodash/orderBy';
import { GetUserInfo } from 'src/features/authSlice';
import RotateIcon from 'src/app/utils/RotateIcon';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import L from 'leaflet';
import 'leaflet-routing-machine';
import mkIcon from '../../assets/mkicon.png';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/styles.css';
import {MenuItem, Select, Box} from '@mui/material';

function MapOsm(props) {

 const {setMapMode, mapMode} = props
 
  const [mapRef, setMapRef] = useState(null)
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
  const agencyID =
    isAgency && dataLogin.agency ? dataLogin.agency.id : undefined;

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

  const centerDefault = [
     Number(centerDefaultLocal[0]),
     Number(centerDefaultLocal[1])
  ];
  const zoomDefault = localStorage.getItem('zoom')
    ? Number(localStorage.getItem('zoom'))
    : 8;

  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const [ref, setRef] = useState(null);
  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [center, setCenter] = useState(centerDefault);
  const [showMenu, setShowMenu] = useState(true);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [zoom, setZoom] = useState(10);

  //const [map, setMap] = useState(null);

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
    setPositionsInfoBox(null);
  };

  const getVihicle = vehicle => {
    if (vehicle && vehicle.lat && vehicle.lng) {
      localStorage.setItem('center', `(${vehicle.lat}, ${vehicle.lng})`);

      setCenter([Number(vehicle.lat),Number(vehicle.lng)]);

      // setZoom(15);
    
      mapRef.setView([Number(vehicle.lat),Number(vehicle.lng)],15);
      // if (map.setZoom) {
      //   map.setZoom(16);
      // }
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('check geo locations >>>');
        setCenter([
          position.coords.latitude,
          position.coords.longitude
        ]);
        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);

          if (!mapRef) return;
          mapRef.flyTo([position.coords.latitude,
            position.coords.longitude], 13, {
            animate: true
          });
      });
    }
  };

  const [carStatus, setCarStatus] = useState(undefined);
  const handleCarStatus = e => {
    console.log(e);
    setCarStatus(e);
  };
  const [deviceType, setDeviceType] = useState(undefined);
  const handleDeviceType = e => {
    console.log(e);
    setDeviceType(e);
  };

  const handleDisplayIcon = (vehicle, statisticVehicleTracking) => {
    const iconSize = [35, 35];
    let makerIcon = L.icon({
      iconUrl: mkIcon,
      iconSize: iconSize,
      iconAnchor: [17, 35],
      popupAnchor: [0, -46]
    });

    let flag = true;
    let url = '';
    vehicle &&
      flag &&
      statisticVehicleTracking &&
      statisticVehicleTracking.lost_gsm_vehicles.map((item, index) => {
        if (item == vehicle.license_plate) {
          flag = false;
          url = '/static/iconSvg/cars/car_lost_gps.svg';
          makerIcon = L.icon({
            iconUrl: url,
            iconSize: iconSize,
            iconAnchor: [17, 35],
            popupAnchor: [0, -46]
          });
        }
      });
    vehicle &&
      flag &&
      statisticVehicleTracking &&
      statisticVehicleTracking.over_speed_vehicles.map((item, index) => {
        if (item == vehicle.license_plate) {
          flag = false;
          url = `/static/iconSvg/cars/car_out_speed.svg`;
          makerIcon = L.icon({
            iconUrl: url,
            iconSize: iconSize,
            iconAnchor: [17, 35],
            popupAnchor: [0, -46]
          });
        }
      });
    vehicle &&
      flag &&
      statisticVehicleTracking &&
      statisticVehicleTracking.stop_vehicles.map((item, index) => {
        if (item === vehicle.license_plate) {
          flag = false;
          url = '/static/iconSvg/cars/car_stopped.svg';
          makerIcon = L.icon({
            iconUrl: url,
            iconSize: iconSize,
            iconAnchor: [17, 35],
            popupAnchor: [0, -46]
          });
        }
      });
    vehicle &&
      flag &&
      statisticVehicleTracking &&
      statisticVehicleTracking.running_vehicles.map((item, index) => {
        if (item == vehicle.license_plate) {
          flag = false;

          url = `/static/iconSvg/cars/car_moving.svg`;
          makerIcon = L.icon({
            iconUrl: url,
            iconSize: iconSize,
            iconAnchor: [17, 35],
            popupAnchor: [0, -46]
          });
        }
      });

    flag &&
      statisticVehicleTracking &&
      vehicle &&
      statisticVehicleTracking.lost_gps_vehicles.map((item, index) => {
        if (item === vehicle.license_plate) {
          flag = false;
          url = `/static/iconSvg/cars/car_lost_gsm.svg`;
          makerIcon = L.icon({
            iconUrl: url,
            iconSize: iconSize,
            iconAnchor: [17, 35],
            popupAnchor: [0, -46]
          });
        }
      });
    L.Marker.prototype.options.icon = makerIcon;
    return makerIcon;
  };

  const displayLocationIcon = () => {
    let locationCurrent;
            locationCurrent = L.icon({
            iconUrl: `/static/iconSvg/gps.svg`,
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -46]
          });
    L.Marker.prototype.options.icon = locationCurrent;
    return locationCurrent;
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

      <MapContainer
        center={center}
        zoom={zoomDefault}
        maxZoom={18}
        style={{ height: '92vh' }}
        zoomControl={false}
        scrollWheelZoom={true}
        whenCreated={mapR => setMapRef(mapR)}
        zoomAnimation = {true}
        //fullscreenControl={true}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=ZLjliqReTSXGIpeOzHPo"
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FullscreenControl forceSeparateButton={true} position="topright" />
        <ZoomControl position="topright" style={{ marginRight: '15px' }} />
        <>

          {listVehicleTracking && listVehicleTracking.length > 0
            ? listVehicleTracking.map((vehicle, index) => {
                if (carStatus) {
                  if (carStatus == vehicle.device_status) {
                    return (
                      <>
                        {vehicle && vehicle.lat && vehicle.lng ? (
                          <Marker
                            key={index}
                            style={{ transform: 'rotate(90deg);' }}
                            options={{
                              rotation: 180
                            }}
                            position={[
                               Number(vehicle.lat),
                               Number(vehicle.lng)
                            ]}
                            eventHandlers={
                              {
                                click: () => 
                                  handleMarkerClick(vehicle)
                              }
                            }
                            icon={handleDisplayIcon(
                              vehicle,
                              statisticVehicleTracking
                            )}
                          >
                            {
                              <>
                              
                               <Popup
                                 position={[
                                 Number(vehicle.lat),
                                 Number(vehicle.lng)
                                 ]}
                                keepInView={true}
                                minWidth={390}
                                maxHeight="auto"
                                autoClose = {false}
                                closeOnClick = {false}
                                closeButton = {true}
                               
                             >
                           
                               <div style={{ 
                                // background:'#b4a7d6',
                                width:400,
                                maxHeight:'490px',
                                overflowY:'scroll'
                                
                               }}>
                                 <span
                                   color="primary"
                                   style={{
                                     color: '#C62222',
                                     fontSize: '20px',
                                     fontWeight: 600,
                                     
                                   }}
                                 >
                                   Thông tin xe:
                                 </span>
                                 <List
                                   component="nav"
                                   style={{
                                     padding: '0 !important',
                                     width: '375px !important',
                                   }}
                                 >
                                   {INFOR_CAR.map((infor, index) => (
                                     <>
                                       <ListItem
                                         disableGutters
                                         style={{
                                           padding: '0',
                                           paddingTop: '5px',
                                           paddingBottom: '5px',
                                           display: 'inline-block',
                                           //background:'#b4a7d6'
                                           
                                         }}
                                       >
                                         <div style={{ float: 'left'}}>
                                           <img
                                             src={`/static/iconSvg/${infor.icon}.svg`}
                                             style={{ paddingRight: '5px', marginLeft:'0 !important'}}
                                           />
                                           <b> {infor.label} </b>
                                         </div>

                                         <div
                                           style={{
                                             float: 'right',
                                             textAlign: 'right',
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
                               </Popup>

                               <Tooltip
                                direction="bottom"
                                permanent
                                position={[
                                Number(vehicle.lat),
                                Number(vehicle.lng)
                                ]}
                                opacity={1}
                                >  
                                  <div class="license_number_marker">
                                      {vehicle.license_plate}
                                  </div>
                               </Tooltip>
                              </>
                            }
                          </Marker>
                        ) : null}

                        
                      </>
                    );
                  }
                } else {
                  return (
                    <>
                      {vehicle && vehicle.lat && vehicle.lng ? (
                        <Marker
                         
                          key={index}
                          options={{
                            rotation: 180
                          }}
                          position={[
                            Number(vehicle.lat),
                            Number(vehicle.lng)
                          ]}
                         
                          icon={handleDisplayIcon(
                            vehicle,
                            statisticVehicleTracking
                          )}
                          eventHandlers={
                            {
                              click: (e) => 
                                handleMarkerClick(vehicle)
                            }
                          }
                          
                        >
                          {
                            <>
                              {
                              <Popup
                                position={[
                                  Number(vehicle.lat),
                                  Number(vehicle.lng)
                                ]}
                                 keepInView={true}
                                 minWidth={390}
                                 maxHeight="auto"
                                 autoPanPaddingTopLeft = {[100,50]}
                                 autoClose = {false}
                                 closeOnClick = {false}
                                 closeButton = {true}
                 
                              >
                            
                                <div style={{ 
                                // background:'#b4a7d6',
                                 width:400,
                                 maxHeight:'490px',
                                 overflowY:'scroll',

                                padding:'5px 10px 15px 10px',
                                borderRadius:'7px',
                                background:'#ffffff',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;"

                                }}>
                                  <span
                                    color="primary"
                                    style={{
                                      color: '#C62222',
                                      fontSize: '20px',
                                      fontWeight: 600,
                                      
                                    }}
                                  >
                                    Thông tin xe:
                                  </span>
                                  <List
                                    component="nav"
                                    style={{
                                      padding: '0 !important',
                                      width: '375px !important',
                                    }}
                                  >
                                    {INFOR_CAR.map((infor, index) => (
                                      <>
                                        <ListItem
                                          disableGutters
                                          style={{
                                            padding: '0',
                                            paddingTop: '5px',
                                            paddingBottom: '5px',
                                            display: 'inline-block',
                                            //background:'#b4a7d6'
                                            
                                          }}
                                        >
                                          <div style={{ float: 'left'}}>
                                            <img
                                              src={`/static/iconSvg/${infor.icon}.svg`}
                                              style={{ paddingRight: '5px', marginLeft:'0 !important'}}
                                            />
                                            <b> {infor.label} </b>
                                          </div>

                                          <div
                                            style={{
                                              float: 'right',
                                              textAlign: 'right',
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
                              </Popup>
                              }

                              <Tooltip
                                direction="center"
                                permanent
                                position={[
                                  Number(vehicle.lat),
                                  Number(vehicle.lng)
                                ]}
                                opacity={1}
                                className='tooltip-label'
                              >
                                  <div class="license_number_marker">
                                    {vehicle.license_plate}
                                  </div>
                              </Tooltip>
                            </>
                          }
                        </Marker>
                      ) : null}
                    </>
                  );
                }
              })
            : null}

          {currentLocation && (
            <Marker
              icon={displayLocationIcon()}
              position={currentLocation}
            >
              <Tooltip
                className='tooltip-label'
                position={currentLocation}
                direction='right'
                permanent
              >
                <>
                  <div class="your_location"> Vị trí của bạn</div>
                </>
              </Tooltip>
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
      </MapContainer>
    </>
  );
}

export default React.memo(MapOsm);
