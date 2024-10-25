import React, { useEffect, useState } from 'react';
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
  Checkbox,
  Button,
  Popover,
  Fade,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import moment from 'moment';
import _size from 'lodash/size';
import ModalConfirm from 'src/app/components/ModalConfirm';
import {
  closeDialogConfirm,
  showDialogConfirm,
  showToast
} from 'src/features/uiSlice';
import {
  ACTION_TABLE,
  messageToastType_const,
  PAGE_SIZE_LIST,
  STATUS_API,
  DEVICE_STATUS,
  STORE_STATUS
} from 'src/app/constant/config';
import { MESSAGE } from 'src/app/constant/message';
import { useNavigate, useLocation } from 'react-router-dom';
import { _convertObjectToQuery } from 'src/app/utils/apiService';
import { Pagination } from '@material-ui/lab';

import LoadingComponent from 'src/app/components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import _remove from 'lodash/remove'
import {
  updateMultiDevices,
  deleteDevices
} from 'src/features/deviceSlice';
import { getListSales } from 'src/features/userSlice'
import SellerLists from 'src/app/components/modals/SellerLists'
import DialogConfirm from 'src/app/components/DialogConfirm';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import './style.css'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Results = ({
    className,
    listDevice,
    isLoading,
    getListDeviceRef,
    actionDetailsDeviceRef,
    totalDevice,
    actionDeleteDeviceRef,
//   checkPermissionEdit,
//   checkPermissionView,
    ...rest
  }) => {

  const query = useQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE_LIST);
  const [page, setPage] = useState(1);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [sellerSelected, setSellerSelected] = useState({});
  const [showSellerLists, setShowSellerLists] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [params, setParams] = useState({
    page: query.get('page') || page,
    page_size: query.get('page_size') || limit
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    if(query.get('page')) {
      setPage(query.get('page'));
      console.log(page);
    }
    if(query.get('page_size')) {
      setLimit(query.get('page_size'));
    }
  }, [])

  const checked = (id) => {
    return (rowsSelected.indexOf(id) !== -1)
  }

  const select = (deviceSerial) => {
    if (rowsSelected.indexOf(deviceSerial) === -1) {
      const newSelected = [deviceSerial, ...rowsSelected];
      setRowsSelected(newSelected);
    } else {
      const newSelected = rowsSelected.filter(i => i !== deviceSerial)
      setRowsSelected(newSelected);
      setSellerSelected({})
    }
  }

  const handleDeleteMultiDevices = () => {
    dispatch(showDialogConfirm());
  }
  const confirmDeleteDevices = () => {
    if (rowsSelected.length > 0) {
      dispatch(deleteDevices({ list_device_serial: rowsSelected }));
    }
  }

  const handleDeleteDevice = (id) => {
    console.log(id);
    // dispatch(deleteDevices({ list_device_id: [id] }));
  }

  useEffect(() => {
  }, [rowsSelected])

  const getStatusDevice = status => {
    switch(status) {
      case DEVICE_STATUS.ACTIVE:
        return <span className="badge-actived badge"> Đã kích hoạt </span>;
      case DEVICE_STATUS.INACTIVE:
        return <span className="badge-inActived badge"> Chưa kích hoạt </span>;
      default:
          return '-';
    }
  };

  const getStatusStore = status => {
    switch(status) {
      case STORE_STATUS.IN:
        return <Chip label={'Lưu kho'} variant="outlined" size="small" color='secondary' />;
      case DEVICE_STATUS.SELL:
        return <Chip label={'Đã bán'} variant="outlined" size="small" color='#76ff03' />;
      default:
        return '-';
    }
  };

  const  getListSeller = async () => {
    setShowSellerLists(true)
    dispatch(getListSales())
  }

  const changeDevicesStatus = () => {
    if(_size(sellerSelected) > 0 && rowsSelected.length > 0) {
      dispatch(updateMultiDevices({
        sale_id: sellerSelected.id,
        list_device_id: rowsSelected,
      }))
    }
  }

  const confirmSold = () => {
    if(_size(sellerSelected) > 0 && rowsSelected.length > 0) {
      changeDevicesStatus()

      setOpenConfirm(false)
      setRowsSelected([]);
      setSellerSelected({})
    }
  }

  const handleLimitChange = event => {
    setLimit(event.target.value);
    if (!getListDeviceRef) return;
    const newparams = Object.assign({}, params, {
      page_size: event.target.value,
      page: 1
    });
    setParams(newparams);
    navigate(`/app/device?${_convertObjectToQuery(newparams)}`);
    getListDeviceRef(newparams);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListDeviceRef) return;
    const newparams = Object.assign({}, params, { page: newPage });
    setParams(newparams);
    navigate(`/app/device?${_convertObjectToQuery(newparams)}`);

    getListDeviceRef(newparams);
  };

  const onEditDevice = (type, device) => {
    if (!actionDetailsDeviceRef) return;
    const sendData = { type: type, data: device };
    actionDetailsDeviceRef(sendData);
  };

  const handleRowClick = (device) => {
    // onEditDevice(ACTION_TABLE.PREVIEW, device);
  };

  const handleCloseConfirm = () => {
    setRowsSelected([]);

    return dispatch(closeDialogConfirm());
  }

  const checkAll = () => {
    if(rowsSelected.length > 0) {
      setRowsSelected([]);
    }

    if(listDevice.length > 0 && rowsSelected.length !== listDevice.length) {
      const all = listDevice.map((item) => {
        return item.serial;
      })
      setRowsSelected(all);
    }
  }
  
  return (
    <>
    <DialogConfirm
        title={`Bạn có muốn xóa ${rowsSelected.length} thiết bị không ?`}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDeleteDevices()}
        callbackCancel={handleCloseConfirm}
      />
    <SellerLists
      open={showSellerLists}
      handleClose={() => setShowSellerLists(false)}
      setSellerSelected={setSellerSelected}
    />

    <ModalConfirm
        title={'Thay đổi trạng thái thành đã bán'}
        textOk={'Đồng ý'}
        textCancel={'Hủy'}
        open={openConfirm}
        setOpen={setOpenConfirm}
        callbackOk={() => confirmSold()}
        callbackCancel={() => setOpenConfirm(false)}
    />

    <Card className={clsx(classes.root, className)} {...rest}>

        <div>
          {
            rowsSelected.length > 0 &&
            <Fade in={rowsSelected.length > 0}>
              <Box justifyContent="flex-end" className="change-status-box p-4" minWidth={1050}>
                {/* <Button
                    style={{ marginRight: '10px' }}
                    color="secondary"
                    variant="outlined"
                    onClick={() => setRowsSelected([])}
                    size="small"
                >
                  Bỏ chọn tất cả
                </Button>    */}
                <span
                    className="mx-1 btnDevice"
                    color="5100ff"
                    onClick={() => getListSeller()}
                    size="small"
                >
                    { _size(sellerSelected) > 0 ?
                    <Fade in={_size(sellerSelected) > 0}>
                        <span> Đã chọn: {sellerSelected.full_name} </span>
                    </Fade> :
                    <span>
                    <img src={`/static/iconSvg/select-seller.svg`} style={{ paddingRight: '5px', paddingBottom: '4px'}}/>
                      <span> Chọn người bán </span>
                    </span>
                  }
                </span>
                <span
                    onClick={handleDeleteMultiDevices}
                    className="mx-2 btnDevice"
                    color="primary"
                    variant="outlined"
                    size="small"
                >
                    <img src={`/static/iconSvg/delete-icon.svg`} style={{ paddingRight: '5px', paddingBottom: '4px'}}/>

                    <span className="pt-1"> Xóa </span>
                </span>
                { _size(sellerSelected) > 0 &&
                <span
                    onClick={() => {}}
                    style={{marginLeft: '10px'}}
                    className="mx-2"
                    color="primary"
                    variant="outlined"
                    onClick={() => setOpenConfirm(true)}
                    size="small"
                >
                  Thay đổi thành đã bán
                </span> }
              </Box>
          </Fade>
          }

          <PerfectScrollbar>
            <Box minWidth={1050} mb={3} className="table-result">
            {isLoading ? (
              <LoadingComponent />
            ) : ( <Table  className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell width={50}>
                      <Checkbox
                        checked={rowsSelected.length > 0}
                        onChange={() => checkAll()}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </TableCell>
                    {/* <TableCell>STT</TableCell> */}
                    <TableCell width={130}>Loại thiết bị</TableCell>
                    <TableCell width={100}>Biển số</TableCell>
                    <TableCell width={100}>Loại xe</TableCell>
                    <TableCell width={150}>Serial</TableCell>
                    <TableCell width={150}>Ngày sản xuất</TableCell>
                    <TableCell width={150}>Phiên bản</TableCell>
                    <TableCell width={150}>Trạng thái</TableCell>
                    <TableCell width={150}>Ngày kích hoạt</TableCell>
                    <TableCell width={150}>Số sim</TableCell>

                    <TableCell width={200}>Xí nghiệp</TableCell>
                    <TableCell width={80}>Quản lý </TableCell>
                    <TableCell width={20}> </TableCell>

                    {/* <TableCell>Trạng thái kho</TableCell> */}
                  </TableRow>
                </TableHead>
   
                <TableBody>
                  {listDevice && listDevice.length > 0 ? listDevice.map((device, index) => (
                    <TableRow
                      hover
                      key={device.id}
                    >
                      <TableCell
                        style={{maxWidth: '20px'}}
                        onClick={() => select(device?.serial)}>
                        <Checkbox
                          checked={checked(device.serial)}
                          onChange={() => select(device.serial)}
                          color="primary"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      </TableCell>
                      <TableCell
                        style={{maxWidth: '20px'}}

                        onClick={() => handleRowClick(device)}
                        >
                        {device.deviceType ? device.deviceType.name : '-'}
                      </TableCell>

                      {/* <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {(page * params.page_size) + index + 1}
                      </TableCell> */}
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {device.vehicle?.license_plate}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {'-'}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        className={classes.minWithColumn}
                        >
                        {device.serial || '-'}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {device.date_of_manufacture ? moment(device.date_of_manufacture).format('DD-MM-yyyy') : '-'}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        className={classes.minWithColumn}
                        >
                        {device.hardware_version || '-'}
                      </TableCell>

                      <TableCell
                        onClick={() => handleRowClick(device)}
                        style={{minWidth: '100px'}}
                        >
                        {getStatusDevice(device.status)}
                      </TableCell>

                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {moment(device.created_at).format('DD-MM-yyyy')}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {device.sim || '-'}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        className={classes.minWithColumn}
                        >
                        {device.agency?.name || '-'} {device.agency?.agency_code ? `(${device.agency.agency_code})` : ''}
                      </TableCell>
                      <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {device.agency?.manager || '-'}
                      </TableCell>
                      <TableCell>
                        <span style={{ color: '#AEB1C5'}}>
                          <MoreVertIcon aria-describedby={`menu-device-${device.id}`}
                            className={`cursor-pointer hover-red`}
                            onClick={handleClickMenu}/>
                        </span>

                        <Popover
                          id={`menu-device-${device.id}`}
                          className="popover-device"
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleCloseMenu}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                        <Typography>
                          <List >
                            <ListItem onClick={handleCloseMenu} className="border-bottom list-menu-device cursor-pointer">
                              Chọn người bán
                            </ListItem>
                            <ListItem onClick={handleCloseMenu} className="border-bottom list-menu-device cursor-pointer">
                              Chỉnh sửa
                            </ListItem>
                            <ListItem onClick={handleDeleteDevice} data-id={device.id} className="cursor-pointer list-menu-device">
                              <span class="text-danger "> Xóa </span>
                            </ListItem>
                          </List>
                        </Typography>

                        </Popover>
                      </TableCell>


                      {/* <TableCell
                        onClick={() => handleRowClick(device)}
                        >
                        {getStatusStore(device.warehouse_status)}
                      </TableCell> */}
                    </TableRow>
                  )) : <div className="text-center pb-5">
                    <img src="/static/empty.png" class="justify-content-center"/>
                    <h4> Danh sách trống  </h4>
                  </div>
                  }
                </TableBody>
              </Table>
              )}
            </Box>
            </PerfectScrollbar>

        </div>
    </Card>
    {listDevice && listDevice.length > 0 && page && (
      <div class="mt-3 mr-4 float-right">
        <Pagination
          style={{ color: '#C62222' }}
          count={Math.ceil(totalDevice/limit)}
          size="small"
          onChange={handlePageChange}
          page={Number(params.page)}
          showFirstButton
          showLastButton
        />
      </div>
    )}
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  listDevice: PropTypes.array.isRequired
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
  },
  table: {
    minWidth: 1500,
  }
}));

export default Results;
