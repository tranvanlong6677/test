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
  Tooltip,
  Typography
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from 'moment';
import {
  ACTION_TABLE,
  messageToastType_const,
  PAGE_SIZE_LIST,
  STATUS_API,
  DEVICE_STATUS,
  DEVICE_STATUS_VALUE
} from 'src/app/constant/config';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { Key } from 'react-feather';

const Results = ({
                   className,
                   listUser,
                   isLoading,
                   getListUserRef,
                   actionDetailsUserRef,
                   totalUser,
                   actionDeleteUserRef,
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
    pageSize: limit
  });
  const getStatusUser = status => {
    let content = '';
    const index = DEVICE_STATUS_VALUE.findIndex(st => st.id === status);
    if (index >= 0) content = DEVICE_STATUS_VALUE[index]?.title;
    return <Chip label={content} color="primary" clickable />;
  };

  const handleLimitChange = event => {
    setLimit(event.target.value);
    if (!getListUserRef) return;
    const newparams = Object.assign({}, params, {
      pageSize: event.target.value,
      page: 1
    });
    setParams(newparams);
    getListUserRef(newparams);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (!getListUserRef) return;
    const newparams = Object.assign({}, params, { page: newPage + 1 });
    setParams(newparams);
    getListUserRef(newparams);
  };

  const onEditUser = (type, user) => {
    if (!actionDetailsUserRef) return;
    const sendData = { type: type, data: user };
    actionDetailsUserRef(sendData);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div>
          <PerfectScrollbar>
            <Box minWidth={1050}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên đăng nhập</TableCell>
                    <TableCell>Họ và tên</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    {/*<TableCell>Thao tác</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listUser &&
                  listUser.map((user, index) => (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        {page * params.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>
                        <div className={classes.groupAction}>
                          {/*<div*/}
                          {/*className="action"*/}
                          {/*  onClick={() =>*/}
                          {/*    onEditUser(ACTION_TABLE.PREVIEW, user)*/}
                          {/*  }*/}
                          {/*>*/}
                          {/*  <Tooltip title="Chi tiết">*/}
                          {/*    <VisibilityIcon />*/}
                          {/*  </Tooltip>*/}
                          {/*</div>*/}
                          {/*<div*/}
                          {/*  className="action"*/}
                          {/*  onClick={() =>*/}
                          {/*    onEditUser(ACTION_TABLE.EDIT, user)*/}
                          {/*  }*/}
                          {/*>*/}
                          {/*  <Tooltip title="Chỉnh sửa">*/}
                          {/*    <EditIcon />*/}
                          {/*  </Tooltip>*/}
                          {/*</div>*/}
                          {/*<div*/}
                          {/*  className="action"*/}
                          {/*  onClick={() => actionDeleteUserRef(user)}*/}
                          {/*>*/}
                          {/*  <Tooltip title="Xóa">*/}
                          {/*    <DeleteIcon />*/}
                          {/*  </Tooltip>*/}
                          {/*</div>*/}
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
            count={totalUser}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      )}
    </Card>
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
