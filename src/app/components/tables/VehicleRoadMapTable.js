import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './style.css';
import moment from 'moment';
import { useSelector } from 'react-redux';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
}))(TableRow);

const VehicleRoadMapTable = ({
  vehicles,
  getVihicle,
  mode,
  isLoading,
  showColumns
}) => {
  const scrollToBottom = () => {
    vehiclesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const {
    gpsSpeedCol,
    speedCol,
    airConditionStatusCol,
    engineStatusCol
  } = showColumns;
  const positionsDevice = useSelector(
    state => state.deviceSlice.positionsDevice
  );
  const vehiclesEndRef = useRef(null);
  //console.log('=====>VehicleRoadMapTable:', vehicles, mode, showColumns);
  // const [kmRender, setKm] = useState(0);
  // useEffect(() => {
  //   let km = 0;
  //   positionsDevice && positionsDevice.map((item) => {
  //     if (item.originalIndex) {
  //       km = km + item.speedDigitalMeter;
  //     }
  //   })
  //   setKm(km);
  // }, [positionsDevice])
  const handleRowClick = vehicle => {
    // console.log('handleRowClick****',vehicle);
    // console.log('mode***',mode);
    if (mode === 'all') {
      getVihicle(vehicle);
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [vehicles]);
  return (
    <div style={{ minHeight: '130px' }}>
      <TableContainer component={Paper} className="vehicle_table_road_map">
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            style={{
              background: '#C62222 !important',
              color: 'white !important'
            }}
          >
            <TableRow>
              <TableCell align="center">Thời gian</TableCell>
              {speedCol && (
                <TableCell align="center">Vận tốc (Km/h) </TableCell>
              )}
              {gpsSpeedCol && <TableCell align="center">Vận tốc GPS</TableCell>}
              {engineStatusCol && <TableCell align="center">Động cơ</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles?.map((row, index) => {
              return (
                <StyledTableRow
                  key={row.vehicle_id ?? row.id ?? index + 1}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell align="center">
                    {moment.unix(row.created_at).format('DD/MM HH:mm')}
                  </TableCell>
                  {speedCol && (
                    <TableCell align="center">{row.speed || 0}</TableCell>
                  )}
                  {gpsSpeedCol && (
                    <TableCell align="center">
                      {Number.isInteger(row.speedGps) && row.speedGps === 0
                        ? row.speedGps
                        : Math.floor(row.speedGps) || '--'}
                    </TableCell>
                  )}
                  {engineStatusCol && (
                    <TableCell align="center">
                      {row.engineStatus || '--'}
                    </TableCell>
                  )}
                </StyledTableRow>
              );
            })}
            <div ref={vehiclesEndRef} />
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", margin: "8px" }}>Tổng số km {kmRender}</div> */}
    </div>
  );
};

export default React.memo(VehicleRoadMapTable);
