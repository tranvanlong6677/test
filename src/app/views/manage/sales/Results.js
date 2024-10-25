import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Popover,
  Typography,
  List,
  ListItem,
  Checkbox
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { deleteSale } from 'src/features/saleSlice';
import DialogConfirm from 'src/app/components/DialogConfirm';
import {
  closeDialogConfirm,
  showDialogConfirm,
} from 'src/features/uiSlice';
import { MESSAGE } from 'src/app/constant/message';

import {
  PAGE_SIZE_LIST,
} from 'src/app/constant/config';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch } from 'react-redux';
import EditStaff from './edit';
import {
  AGENCY_STATUS,
} from 'src/app/constant/config';

import moment from 'moment';

const Results = ({
                   className,
                   listStaff,
                   getListSalesRef,
                   actionDetailsUserRef,
                   totalAgency,
                   actionDeleteUserRef,
                   ...rest
                 }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.saleSlice.isLoading);
  const totalSellers = useSelector(state => state.saleSlice.totalSellers);
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE_LIST);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [itemCurrent, setItemCurrent] = useState();
  const [rowsSelected, setRowsSelected] = useState([]);

  const [params, setParams] = useState({
    keyword: '',
    page: page,
    page_size: limit,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMenu = (event, sale) => {
    setAnchorEl(event.currentTarget);
    setItemCurrent(sale);

    setSelectedItem(sale.id);
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

  const handleDeleteSale = () => {
    dispatch(showDialogConfirm());


    handleCloseMenu();
  }

  const confirmDelete = () => {
    dispatch(deleteSale({ id: selectedItem }));
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListSalesRef) return;
    const newparams = Object.assign({}, params, { page: newPage });
    setParams(newparams);
    getListSalesRef(newparams);
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
                      <TableCell>Tên đại lý</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Địa chỉ</TableCell>
                      <TableCell>Thiết bị đã kích hoạt</TableCell>
                      <TableCell>Tổng thiết bị</TableCell>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { listStaff.map((sale, index) => (
                      <TableRow hover key={sale.id}>
                        {/* <TableCell
                          style={{maxWidth: '20px'}}
                          onClick={() => select(sale?.id)}>
                          <Checkbox
                            checked={checked(sale.id)}
                            onChange={() => select(sale.id)}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </TableCell> */}
                        <TableCell>{sale.name || '-'}</TableCell>
                        <TableCell>{sale.phone || '-'}</TableCell>
                        <TableCell>{sale.mail || '-'}</TableCell>
                        <TableCell>{sale.address}</TableCell>
                        <TableCell>{sale.active_device}</TableCell>
                        <TableCell>{sale.total_device}</TableCell>
                        <TableCell>{moment(sale.created_at).format('DD-MM-yyyy')}</TableCell>

                        <TableCell>
                        <span style={{ color: '#AEB1C5'}}>
                          <MoreVertIcon aria-describedby={`menu-device-${sale.id}`}
                            className={`cursor-pointer hover-red`}
                            onClick={(e) => handleClickMenu(e, sale)}/>
                        </span>

                        <Popover
                          id={`menu-device-${sale.id}`}
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
                            {/* <ListItem onClick={handleEditStaff} className="border-bottom list-menu-device cursor-pointer">
                              Chỉnh sửa
                            </ListItem> */}
                            <ListItem onClick={handleDeleteSale} className="cursor-pointer list-menu-device">
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
            count={Math.ceil(totalSellers/limit)}
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
