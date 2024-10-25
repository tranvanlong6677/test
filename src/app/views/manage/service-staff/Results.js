import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
  Popover,
  Typography,
  List,
  ListItem,
  Checkbox
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { deleteStaff, resetChange } from 'src/features/staffSlice';
import DialogConfirm from 'src/app/components/DialogConfirm';
import {
  closeDialogConfirm,
  showDialogConfirm,
  showToast
} from 'src/features/uiSlice';
import { MESSAGE } from 'src/app/constant/message';

import {
  messageToastType_const,
  PAGE_SIZE_LIST,
  STATUS_API,
  AGENCY_STATUS,
} from 'src/app/constant/config';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch } from 'react-redux';
import EditStaff from './edit';

const Results = ({
                   className,
                   listStaff,
                   getListStaffRef,
                   actionDetailsUserRef,
                   totalAgency,
                   actionDeleteUserRef,
                   //   checkPermissionEdit,
                   //   checkPermissionView,
                   ...rest
                 }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.staffSlice.isLoading);
  const totalStaffs = useSelector(state => state.staffSlice.totalStaffs);
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE_LIST);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [itemCurrent, setItemCurrent] = useState();
  const [rowsSelected, setRowsSelected] = useState([]);

  const [params, setParams] = useState({
    page: page,
    page_size: limit,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMenu = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setItemCurrent(staff);
    // console.log(staff);

    setSelectedItem(staff.cusotmer_care_id);
  };
  const [openEditModal, setOpenEditModal] = useState(false)

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleEditStaff = () => {
    setOpenEditModal(true);

    handleCloseMenu();
  }

  const closeModal = () => {
    setOpenEditModal(false);
  }

  const handleDeleteStaff = () => {
    dispatch(showDialogConfirm());


    handleCloseMenu();
  }

  const confirmDelete = () => {
    dispatch(deleteStaff({ id: selectedItem }));
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListStaffRef) return;
    const newparams = Object.assign({}, params, { page: newPage });
    setParams(newparams);
    getListStaffRef(newparams);
  };

  const onEditUser = (type, user) => {
    if (!actionDetailsUserRef) return;
    const sendData = { type: type, data: user };
    actionDetailsUserRef(sendData);
  };

  const checked = (id) => {
    return (rowsSelected.indexOf(id) !== -1)
  }
  const select = (driver) => {
    if (rowsSelected.indexOf(driver) === -1) {
      const newSelected = [driver, ...rowsSelected];
      setRowsSelected(newSelected);
    } else {
      const newSelected = rowsSelected.filter(i => i !== driver)
      setRowsSelected(newSelected);
    }
  }

  const checkAll = () => {
    if(rowsSelected.length > 0) {
      setRowsSelected([]);
    }

    if(listStaff.length > 0 && rowsSelected.length !== listStaff.length) {
      const all = listStaff.map((item) => {
        return item.id;
      })
      setRowsSelected(all);
    }
  }

  return (
    <>
      <EditStaff
        open={openEditModal}
        staff={itemCurrent}
        closeRef={closeModal}
      />

      <DialogConfirm
        title={MESSAGE.CONFIRM_DELETE_STAFF}
        textOk={MESSAGE.BTN_YES}
        textCancel={MESSAGE.BTN_CANCEL}
        callbackOk={() => confirmDelete()}
        callbackCancel={() => dispatch(closeDialogConfirm())}
      />

      <Card className={clsx(classes.root, className)} {...rest}>
        { isLoading ? (
          <LoadingComponent />
        ) : (
          <div>
            <PerfectScrollbar>
            { listStaff && listStaff.length ? <Box minWidth={1050}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell width={50}>
                        <Checkbox
                          checked={rowsSelected.length > 0}
                          onChange={() => checkAll() }
                          color="primary"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      </TableCell> */}
                      <TableCell>Tên nhân viên</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Địa chỉ</TableCell>
                      <TableCell>Danh sách đại lý giám sát</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { listStaff.map((staff, index) => (
                      <TableRow hover key={staff.id}>
                        {/* <TableCell
                          style={{maxWidth: '20px'}}
                          onClick={() => select(staff?.id)}>
                          <Checkbox
                            checked={checked(staff.id)}
                            onChange={() => select(staff.id)}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </TableCell> */}
                        <TableCell>{staff.full_name || '-'}</TableCell>
                        <TableCell>{staff.phone || '-'}</TableCell>
                        <TableCell>{staff.email || '-'}</TableCell>
                        <TableCell>{staff.address}</TableCell>
                        <TableCell>{staff.sale_agencies_taken_care_by_customer_care.map((item) => 
                          <> {item.name} <br />  </>
                        )}</TableCell>
                        <TableCell>
                        <span style={{ color: '#AEB1C5'}}>
                          <MoreVertIcon aria-describedby={`menu-device-${staff.cusotmer_care_id}`}
                            className={`cursor-pointer hover-red`}
                            onClick={(e) => handleClickMenu(e, staff)}/>
                        </span>

                        <Popover
                          id={`menu-device-${staff.id}`}
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
                            <ListItem onClick={handleEditStaff} className="border-bottom list-menu-device cursor-pointer">
                              Chỉnh sửa
                            </ListItem>
                            <ListItem onClick={handleDeleteStaff} className="cursor-pointer list-menu-device">
                              <span class="text-danger"> Xóa </span>
                            </ListItem>
                          </List>
                        </Typography>

                        </Popover>
                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box> : <div className="text-center pb-5">
                <img src="/static/empty.png" class="justify-content-center"/>
                <h4> Danh sách trống  </h4>
              </div>
            }
            </PerfectScrollbar>
          </div>
        )}
      </Card>
      {listStaff && listStaff.length > 0  && (
        <div class="mt-3 mr-4 float-right">
          <Pagination
            count={Math.ceil(totalStaffs/limit)}
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
