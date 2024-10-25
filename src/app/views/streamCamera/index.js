import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Grid, makeStyles } from '@material-ui/core';
import Map from './Map';
import './style.css';
import Loading from 'src/app/components/Loading';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';
import { GetUserInfo } from 'src/features/authSlice';
import { getListVehicleTracking } from 'src/features/vehicleSlice';
import MenuVideo from 'src/app/components/camera/MenuVideo';
import VideoComponent from './VideoComponent';
import VideoWall from './VideoWall';
import DriverTable from 'src/app/components/camera/DriverTable';
import _ from "lodash"
import MapOsmCamera from './MapOsmCamera';
const MapView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserInfo());
  }, []);

  const query = new URLSearchParams(useLocation().search);
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const isAgency =
    dataLogin && dataLogin.role && dataLogin.role.title === 'agency';
  const agencyID = isAgency ? dataLogin.agency.id : undefined;
  let deviceSerial = query.get('device_serial')
    ? query.get('device_serial')
    : undefined;

  useEffect(() => {
    if (agencyID) {
      // console.log('getListVehicleTracking');
      dispatch(getListVehicleTracking(agencyID + '?device_type=VGPS-CAM01'));
      const i = window.setInterval(() => {
        dispatch(getListVehicleTracking(agencyID + '?device_type=VGPS-CAM01'));
      }, 10000);
      return () => {
        window.clearInterval(i);
      };
    }
  }, [agencyID]);

  const listVehicle = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );
  const statusGetAll = useSelector(state => state.vehicleSlice.statusGetAll);
  const [params, setParams] = useState({
    id: 1,
    page: 1,
    pageSize: PAGE_SIZE_LIST
  });

  //const [roomID, setRoomID] = useState();
  //const [cameraId, setCameraId] = useState();
  const [center, setCenter] = useState({});
  const [zoom, setZoom] = useState(0);

  const [dataDriver, setDataDriver] = useState([]);

  

  useEffect(() => {
    if (query.get('device_serial')) {
      //setRoomID(query.get('device_serial'));
      //set tạm để play
      //setCameraId('010203040506');
    }
  }, [query]);

  useEffect(() => {
    if (query.get('device_serial')) {
      const vehicle = findVehicle(query.get('device_serial'));
      getVihicle(vehicle);
    }
  }, [listVehicle]);

  const findVehicle = deviceSerial => {
    const device = listVehicle.filter(vehicle => {
      return vehicle.device_serial === deviceSerial;
    });

    return device.length > 0 ? device[0] : null;
  };

  const getVihicle = vehicle => {
    if (vehicle && vehicle.lat && vehicle.lng) { 
      localStorage.setItem('center', `(${vehicle.lat}, ${vehicle.lng})`);
      setCenter({ lat: Number(vehicle.lat), lng: Number(vehicle.lng) });
      setZoom(15);
    }
  };

  const getDriverInfo = vehicle => {
    const dataDriverClone = _.cloneDeep(dataDriver)
    let isExitIndex = dataDriverClone.findIndex(driver => driver.device_serial === vehicle.device_serial)
      if(isExitIndex > -1){    
          dataDriverClone[isExitIndex] = vehicle
          setDataDriver(dataDriverClone)
      }else{
          setDataDriver([...dataDriverClone,vehicle])
      }
  }

  const listVehicles = listVehicle.filter(vehicle => {
    return vehicle.device_serial === query.get('device_serial');
  });

  const key = process.env.REACT_APP_GGMAP_API_KEY;

  return (
    <div className="flex">
      <div>
        <div className="row my-2">
          <div
            className="col-3"
            style={{
              paddingRight: 5
            }}
          >
            <MenuVideo
              statusGetAll={statusGetAll}
              getVihicle={getVihicle}
              listVehicle={listVehicle}
              //  setRoomID={setRoomID}
              getDriverInfo = {getDriverInfo}
            />
          </div>
          <div 
            className="col-6"
            style={{
              paddingRight: 0,
              paddingLeft: 0,
              
            }}
          >
            {/*<VideoComponent roomID={roomID} key={roomID}/>*/}
            <div 
              style={{
                paddingRight: 10,
                paddingLeft: 10,
                marginBottom:0,
              }}
            
            >
              <VideoWall deviceSerial={deviceSerial} key={deviceSerial} />
            </div>
            <div
              style={{
               width:'100%'
              }}
              
            >
              <DriverTable 
                  dataDriver={dataDriver}
                  statusGetAll={statusGetAll}
                />
            </div>
          </div>
          <div
            className="col-3"
            style={{
              paddingLeft: 2.5
            }}
          >
            {
              <>
              
                {/* <Map
                  center={center}
                  zoom={zoom}
                  listVehicle={
                    query.get('device_serial') ? listVehicles : listVehicle
                  }
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<Loading />}
                  containerElement={
                    <div style={{ height: `87vh`, width: '100%' }} />
                  }
                  mapElement={<div style={{ height: `87vh`, width: '100%' }} />}
                /> */}

                <MapOsmCamera
                  center={center}
                  zoom={zoom}
                  listVehicle={
                    query.get('device_serial') ? listVehicles : listVehicle
                  }
                  loadingElement={<Loading />}
                  containerElement={
                    <div style={{ height: `87vh`, width: '100%' }} />
                  }
                  mapElement={<div style={{ height: `87vh`, width: '100%' }} />}
                />
              </>


            }
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '80vh',
    paddingTop: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0
  },
  mapWrap: {
    width: '100%',
    height: '90vh ',
    position: 'relative'
  }
}));

export default MapView;
