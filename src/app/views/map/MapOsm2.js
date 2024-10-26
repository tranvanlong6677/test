import { Button, Divider, List, ListItem } from '@material-ui/core';
import { ArrowRight } from '@material-ui/icons';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import _size from 'lodash/size';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import InfoVehiceBox from 'src/app/components/maps/InfoVehicleBox';
import MenuBox from 'src/app/components/maps/MenuBox';
import { INFOR_CAR } from 'src/app/constant/config';
import { renderIconCar1 } from 'src/app/utils/mapService';
import RotateIcon from 'src/app/utils/RotateIcon';
import { getDetailDevicePosition } from 'src/features/deviceSlice';
import './style.css';

function MapOsm2({ listVehicle }) {
  const dispatch = useDispatch();

  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const positionsDevice = useSelector(
    state => state.deviceSlice.positionsDevice
  );
  const center = useSelector(state => state.vehicleSlice.centerMap);

  const [positionsInfoBox, setPositionsInfoBox] = useState({});
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState([]);
  const [follow, setFollow] = useState(false);
  const [mode, setMode] = useState('lo_trinh');
  const [line, setLine] = useState([]);

  const [snapped, setSnapped] = useState([]);
  const [showMenu, setShowMenu] = useState(true);
  const [endPoint, setEndPoint] = useState();
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [carIdSelected, setCarIdSelected] = useState();
  const [startPoint, setStartPoint] = useState();
  const [positionNext, setPositionNext] = useState();
  const [originalPoints, setOriginalPoints] = useState([]);
  const [timer, setTimer] = useState(null);
  const [original, setOriginal] = useState();
  const [icons, setIcons] = useState([]);
  const markerRef = useRef();
  //osm
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

  console.log('original ===>', original);

  useEffect(() => {
    if (mode === 'all') {
      clearTimeout(timer);
    }
  }, [mode]);

  useEffect(() => {
    if (positionsDevice && positionsDevice.length > 0) {
      setMode('lo_trinh');
      loadSnapApi(positionsDevice);
    } else {
      setMode('all');
    }
  }, [positionsDevice]);

  useEffect(() => {
    if (snapped.length > 0) {
      setFollow(true);
    }
  }, [snapped]);

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
      setSnapped(newSnap);
      const arrNotNull = posDevice.filter(function(el) {
        return el != null;
      });
      const sPoint = [
        arrNotNull[0]?.location.latitude,
        arrNotNull[0]?.location.longitude
      ];

      const ePoint = [
        arrNotNull[arrNotNull.length - 1]?.location.latitude,
        arrNotNull[arrNotNull.length - 1]?.location.longitude
      ];

      setStartPoint(sPoint);
      setEndPoint(ePoint);
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

  const resetTracking = () => {
    setFollow(false);
    setLine([]);
    setOriginalPoints([]);
    setPosition(snapped[0]);
    setPositionNext();

    clearTimeout(timer);
  };

  const handleRoadTracking = async (v, range) => {
    setLine([]);
    setMode('lo_trinh');
    setShowMenu(true);
    dispatch(
      getDetailDevicePosition({
        id: v.device?.id,
        previous_hours: range
      })
    );
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
  };

  const getVihicle = v => {
    handleMarkerClick(v);
  };

  const handleDisplayIconFlag = statusIcon => {
    const iconSize = [20, 40];
    const url = renderIconCar1(statusIcon);

    let makerIcon = new L.icon({
      iconUrl: url,
      iconSize: iconSize,
      iconAnchor: [0, 40],
      popupAnchor: [0, -46]
    });

    L.Marker.prototype.options.icon = makerIcon;
    return makerIcon;
  };

  const renderStartPoint = () =>
    startPoint ? (
      <>
        <Marker
          key={1}
          zIndexOffset={3}
          position={startPoint}
          icon={handleDisplayIconFlag('begin')}
          eventHandlers={{
            click: startPoint => handleMarkerClick(startPoint)
          }}
        />

        <Marker
          key={2}
          options={{}}
          defaultZIndex={3}
          position={endPoint}
          eventHandlers={{
            click: endPoint => handleMarkerClick(endPoint)
          }}
          icon={handleDisplayIconFlag('begin')}
        />
      </>
    ) : (
      ''
    );

  //Set icons
  useEffect(() => {
    const updateIcons = async () => {
      if (listVehicle && listVehicle.length > 0) {
        const newIcons = await Promise.all(
          listVehicle.map(async vehicle => {
            if (vehicle && vehicle.lat && vehicle.lng) {
              const icon = await handleDisplayIcon(vehicle);
              return { ...vehicle, icon };
            }
            return null;
          })
        );
        setIcons(newIcons);
      } else {
        setIcons([]); // Nếu không thỏa mãn điều kiện, reset icons
      }
    };
    if (mode === 'all') updateIcons();
  }, [mode, listVehicle]);
  const getDegree = (pos1, pos2) => {
    if (
      Number(pos1.lat) !== Number(pos2.lat) ||
      Number(pos1.lng) !== Number(pos2.lng)
    ) {
      const point1LatLng = {
        lat: Number(pos1.lat),
        lng: Number(pos1.lng)
      };

      const point2LatLng = {
        lat: Number(pos2.lat),
        lng: Number(pos2.lng)
      };

      const angle =
        (Math.atan2(
          point2LatLng.lng - point1LatLng.lng,
          point2LatLng.lat - point1LatLng.lat
        ) *
          180) /
        Math.PI;

      if (markerRef.current) {
        const markerElement = markerRef.current.getElement();
        if (markerElement) {
          markerElement.style.transform = `rotate(${angle}deg)`;
        }
      }
    }
  };

  const handleDisplayIcon = async vehicle => {
    const iconSize = [35, 35];
    const rotateIcon = RotateIcon.makeIcon(
      renderIconCar1(vehicle ? vehicle.status : '')
    );
    await rotateIcon.setRotation({ deg: vehicle.direction });
    const updatedIconUrl = rotateIcon.getUrl();
    let makerIcon = new L.icon({
      iconUrl: updatedIconUrl,
      iconSize: iconSize,
      iconAnchor: [17, 35],
      popupAnchor: [0, -46]
    });
    return makerIcon;
  };

  const displayIcon1 = () => {
    const iconSize = [35, 35];
    const url = renderIconCar1(position ? position.status : '');

    let makerIcon = new L.icon({
      iconUrl: url,
      iconSize: iconSize,
      iconAnchor: [20, 20],
      popupAnchor: [0, -46]
    });

    L.Marker.prototype.options.icon = makerIcon;
    return makerIcon;
  };

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
      <MapContainer
        center={center}
        zoom={15}
        maxZoom={16}
        style={{ height: '92vh' }}
        zoomControl={false}
        scrollWheelZoom={true}
        whenCreated={() => {}}
        zoomAnimation={true}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=ZLjliqReTSXGIpeOzHPo"
        />
        <FullscreenControl forceSeparateButton={true} position="topright" />
        {showInfoWindow && positionsInfoBox ? (
          <Popup
            className="info_vehicle_window"
            popupclose={handleCloseInfo}
            position={[positionsInfoBox.lat, positionsInfoBox.lng]}
            eventHandlers={{
              remove: handleCloseInfo
            }}
          >
            <>
              <span
                color="primary"
                style={{ color: '#C62222', fontSize: '20px', fontWeight: 600 }}
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
                          alt="img"
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
          </Popup>
        ) : null}
        {mode == 'lo_trinh' && follow ? (
          <>
            <GeoJSON
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: snapped.map((lineItem, index) => {
                    return [lineItem.lng, lineItem.lat];
                  })
                },
                properties: {}
              }}
            />

            {position?.lat && position?.lng ? (
              <Marker
                position={[Number(position?.lat), Number(position?.lng)]}
                className="lo_trinh"
                ref={markerRef}
                eventHandlers={{
                  click: () => handleMarkerClick(position)
                }}
                icon={displayIcon1()}
                zIndexOffset={5}
              />
            ) : null}
          </>
        ) : (
          ''
        )}

        {mode === 'lo_trinh' ? renderStartPoint() : ''}

        {mode === 'all' && listVehicle && listVehicle.length > 0
          ? listVehicle.map((vehicle, index) => (
              <>
                {vehicle && vehicle.lat && vehicle.lng ? (
                  <Marker
                    key={index}
                    options={{
                      rotation: 50,
                      anchor: (0, 0)
                    }}
                    position={[Number(vehicle.lat), Number(vehicle.lng)]}
                    eventHandlers={{
                      click: () => handleMarkerClick(vehicle)
                    }}
                    icon={
                      icons.length > 0
                        ? icons.find(i => i.device_id === vehicle.device_id)
                            .icon
                        : L.icon({
                            iconUrl: renderIconCar1(
                              vehicle ? vehicle.status : ''
                            ),
                            iconSize: [35, 35],
                            iconAnchor: [17, 35],
                            popupAnchor: [0, -46]
                          })
                    }
                  ></Marker>
                ) : null}
              </>
            ))
          : null}
      </MapContainer>
    </>
  );
}

export default MapOsm2;
