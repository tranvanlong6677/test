import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.css';
import moment from 'moment';
import { STATUS_API } from 'src/app/constant/config';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
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

const VehicleTable = ({ vehicles, getVihicle, carStatus, deviceType }) => {
  const navigate = useNavigate();
  const [rowActive, setRowActive] = useState(null);
  const statusGetListTracking = useSelector(state => state.vehicleSlice.statusGetListTracking)
  const [allVehicles, setAllVehicles] = useState(vehicles);
  const listVehicleTracking = useSelector(state => state.vehicleSlice.listVehicleTracking);
  const statisticVehicleTracking = useSelector(state => state.vehicleSlice.statisticVehicleTracking);
  useEffect(() => {
    setAllVehicles(vehicles);
  }, [vehicles])

  const handleRowClick = vehicle => {
    setRowActive(vehicle.device_id)
    getVihicle(vehicle);
  };

  console.log('carStatus && deviceType && listVehicleTracking >>>>>',carStatus,deviceType,listVehicleTracking);

  const renderBody = listVehicleTracking.length > 0 ? listVehicleTracking?.map((row, index) => {
    if (carStatus || deviceType) {
      if (carStatus && !deviceType && carStatus == row.device_status) {
        return (
          <TableBody >
            <StyledTableRow
              className={row.device_id === rowActive ? 'row-actived' : ''}
              key={row.vehicle_id ?? row.id ?? index + 1}
              onClick={() => handleRowClick(row)}
            >
              <TableCell key={index} align="center" style={{ display: 'flex', alignItems: "center", verticalAlign: 'middle' }}>
                {
                  row.device_status == "lost_gps" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gsm.svg`} />
                }
                {
                  row.device_status == "lost_gms" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gps.svg`} />
                }
                {
                  row.device_status == "stopped" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_stopped.svg`} />
                }
                {
                  row.device_status == "moving" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_moving.svg`} />
                }
                {
                  row.device_status == "over_speed" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_out_speed.svg`} />
                }
                <b>{row.license_plate}</b>
                {
                  row.device_type == "VGPS-CAM01" && <div onClick={() => navigate(`/app/camera?device_serial=${row.device_serial}`)}><img alt="car" className="table-icon-car"  width="10px" src={`/static/iconSvg/video-solid.svg`} /></div>
                }
              </TableCell>


              <TableCell align="center">{Math.floor(row.speed_gps) || 0}</TableCell>
              <TableCell align="center">{row ? moment.unix(row.created_at).format('DD/MM HH:mm:ss') : '--'}</TableCell>

            </StyledTableRow>
          </TableBody >
        )
      }
      if (!carStatus && deviceType && deviceType == row.device_type) {
        return (
          <TableBody >
            <StyledTableRow
              className={row.device_id === rowActive ? 'row-actived' : ''}
              key={row.vehicle_id ?? row.id ?? index + 1}
              onClick={() => handleRowClick(row)}
            >
              <TableCell key={index} align="center" style={{ display: 'flex', alignItems: "center", verticalAlign: 'middle' }}>
                {
                  row.device_status == "lost_gps" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gsm.svg`} />
                }
                {
                  row.device_status == "lost_gms" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gps.svg`} />
                }
                {
                  row.device_status == "stopped" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_stopped.svg`} />
                }
                {
                  row.device_status == "moving" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_moving.svg`} />
                }
                {
                  row.device_status == "over_speed" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_out_speed.svg`} />
                }
                <b>{row.license_plate}</b>
                {
                  row.device_type == "VGPS-CAM01" && <div onClick={() => navigate(`/app/camera?device_serial=${row.device_serial}`)}><img alt="car" className="table-icon-car"  width="10px" src={`/static/iconSvg/video-solid.svg`} /></div>
                }
              </TableCell>


              <TableCell align="center">{Math.floor(row.speed_gps) || 0}</TableCell>
              <TableCell align="center">{row ? moment.unix(row.created_at).format('DD/MM HH:mm:ss') : '--'}</TableCell>

            </StyledTableRow>
          </TableBody >
        )
      }
      if (carStatus && deviceType && carStatus == row.device_status && deviceType == row.device_type) {
        return (
          <TableBody >
            <StyledTableRow
              className={row.device_id === rowActive ? 'row-actived' : ''}
              key={row.vehicle_id ?? row.id ?? index + 1}
              onClick={() => handleRowClick(row)}
            >
              <TableCell key={index} align="center" style={{ display: 'flex', alignItems: "center", verticalAlign: 'middle' }}>
                {
                  row.device_status == "lost_gps" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gsm.svg`} />
                }
                {
                  row.device_status == "lost_gms" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gps.svg`} />
                }
                {
                  row.device_status == "stopped" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_stopped.svg`} />
                }
                {
                  row.device_status == "moving" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_moving.svg`} />
                }
                {
                  row.device_status == "over_speed" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_out_speed.svg`} />
                }
                <b>{row.license_plate}</b>
                {
                  row.device_type == "VGPS-CAM01" && <div style={{ marginLeft: "4px" }} onClick={() => navigate(`/app/camera?device_serial=${row.device_serial}`)}><img alt="car" className="table-icon-car"  width="10px" src={`/static/iconSvg/video-solid.svg`} /></div>
                }
              </TableCell>


              <TableCell align="center">{Math.floor(row.speed_gps) || 0}</TableCell>
              <TableCell align="center">{row ? moment.unix(row.created_at).format('DD/MM HH:mm:ss') : '--'}</TableCell>

            </StyledTableRow>
          </TableBody >
        )
      }
    }
    else {
      return (
        <TableBody >
          <StyledTableRow
            className={row.device_id === rowActive ? 'row-actived' : ''}
            key={row.vehicle_id ?? row.id ?? index + 1}
            onClick={() => handleRowClick(row)}
          >
            <TableCell key={index} align="center" style={{ display: 'flex', alignItems: "center", verticalAlign: 'middle' }}>
              {
                row.device_status == "lost_gps" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gsm.svg`} />
              }
              {
                row.device_status == "lost_gms" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_lost_gps.svg`} />
              }
              {
                row.device_status == "stopped" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_stopped.svg`} />
              }
              {
                row.device_status == "moving" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_moving.svg`} />
              }
              {
                row.device_status == "over_speed" && <img alt="car" className="table-icon-car" width="25px" src={`/static/iconSvg/cars/car_out_speed.svg`} />
              }
              <b>{row.license_plate}</b>
              {
                row.device_type == "VGPS-CAM01" && <div style={{ marginLeft: "4px" }} onClick={() => navigate(`/app/camera?device_serial=${row.device_serial}`)}><img alt="car" className="table-icon-car" width="10px" src={`/static/iconSvg/video-solid.svg`} /></div>
              }
            </TableCell>


            <TableCell align="center">{Math.floor(row.speed_gps) || 0}</TableCell>
            <TableCell align="center">{row ? moment.unix(row.created_at).format('DD/MM HH:mm:ss') : '--'}</TableCell>

          </StyledTableRow>
        </TableBody >
      )
    }

  }
  ) : <caption> Không có thiết bị </caption>

  return (
    <div style={{ minHeight: '130px' }}>
      <TableContainer component={Paper} className="vehicle_table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            style={{ background: '#C62222 !important', color: 'white !important' }}
          >
            <TableRow>
              <TableCell align="center">Biển số</TableCell>
              <TableCell align="center">Vận tốc (Km/h) </TableCell>
              <TableCell align="center">Thời gian</TableCell>
            </TableRow>
          </TableHead>
          {statusGetListTracking !== STATUS_API.LOADING ? renderBody : <caption >
            <div style={{ textAlign: 'center', padding: 20 }}> <CircularProgress />
            </div> </caption>}
        </Table>
      </TableContainer>
    </div>
  );
};

export default React.memo(VehicleTable);
