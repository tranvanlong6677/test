import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Page from 'src/app/components/Page';
import Map from './MapInstance';
import './style.css';
import Loading from 'src/app/components/Loading';
import _orderBy from 'lodash/orderBy';

import { PAGE_SIZE_LIST } from 'src/app/constant/config';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import {
  getListVehicle,
  getListVehicleTracking
} from 'src/features/vehicleSlice';
import MapOsm from './MapOsm';

const TrackingView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    id: 1,
    page: 1,
    pageSize: PAGE_SIZE_LIST
  });

  useEffect(() => {
    // dispatch(getListVehicleTracking(params))
  }, []);
  const key = process.env.REACT_APP_GGMAP_API_KEY;

  const [mapMode, setMapMode] = useState('googleMap')

  return (
    <Page className={classes.root}>
      <div class="flex">
        <div className={classes.mapWrap}>
          <div>
            {
              mapMode === 'googleMap' ? 
              <Map
                // listVehicle={_orderBy(listVehicle, 'license_plate', 'desc')}
                className="map"
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<Loading />}
                containerElement={<div style={{ height: `89vh` }} />}
                mapElement={<div style={{ height: `89vh` }} />}
                setMapMode= {setMapMode}
                mapMode = {mapMode}
              /> 
              :
              <MapOsm
                className="map"
                loadingElement={<Loading />}
                containerElement={<div style={{ height: `89vh` }} />}
                mapElement={<div style={{ height: `89vh` }} />}
                setMapMode= {setMapMode}
                mapMode = {mapMode}
              />
            }
            
          </div>
        </div>
      </div>
    </Page>
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

export default TrackingView;
