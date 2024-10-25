import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { renderIconCar } from 'src/app/utils/mapService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
}))(TableRow);

const VehicleTable = ({ vehicles, getVihicle, setRoomID, getDriverInfo }) => {
  const navigate = useNavigate();
  const query = useQuery();
  const [rowActive, setRowActive] = useState(query.get('device_serial') || null);
  const [allVehicles, setAllVehicles] = useState(vehicles);
  const statisticVehicleTracking = useSelector(
    state => state.vehicleSlice.statisticVehicleTracking
  );
  useEffect(() => {
    setAllVehicles(vehicles);
  }, [vehicles]);

  const handleRowClick = vehicle => {
    getVihicle(vehicle);
    getDriverInfo(vehicle)
    setRowActive(vehicle.device_serial);
   // setRoomID(vehicle.device_serial)
    navigate(`/app/camera?device_serial=${vehicle.device_serial}`);

    // window.open(`/app/camera?device_serial=${vehicle.device_serial}`, '_self');
  };

  //console.log('allVehicles >>>',allVehicles );

  return (
    <div style={{ minHeight: '130px' }}>
      <TableContainer component={Paper} className="vehicle_table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            style={{ background: '#C62222 !important', color: 'white !important' }}
          >
            <TableRow>
              {/* <TableCell align="center"></TableCell> */}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {allVehicles && allVehicles?.map((row, index) => {
              return (
                <StyledTableRow
                  className={row.device_serial === rowActive ? 'row-actived' : ''}
                  key={row.vehicle_id ?? row.id ?? index + 1}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell align="center" style={{ display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>
                    <img alt="icon" class="table-icon-car" width="25px"
                         src={renderIconCar(row, statisticVehicleTracking)} />
                    <b>{row.license_plate}</b>
                  </TableCell>
            
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer >
    </div>
  );
};

export default React.memo(VehicleTable);
