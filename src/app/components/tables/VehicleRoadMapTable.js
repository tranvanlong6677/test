import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import './style.css';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
}))(TableRow);

const VehicleRoadMapTable = ({ vehicles, getVihicle, mode, showColumns }) => {
  const scrollToBottom = () => {
    vehiclesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const { gpsSpeedCol, speedCol, engineStatusCol } = showColumns;

  const vehiclesEndRef = useRef(null);

  const handleRowClick = vehicle => {
    if (mode === 'all') {
      getVihicle(vehicle);
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [vehicles]);
  return (
    <div style={{ minHeight: '130px' }}>
      bảng hiển thị lộ trình
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
    </div>
  );
};

export default React.memo(VehicleRoadMapTable);
