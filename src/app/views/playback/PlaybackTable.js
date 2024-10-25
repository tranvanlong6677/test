import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './style_table.css';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Button, IconButton } from '@material-ui/core';
import { CloudDownload, PlayCircleFilled } from '@material-ui/icons';
import { vi } from 'date-fns/locale';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
}))(TableRow);

const PlaybackTable = ({ onRowClickView }) => {
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    vehiclesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const listVod = useSelector(state => state.vodSlice.listVod);

  const positionsDevice = useSelector(
    state => state.deviceSlice.positionsDevice
  );
  const vehiclesEndRef = useRef(null);
  const handleRowClickDownload = fileInfo => {
    alert(fileInfo);
  };

  const handleRowClickView = fileInfo => {
    onRowClickView(fileInfo);
  };
  useEffect(() => {
    scrollToBottom();
  }, [listVod]);
  return (
    <div
      style={{
        paddingTop: 2
      }}
    >
      <TableContainer component={Paper} className="vehicle_table_road_map">
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            style={{
              background: '#C62222 !important',
              color: 'white !important'
            }}
          >
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Tên file</TableCell>
              <TableCell align="center">Kích thước</TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listVod?.map((row, index) => {
              return (
                <StyledTableRow key={row.FileId ?? row.FileId ?? index + 1}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{row.FileName}</TableCell>
                  <TableCell align="center">{row.FileSize}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      title="Tải file"
                      onClick={() => handleRowClickDownload(row)}
                    >
                      <CloudDownload />
                    </IconButton>
                    <IconButton
                      title="Xem file"
                      onClick={() => handleRowClickView(row)}
                    >
                      <PlayCircleFilled />
                    </IconButton>
                  </TableCell>
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

export default React.memo(PlaybackTable);
