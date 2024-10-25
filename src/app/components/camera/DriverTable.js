import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import moment from 'moment';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer',
    
  }
}))(TableRow);

const DriverTable = ({ dataDriver, statusGetAll }) => {
  console.log('dataDriver driver>>>', dataDriver);

  return (
   
      <div style={{ 
        minHeight: '80px', 
        width:'50%',
        position:'absolute',
        bottom:'11px'   
        }}> 
        <TableContainer component={Paper} className="vehicle_table">
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              style={{
                background: '#C62222 !important',
                color: 'white !important'
              }}
            >
              <TableRow>
                <TableCell align="center">Biển số</TableCell>
                <TableCell align="center">Tên tài xế </TableCell>
                <TableCell align="center">Thời gian</TableCell>
                <TableCell align="center">Tốc độ (Km/h)</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Vị trí</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataDriver.map(driver => {
               
                return (
                  <StyledTableRow>
                    <TableCell
                      align="center"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      {driver.license_plate}
                    </TableCell>
                    <TableCell align="center">{driver.driver_name}</TableCell>
                    <TableCell align="center">
                      {driver
                        ? moment.unix(driver.created_at).format('DD/MM HH:mm:ss')
                        : '--'}
                    </TableCell>
                    <TableCell align="center">
                      {Math.floor(driver.speed_gps) || '--'}
                    </TableCell>
                    <TableCell align="center">{driver.device_status}</TableCell>
                    <TableCell align="center">{driver.location}</TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
};

export default DriverTable;
