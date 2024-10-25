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
  Popover,
  Typography,
  List,
  ListItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DialogConfirm from 'src/app/components/DialogConfirm';
import {
  closeDialogConfirm,
  showDialogConfirm,
  showToast
} from 'src/features/uiSlice';
import { Pagination } from '@material-ui/lab';

import moment from 'moment';
import {
  messageToastType_const,
  PAGE_SIZE_LIST,
  STATUS_API,
  AGENCY_STATUS,
} from 'src/app/constant/config';
import { MESSAGE } from 'src/app/constant/message';
import { deleteAgency } from 'src/features/agencySlice';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch } from 'react-redux';

import CreateVehicleType from './create'

const Results = ({
                   className,
                   listAgency,
                   isLoading,
                   getListAgencyRef,
                   actionDetailsUserRef,
                   totalAgency,
                   actionDeleteUserRef,
                   //   checkPermissionEdit,
                   //   checkPermissionView,
                   ...rest
                 }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE_LIST);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    page: page,
    pageSize: limit,
    is_pagination: true,
  });
  const [rowsSelected, setRowsSelected] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [itemCurrent, setItemCurrent] = useState();

  const getStatusAgency = status => {
    switch(status) {
      case AGENCY_STATUS.ACTIVE: 
        return <span className="badge-actived badge"> Hoạt động </span>;
      case AGENCY_STATUS.INACTIVE: 
        return <span className="badge-inActived badge"> Tạm dừng</span>;
      default:
          return '-';
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  
  const handleDeleteDriver = () => {
    dispatch(showDialogConfirm());

    handleCloseMenu();
  }

  const confirmDelete = () => {
    dispatch(deleteAgency({ 
      id : selectedItem
    }));
  }

  const handleEditAgency = () => {
    setOpenEditModal(true);
    handleCloseMenu();
  }

  const handleClickMenu = (event, agency) => {
    setAnchorEl(event.currentTarget);
    setItemCurrent(agency);
    setSelectedItem(agency.id);
  };

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
    }
  }

  const handleLimitChange = event => {
    setLimit(event.target.value);
    if (!getListAgencyRef) return;
    const newparams = Object.assign({}, params, {
      pageSize: event.target.value,
      page: 1,
      is_pagination: true,
    });
    setParams(newparams);
    getListAgencyRef(newparams);
  };

  const closeModal = () => {
    setOpenEditModal(false);
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListAgencyRef) return;
    const newparams = Object.assign({}, params, { page: newPage });
    setParams(newparams);
    getListAgencyRef(newparams);
  };

  const onEditUser = (type, user) => {
    if (!actionDetailsUserRef) return;
    const sendData = { type: type, data: user };
    actionDetailsUserRef(sendData);
  };

  return (
    <>
      <CreateVehicleType open={openEditModal} isEdit closeRef={closeModal} agency={itemCurrent}/>

      <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_STAFF}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDelete()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      />
      <Card className={clsx(classes.root, className)} {...rest}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div>
            <PerfectScrollbar>
              <Box minWidth={1050}>
                {listAgency && listAgency.length > 0 ?
                  (
                  <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell width={50}>
                        <Checkbox
                          checked={rowsSelected.length > 0}
                          onChange={() => setRowsSelected([])}
                          color="primary"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      </TableCell> */}
                      <TableCell>Tên đăng nhập</TableCell>
                      <TableCell>Tên xí nghiệp</TableCell>
                      <TableCell>Mã xí nghiệp</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Thời gian tạo</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                  {listAgency.map((agency, index) => (  <TableRow hover key={agency.id}>
                        {/* <TableCell
                          style={{maxWidth: '20px'}}
                          onClick={() => select(agency?.id)}>
                          <Checkbox
                            checked={checked(agency.id)}
                            onChange={() => select(agency.id)}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </TableCell> */}
                        <TableCell>{agency.full_name || '-'}</TableCell>
                        <TableCell>{agency.name || '-'}</TableCell>
                        <TableCell>{agency.agency_code || '-'}</TableCell>
                        <TableCell>{getStatusAgency(agency.status)}</TableCell>
                        <TableCell>{moment(agency.created_at).format('DD-MM-yyyy')}</TableCell>
                        <TableCell>
                          <span style={{ color: '#AEB1C5'}}>
                            <MoreVertIcon aria-describedby={`menu-device-${agency.id}`}
                              className={`cursor-pointer hover-red`}
                              onClick={(e) => handleClickMenu(e, agency)}/>
                          </span>

                          <Popover
                            id={`menu-device-${agency.id}`}
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
                              <ListItem onClick={handleEditAgency} className="border-bottom list-menu-device cursor-pointer">
                                Chỉnh sửa
                              </ListItem>
                              <ListItem onClick={handleDeleteDriver} className="cursor-pointer list-menu-device">
                                <span class="text-danger"> Xóa </span>
                              </ListItem>
                            </List>
                          </Typography>
                        </Popover>
                      </TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
                </Table>) : <div className="text-center pb-5">
                      <img src="/static/empty.png" class="justify-content-center"/>
                      <h4> Danh sách trống  </h4>
                    </div>
                  }
              </Box>
            </PerfectScrollbar>
          </div>
        )}
      </Card>
      {listAgency && listAgency.length > 0  && (
        <div class="mt-3 mr-4 float-right">
          <Pagination
            count={Math.ceil(totalAgency/limit)}
            style={{ color: '#C62222' }}
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
  listUser: PropTypes.array.isRequired
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
