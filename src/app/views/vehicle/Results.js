import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Chip,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  ACTION_TABLE,
  DEVICE_STATUS_VALUE,
  PAGE_SIZE_LIST
} from 'src/app/constant/config';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch } from 'react-redux';
import NullData from '../../components/NullData';

const Results = ({
  className,
  listVehicle,
  isLoading,
  getListVehicleRef,
  actionDetailsVehicleRef,
  totalVehicle,
  actionDeleteVehicleRef,
  //   checkPermissionEdit,
  //   checkPermissionView,
  ...rest
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE_LIST);
  const [page, setPage] = useState(0);
  const [params, setParams] = useState({
    page: page,
    page_size: limit
  });
  const getStatusVehicle = status => {
    let content = '';
    const index = DEVICE_STATUS_VALUE.findIndex(st => st.id == status);
    if (index >= 0) content = DEVICE_STATUS_VALUE[index]?.title;
    return <Chip label={content} color="primary" clickable />;
  };

  const handleLimitChange = event => {
    setLimit(event.target.value);
    if (!getListVehicleRef) return;
    const newparams = Object.assign({}, params, {
      page_size: event.target.value,
      page: 1
    });
    setParams(newparams);
    getListVehicleRef(newparams);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListVehicleRef) return;
    const newparams = Object.assign({}, params, { page: newPage + 1 });
    setParams(newparams);
    getListVehicleRef(newparams);
  };

  const onEditVehicle = (type, vehicle) => {
    if (!actionDetailsVehicleRef) return;
    const sendData = { type: type, data: vehicle };
    actionDetailsVehicleRef(sendData);
  };

  const handleRowClick = (vehicle) => {
    onEditVehicle(ACTION_TABLE.PREVIEW, vehicle)
  }

  return isLoading ? (
    <LoadingComponent />
  ) : (
    listVehicle && (
      <div>
        {listVehicle.length === 0 ? (
          <NullData />
        ) : (
          <Card className={clsx(classes.root, className)} {...rest}>
            <PerfectScrollbar>
              <Box minWidth={1050}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Biển số</TableCell>
                      {/*<TableCell>Serial</TableCell>*/}
                      {/*<TableCell>Phiên bản</TableCell>*/}
                      {/*<TableCell>Ngày xuất xưởng</TableCell>*/}
                      {/*<TableCell>Trạng thái</TableCell>*/}
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listVehicle?.map((vehicle, index) => (
                      <TableRow hover key={vehicle.id} >
                        <TableCell onClick={handleRowClick}>{index + 1}</TableCell>
                        <TableCell onClick={handleRowClick}>{vehicle.license_plate}</TableCell>
                        {/*<TableCell className={classes.minWithColumn}>*/}
                        {/*  {vehicle.serial}*/}
                        {/*</TableCell>*/}
                        {/*<TableCell>{vehicle.version}</TableCell>*/}
                        {/*<TableCell>{vehicle.date}</TableCell>*/}
                        {/*<TableCell>*/}
                        {/*  {getStatusVehicle(vehicle.status)}*/}
                        {/*</TableCell>*/}
                        {/*<TableCell onClick={() =>*/}
                        {/*        onEditVehicle(ACTION_TABLE.PREVIEW, vehicle)*/}
                        {/*      }>*/}
                        {/*  {getStatusVehicle(vehicle.status)}*/}
                        {/*</TableCell>*/}
                        <TableCell>
                          <div className={classes.groupAction}>
                            <div
                              className="action"
                              onClick={() =>
                                onEditVehicle(ACTION_TABLE.EDIT, vehicle)
                              }
                            >
                              <Tooltip title="Chỉnh sửa">
                                <EditIcon />
                              </Tooltip>
                            </div>
                            <div
                              className="action"
                              onClick={() => actionDeleteVehicleRef(vehicle)}
                            >
                              <Tooltip title="Xóa">
                                <DeleteIcon />
                              </Tooltip>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <TablePagination
              component="div"
              count={totalVehicle}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        )}
      </div>
    )
  );
};

Results.propTypes = {
  className: PropTypes.string,
  listVehicle: PropTypes.array.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  groupAction: {
    display: 'flex',
    alignItems: 'center',
    '& .action': {
      cursor: 'pointer',
      padding: '0 5px',
      '&:hover': {
        color: '#3f51b5'
      }
    }
  },
  minWithColumn: {
    minWidth: '150px'
  }
}));

export default Results;
