import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import Map from './PlaybackMap';
import './style.css';
import Loading from 'src/app/components/Loading';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';
import { GetUserInfo } from 'src/features/authSlice';
import { getListVehicleTracking, getListVehicle } from 'src/features/vehicleSlice';
import PlaybackVideo from './PlaybackVideo';
import PlaybackMap from './PlaybackMap';
import Page from 'src/app/components/Page';
import { getListVod } from 'src/features/playback';
import PlaybackMapOsm from './PlaybackMapOsm';




const PlaybackView = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetUserInfo());
  }, []);



  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAgency =
    dataLogin && dataLogin.role && dataLogin.role.title == 'agency';
  const agencyID = isAgency && dataLogin.agency ?  dataLogin.agency.id : undefined;

  useEffect(() => {
    if (agencyID) {
      dispatch(getListVehicleTracking(agencyID))
    }
  }, [agencyID]);


  

  const schedule = useSelector(state => state.schedule);
  const deviceSerial = '010203040506';
  const cameras = [
    {
      id: `${deviceSerial}_01`,
      name: 'CH1'
    }
  ];

  const listVehicle = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );
 
  
  const [params, setParams] = useState({
    id: 1,
    page: 1,
    pageSize: PAGE_SIZE_LIST
  });

  const [center, setCenter] = useState({});
  const [zoom, setZoom] = useState(0);

  const key = process.env.REACT_APP_GGMAP_API_KEY;
  /*const getVods = data => {
    dispatch(getListVod({ ...data }));
  };*/

  useEffect(() => {
    /*const data = {
      channelId: deviceSerial,
      date: '1706572800'
    };
    getVods(data);*/
  }, []);

  return (
    <div className="flex">
      <div className="row my-2">
        <div
          className="col-7"
          style={{
            paddingLeft: 2,
            paddingRight: 2
          }}
        >
          <Page className={classes.root}>
            <div class="flex">
              <div className={classes.mapWrap}>
                <div>
                  {
                    <>                 
                    {/* <PlaybackMap
                      listVehicle={listVehicle}
                      className="map"
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<Loading />}
                      containerElement={<div style={{ height: `88vh` }} />}
                      mapElement={<div style={{ height: `88vh` }} />}
                    /> */}

                    <PlaybackMapOsm
                      listVehicle={listVehicle}
                      className="map"
                      loadingElement={<Loading />}
                      containerElement={<div style={{ height: `88vh` }} />}
                      mapElement={<div style={{ height: `88vh` }} />}
                    />
                    </>
                  }
                </div>
              </div>
            </div>
          </Page>
        </div>
        <div
          className="col-5"
          style={{
            paddingLeft: 2,
            paddingRight: 2
          }}
        >
          <PlaybackVideo deviceSerial={deviceSerial} key={deviceSerial} />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '80vh',
    paddingLeft: 0,
    paddingRight: 0
  },
  mapWrap: {
    width: '100%',
    height: 'calc(100%-80px)',
    position: 'relative'
  }
}));

export default PlaybackView;
