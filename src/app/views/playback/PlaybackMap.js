import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow
} from 'react-google-maps';
import InfoVehiceBox from 'src/app/components/maps/InfoVehicleBox';
import MenuBox from './PlaybackMenuBox';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import { ArrowRight, ContactMailSharp } from '@material-ui/icons';
import { splitAndMergeLatLng, renderIconCar1 } from 'src/app/utils/mapService';
import { getListVehicle, setCenterMap } from 'src/features/vehicleSlice';
import { getDetailDevicePosition } from 'src/features/deviceSlice';
import _size from 'lodash/size';
import axios from 'axios';
import './style.css';
import RotateIcon from 'src/app/utils/RotateIcon';
import { Button, List, ListItem, Divider } from '@material-ui/core';
import { INFOR_CAR } from 'src/app/constant/config';
import moment from 'moment';

const optionsPolyline = {
  strokeColor: '#085daa',
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: '#085daa',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

const options = { closeBoxURL: '', enableEventPropagation: true };
const mapOptions = {
  streetViewControl: false,
  mapTypeControlOptions: {
    style: 1,
    position: 9, //window.google.maps.ControlPosition.RIGHT_BOTTOM
    mapTypeIds: [
      'roadmap', //window.google.maps.MapTypeId.ROADMAP
      'satelite', //window.google.maps.MapTypeId.SATELLITE,
      'hybrid' //window.google.maps.MapTypeId.HYBRID
    ]
  },
  zoomControl: false
};

function PlaybackMap({ listVehicle }) {
  const dispatch = useDispatch();

  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const loadGPSInfo = useSelector(state => state.vodSlice.gpsPayload);

  const positionsDevice = useSelector(
    state => state.deviceSlice.positionsDevice
  );
  const center = useSelector(state => state.vehicleSlice.centerMap);

  // console.log('positionsDevice XXXXXXXXXXXXXXXXXXXX',positionsDevice);

  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});
  const [follow, setFollow] = useState(false);
  // const [center, setCenter] = useState({ lat: 21.0278, lng: 105.8342 });
  const [mode, setMode] = useState('');
  const [line, setLine] = useState([]);
  const [snapss, setSnapss] = useState([]);
  const [snapped, setSnapped] = useState([]);
  const [showMenu, setShowMenu] = useState(true);
  const [stoppedPoint, setStoppedPoint] = useState([]);
  const [endPoint, setEndPoint] = useState();
  const [zoom, setZoom] = useState(13);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [carIdSelected, setCarIdSelected] = useState();
  const [carSelected, setCarSelected] = useState();
  const [startPoint, setStartPoint] = useState();
  const [positionNext, setPositionNext] = useState();
  const [positionPrevious, setPositionPrevious] = useState();
  const [originalPoints, setOriginalPoints] = useState([]);
  const [timer, setTimer] = useState(null);
  const [rotate, setRotate] = useState(0);

  const [original, setOriginal] = useState();

  const handleClose = () => {
    setOpen(false);
  };

  const getPosCarNext = counter => {
    if (counter < snapped.length) {
      var timer = setTimeout(function() {
        counter++;
        if (
          !(
            Number.isInteger(snapped[counter]) &&
            snapped[counter].speedGps === 0
          )
        ) {
          setPosition(snapped[counter]);
          setPositionNext(snapped[counter + 1]);
          setPositionPrevious(snapped[counter - 1]);
        }

        setOriginal(snapped[counter]);
        getPosCarNext(counter);
      }, speed);

      setTimer(timer);
    }
  };

  useEffect(() => {
    if (_size(original) > 0 && follow) {
      const nline = line.concat(original);
      setLine(nline);

      if (original.originalIndex !== null) {
        const oPoint = originalPoints.concat(original);
        setOriginalPoints(oPoint);
      }
    }
  }, [original]);

  useEffect(() => {
    if (mode == 'all') {
      clearTimeout(timer);
    }
  }, [mode]);

  useEffect(() => {
    console.log('tungnd====>', loadGPSInfo);
    if (loadGPSInfo == null) return;
    //const fakeDate =first_time=1707760200&last_time=1707760320
    //const first_time = 1707760200, last_time = 1707760220;
    handleRoadTrackingUpdate({
      id: loadGPSInfo?.deviceId,
      first_time: parseInt(loadGPSInfo?.fileInfo?.FileId),
      last_time: parseInt(loadGPSInfo?.fileInfo?.FileId) + 600
    });
    //handleRoadTrackingUpdate();
  }, [loadGPSInfo]);


  useEffect(() => {
    setCarSelected(positionsDevice);
  }, [carIdSelected]);

  useEffect(() => {
    // const snapToRoads = splitAndMergeLatLng(null, positionsDevice)
    console.log('positionsDevice >>>',positionsDevice);
    if (positionsDevice && positionsDevice.length > 0) {
      setMode('lo_trinh');
      // loadSnapApi(snapToRoads)
      loadSnapApi(positionsDevice);
      /*setTimeout(() => {
        startFollow();
      }, 2000);*/
      // startFollow();
    } else {
      setMode('all');
    }
  }, [positionsDevice]);

  // const loadSnapApi = async (snapToRoads) => {
  const loadSnapApi = posDevice => {
    
    if (posDevice.length > 0) {

      const newSnap = posDevice?.map(function(value) {
        return {
          lat: value?.location.latitude,
          lng: value?.location.longitude,
          originalIndex:
            value && value.originalIndex ? value.originalIndex : null,
          created_at: value?.created_at ?? null,
          speed: value?.speedDigitalMeter ?? 0,
          airConditionStatus: value?.airConditionStatus,
          battery: value?.battery,
          chargeStatus: value?.chargeStatus,
          doorStatus: value?.doorStatus,
          engineStatus: value?.engineStatus,
          speedGps: value?.speedGps,
          placeId: value?.placeId,
          olat: value?.lat,
          olng: value?.lng
        };
      });
      if (newSnap.length > 0) {
        setFollow(true);
      }
      setSnapped(newSnap);

      const arrNotNull = posDevice.filter(function(el) {
        return el != null;
      });
      const sPoint = {
        lat: arrNotNull[0]?.location.latitude,
        lng: arrNotNull[0]?.location.longitude
      };

      const ePoint = {
        lat: arrNotNull[arrNotNull.length - 1]?.location.latitude,
        lng: arrNotNull[arrNotNull.length - 1]?.location.longitude
      };

      setStartPoint(sPoint);
      setEndPoint(ePoint);
      // setCenter(latLng)
      // dispatch(setCenterMap(latLng))
      // setStartPoint(latLng)
      // setSnapss(posDevice)
    }
  };

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

  const startFollow = () => {
    if (snapped.length > 0) {
      setFollow(true);
    }
  };

  useEffect(() => {
    if (follow) {
      getPosCarNext(0);
    } else {
      setLine([]);
    }
  }, [follow]);

  useEffect(() => {
    if (_size(positionNext) > 0 && follow) {
      getDegree(position, positionNext);
    }
  }, [positionNext, follow]);

  const resetTracking = () => {
    setFollow(false);
    setLine([]);
    setStoppedPoint([]);
    setOriginalPoints([]);
    setPosition(snapped[0]);
    setPositionNext();
    setPositionPrevious();
    setCarSelected();
    clearTimeout(timer);
  };

  const handleRoadTracking = async (v, range) => {
    setLine([]);
    setMode('lo_trinh');
    setShowMenu(true);
    console.log('test====>', v, range);
    dispatch(
      getDetailDevicePosition({
        id: v.device?.id,
        //previous_hours: range
        ...range
      })
    );
    //setCarIdSelected(v.vehicle_id);
    setCarIdSelected(v.vehicle_id);
  };

  const handleRoadTrackingUpdate = async ({ id, first_time, last_time }) => {
    setLine([]);
    setMode('lo_trinh');
    dispatch(
      getDetailDevicePosition({
        id: id,
        first_time: first_time,
        last_time: last_time
      })
    );
    if (!carIdSelected || carIdSelected !== id) {
      clearTimeout(timer);
    } else {
      setPosition(snapped[0]);
    }
    setShowMenu(true);
    setCarIdSelected(id);

    setTimeout(() => {
    startFollow();
    }, 2000);
  };

  const getVihicle = v => {
    handleMarkerClick(v);
    setCarSelected(v);
    setZoom(20);
  };

  const renderStartPoint = () =>
    startPoint ? (
      <>
        <Marker
          options={{}}
          defaultZIndex={3}
          position={startPoint}
          onClick={startPoint => handleMarkerClick(startPoint)}
          onCloseClick={handleCloseInfo}
          icon={{
            url: renderIconCar1('begin'),
            scaledSize: new window.google.maps.Size(20, 40),
            anchor: new window.google.maps.Point(0, 40),
            rotation: 0
          }}
        />

        <Marker
          options={{}}
          defaultZIndex={3}
          position={endPoint}
          onClick={endPoint => handleMarkerClick(endPoint)}
          onCloseClick={handleCloseInfo}
          icon={{
            url: renderIconCar1('begin'),
            scaledSize: new window.google.maps.Size(20, 40),
            anchor: new window.google.maps.Point(0, 40)
          }}
        />
      </>
    ) : (
      ''
    );


  const getDegree = (pos1, pos2) => {
    if (
      Number(pos1.lat) != Number(pos2.lat) ||
      Number(pos1.lng) != Number(pos2.lng)
    ) {
      const point1LatLng = new window.google.maps.LatLng(
        Number(pos1.lat),
        Number(pos1.lng)
      );
      const point2LatLng = new window.google.maps.LatLng(
        Number(pos2.lat),
        Number(pos2.lng)
      );
      const angle = window.google.maps.geometry.spherical.computeHeading(
        point1LatLng,
        point2LatLng
      );

      const actualAngle = angle;

      const markerUrl = '/static/iconSvg/cars/car_moving.svg';
      const marker = document.querySelector(`[src="${markerUrl}"]`);

      if (marker) {
        marker.style.transform = `rotate(${actualAngle}deg)`;
      }
    }
  };

  console.log('check Mod, follow >>>>>>>>',mode, follow);

  return (
    <>
      <InfoVehiceBox
        open={open}
        clickRoadTracking={handleRoadTracking}
        vehicle={positionsInfoBox}
        handleClose={handleClose}
      />
      <Button className="show_menu" sizeSmall onClick={() => setShowMenu(true)}>
        {' '}
        <ArrowRight />{' '}
      </Button>
      <MenuBox
        clickRoadTrackingUpdate={handleRoadTrackingUpdate}
        getVihicle={getVihicle}
        startFollow={startFollow}
        resetTracking={resetTracking}
        stoppedPoint={originalPoints}
        follow={follow}
        statusGetAll={statusGetAll}
        listVehicle={listVehicle}
        setSpeed={setSpeed}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
        mode={mode}
        setFollow={setFollow}
        setMode={setMode}
        setLine={setLine}
      />
      <GoogleMap
        defaultZoom={13}
        defaultCenter={center}
        center={center}
        defaultOptions={mapOptions}
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
          {mode == 'lo_trinh' && follow ? (
            <>
              <Polyline path={line} options={optionsPolyline} />
              {stoppedPoint.map((position, index) => (
                <Marker
                  defaultZIndex={1}
                  options={{
                    rotation: 90
                  }}
                  key={index}
                  position={{
                    lat: Number(position.lat),
                    lng: Number(position.lng)
                  }}
                  onClick={position => handleMarkerClick(position)}
                  onCloseClick={handleCloseInfo}
                  icon={{
                    url: renderIconCar1('stopped'),
                    scaledSize: new window.google.maps.Size(35, 35),
                    anchor: new window.google.maps.Point(20, 20),
                    rotation: 0
                  }}
                />
              ))}
              <Marker
                options={{
                  rotation: 50,
                  anchor: (0, 0)
                }}
                defaultZIndex={2}
                position={position}
                className="lo_trinh"
                onClick={position => handleMarkerClick(position)}
                onCloseClick={handleCloseInfo}
                icon={{
                  url: renderIconCar1(position ? position.status : ''),
                  scaledSize: new window.google.maps.Size(35, 35),
                  anchor: new window.google.maps.Point(20, 20),
                  rotation: 0
                }}
              />
            </>
          ) : (
            ''
          )}

          {mode == 'lo_trinh' ? renderStartPoint() : ''}

          {mode == 'all' && listVehicle && listVehicle.length > 0
            ? listVehicle.map((vehicle, index) => (
                <>
                  {vehicle && vehicle.lat && vehicle.lng ? (
                    <Marker
                      options={{
                        rotation: 50,
                        anchor: (0, 0)
                      }}
                      position={{
                        lat: Number(vehicle.lat),
                        lng: Number(vehicle.lng)
                      }}
                      onClick={() => handleMarkerClick(vehicle)}
                      icon={RotateIcon.makeIcon(
                        renderIconCar1(vehicle ? vehicle.status : '')
                      )
                        .setRotation({ deg: vehicle.direction })
                        .getUrl()}
                    >
                      {
                        <InfoBox
                          options={options}
                          position={new window.google.maps.LatLng(vehicle)}
                        >
                          <>
                            <div class="license_number_marker">
                              {vehicle.license_plate}
                            </div>
                          </>
                        </InfoBox>
                      }
                    </Marker>
                  ) : null}
                </>
              ))
            : null}
        </>
      </GoogleMap>
    </>
  );
}

export default withScriptjs(withGoogleMap(PlaybackMap));
