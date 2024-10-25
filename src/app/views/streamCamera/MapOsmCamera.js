import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { renderIconCar } from 'src/app/utils/mapService';
import _size from 'lodash/size';
import './style.css';
import { List, ListItem, Divider } from '@material-ui/core';
import { INFOR_CAR } from 'src/app/constant/config';
import moment from 'moment';

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

const options = { closeBoxURL: '', enableEventPropagation: true };
const RotateIcon = function(options) {
  this.options = options || {};
  this.rImg = options.img || new Image();
  this.rImg.src = this.rImg.src || this.options.url || '';
  this.options.width = this.options.width || this.rImg.width || 52;
  this.options.height = this.options.height || this.rImg.height || 60;
  const canvas = document.createElement('canvas');
  canvas.width = this.options.width;
  canvas.height = this.options.height;
  this.context = canvas.getContext('2d');
  this.canvas = canvas;
};
RotateIcon.makeIcon = function(url) {
  return new RotateIcon({ url: url });
};

RotateIcon.prototype.setRotation = function(options) {
  const canvas = this.context,
    angle = options.deg ? (options.deg * Math.PI) / 180 : options.rad,
    centerX = this.options.width / 2,
    centerY = this.options.height / 2;
  canvas.clearRect(0, 0, this.options.width, this.options.height);
  canvas.save();
  canvas.translate(centerX, centerY);
  canvas.rotate(angle);
  canvas.translate(-centerX, -centerY);
  canvas.drawImage(this.rImg, 0, 0);
  canvas.restore();
  return this;
};
RotateIcon.prototype.getUrl = function() {
  return this.canvas.toDataURL('image/png');
};

function MapOsmCamera({ listVehicle, center, zoom, setMapMode }) {
  const centerInRedux = useSelector(state => state.vehicleSlice.centerMap);
  const centerMap = _size(center) > 0 ? center : centerInRedux;
  console.log('center =====>>>', centerMap);
  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const statisticVehicleTracking = useSelector(
    state => state.vehicleSlice.statisticVehicleTracking
  );
  const renderValueInWindowBox = infor => {
    switch (infor.dataKey) {
      case 'created_at':
        return moment()
          .utc(positionsInfoBox[infor.dataKey])
          .format('DD/MM HH:mm:ss');

      case 'speed_gps':
        return `${Math.floor(positionsInfoBox[infor.dataKey])} Km/h`;

      case 'engine_status':
      case 'air_condition_status':
        return positionsInfoBox[infor.dataKey] ? 'Bật' : 'Tắt';

      default:
        return positionsInfoBox[infor.dataKey] ?? '--';
    }
  };

  const handleMarkerClick = vehicle => {
    if (vehicle && vehicle.lat && vehicle.lng) {
      setPositionsInfoBox({
        license_plate: vehicle.license_plate,
        lat: Number(vehicle.lat),
        lng: Number(vehicle.lng),
        created_at: vehicle.created_at,
        air_condition_status: vehicle.air_condition_status,
        battery: vehicle.battery,
        charge_status: vehicle.charge_status,
        speed_gps: vehicle.speed_gps,
        door_status: vehicle.door_status
      });
      setShowInfoWindow(true);
    }
  };

  const handleCloseInfo = () => {
    setShowInfoWindow(false);
    setPositionsInfoBox();
  };

  const handleDisplayIcon = (vehicle, statisticVehicleTracking) => {
    const iconSize = [35, 35];
    const url = RotateIcon.makeIcon(
      renderIconCar(vehicle,statisticVehicleTracking)
    )
      .setRotation({ deg: vehicle.direction })
      .getUrl();
    let makerIcon = new L.icon({
      iconUrl: url,
      iconSize: iconSize,
      iconAnchor: [17, 35],
      popupAnchor: [0, -35]
    });

    L.Marker.prototype.options.icon = makerIcon;
    return makerIcon;
  }

  return (
    <>
      <MapContainer
        center={[centerMap.lat, centerMap.lng]}
        zoom={13}
        maxZoom={18}
        style={{ height: '92vh' }}
        zoomControl={false}
        scrollWheelZoom={true}
        whenCreated={mapR => setMapRef(mapR)}
        zoomAnimation={true}
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
          {listVehicle &&
            listVehicle.map((vehicle, index) => (
              <Marker
                key={index}
                style={{ transform: 'rotate(90deg);' }}
                options={{
                  rotation: 180
                }}
                position={[Number(vehicle.lat), Number(vehicle.lng)]}
                eventHandlers={{
                  click: () => handleMarkerClick(vehicle)
                }}
                icon={handleDisplayIcon(vehicle, statisticVehicleTracking)}
              >
                <Popup
                  position={[Number(vehicle.lat), Number(vehicle.lng)]}
                  keepInView={true}
                  //minWidth={390}
                  minWidth={250}
                  maxHeight="auto"
                  autoPanPaddingTopLeft = {[20,10]}
                  au
                >
                  <div
                    style={{
                      background:'#ffffff',
                     // width: 200,
                      minWidth: 280,
                      maxHeight: '490px',
                      overflowY: 'scroll',
                      borderRadius:'7px',
                      padding:'5px 7px 0px 7px'
                    }}
                  >
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
                      style={{
                        padding: '0 !important',
                        maxWidth: '375px !important'
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
                              display: 'inline-block'
                              //background:'#b4a7d6'
                            }}
                          >
                            <div style={{ float: 'left' }}>
                              <img
                                src={`/static/iconSvg/${infor.icon}.svg`}
                                style={{
                                  paddingRight: '5px',
                                  marginLeft: '0 !important'
                                }}
                              />
                              <b> {infor.label} </b>
                            </div>

                            <div
                              style={{
                                float: 'right',
                                textAlign: 'right'
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
                  position={[Number(vehicle.lat), Number(vehicle.lng)]}
                  opacity={1}
                >
                  <div class="license_number_marker">
                    {vehicle.license_plate}
                  </div>
                </Tooltip>
              </Marker>
            ))}
        </>
        
      </MapContainer>
    </>
  );
}

export default MapOsmCamera;
