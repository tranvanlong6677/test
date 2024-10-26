import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Container, makeStyles } from '@material-ui/core';
import Page from 'src/app/components/Page';
import Map2 from './MapInstance2';
import './style.css';
import Loading from 'src/app/components/Loading';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';

import {
  getListVehicle,
  getListVehicleTracking
} from 'src/features/vehicleSlice';
import MapOsm2 from './MapOsm2';
// import Map from './Map'
const MapView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const listVehicle = useSelector(
    state => state.vehicleSlice.listVehicleTracking
  );

  const [params, setParams] = useState({
    id: 1,
    page: 1,
    pageSize: PAGE_SIZE_LIST
  });

  useEffect(() => {
    // dispatch(getListVehicle(params))
    // dispatch(getListVehicleTracking(params))
  }, []);

  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAgency =
    dataLogin && dataLogin.role && dataLogin.role.title == 'agency';
  const agencyID =
    isAgency && dataLogin.agency ? dataLogin.agency.id : undefined;

  useEffect(() => {
    if (agencyID) {
      dispatch(getListVehicleTracking(agencyID));
    }
  }, [agencyID]);
  console.log('re render');
  const key = process.env.REACT_APP_GGMAP_API_KEY;
  return (
    <Page className={classes.root}>
      <div class="flex">
        <div className={classes.mapWrap}>
          <div>
            hihi
            {
              <MapOsm2
                listVehicle={listVehicle}
                className="map"
                loadingElement={<Loading />}
                containerElement={<div style={{ height: `88vh` }} />}
                mapElement={<div style={{ height: `88vh` }} />}
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

export default MapView;
