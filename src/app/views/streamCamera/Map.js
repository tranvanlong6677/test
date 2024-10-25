import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import { renderIconCar } from 'src/app/utils/mapService';
import _size from 'lodash/size';
import './style.css';
import { List, ListItem, Divider } from '@material-ui/core';
import { INFOR_CAR } from 'src/app/constant/config';
import moment from 'moment';

const options = { closeBoxURL: '', enableEventPropagation: true };
const RotateIcon = function(options){
  this.options = options || {};
  this.rImg = options.img || new Image();
  this.rImg.src = this.rImg.src || this.options.url || '';
  this.options.width = this.options.width || this.rImg.width || 52;
  this.options.height = this.options.height || this.rImg.height || 60;
  const canvas = document.createElement("canvas");
  canvas.width = this.options.width;
  canvas.height = this.options.height;
  this.context = canvas.getContext("2d");
  this.canvas = canvas;
};
RotateIcon.makeIcon = function(url) {
  return new RotateIcon({url: url});
};

RotateIcon.prototype.setRotation = function(options){
  const canvas = this.context,
  angle = options.deg ? options.deg * Math.PI / 180:
  options.rad,
  centerX = this.options.width/2,
  centerY = this.options.height/2;
  canvas.clearRect(0, 0, this.options.width, this.options.height);
  canvas.save();
  canvas.translate(centerX, centerY);
  canvas.rotate(angle);
  canvas.translate(-centerX, -centerY);
  canvas.drawImage(this.rImg, 0, 0);
  canvas.restore();
  return this;
};
RotateIcon.prototype.getUrl = function(){
  return this.canvas.toDataURL('image/png');
};

function Map({ listVehicle, center, zoom }) {
  const centerInRedux = useSelector(state => state.vehicleSlice.centerMap);
  const centerMap = _size(center) > 0 ? center : centerInRedux;
  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
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

  return (
    <>
      <GoogleMap
        defaultZoom={13}
        defaultCenter={centerMap}
        center={centerMap}
        options={{
          streetViewControl: false,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
            mapTypeIds: [
              window.google.maps.MapTypeId.ROADMAP,
              window.google.maps.MapTypeId.SATELLITE,
              window.google.maps.MapTypeId.HYBRID
            ]
          },
          zoomControl: false
        }}
      >
        <>
          {showInfoWindow && positionsInfoBox ? (
            <InfoWindow
              options={options}
              position={new window.google.maps.LatLng(positionsInfoBox)}
              className="info_vehicle_window"
              onCloseClick={handleCloseInfo}
            >
              <>
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
                  style={{ padding: '0', width: '375px !important' }}
                >
                  {INFOR_CAR.map((infor, index) => (
                    <>
                      <ListItem
                        disableGutters
                        key={index}
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
              </>
            </InfoWindow>
          ) : null}
          {listVehicle &&
          listVehicle.map((vehicle, index) => (
            <>
              {vehicle && vehicle.lat && vehicle.lng ? (
                <Marker
                  options={{
                    rotation: 50,
                    anchor: (0, 0)
                  }}
                  key={index}
                  position={{
                    lat: Number(vehicle.lat),
                    lng: Number(vehicle.lng)
                  }}
                  onClick={() => handleMarkerClick(vehicle)}
                  icon={RotateIcon.makeIcon(renderIconCar(vehicle, statisticVehicleTracking)).setRotation({ deg: vehicle.direction }).getUrl()}
                >
                  {
                    <InfoBox
                      options={options}
                      position={new window.google.maps.LatLng(vehicle)}
                    >
                      <>
                        <div className="license_number_marker">
                          {vehicle.license_plate}
                        </div>
                      </>
                    </InfoBox>
                  }
                </Marker>
              ) : null}
            </>
          ))}
        </>
      </GoogleMap>
    </>
  );
}

export default withScriptjs(withGoogleMap(Map));
