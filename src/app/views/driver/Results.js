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
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  ACTION_TABLE,
  PAGE_SIZE_LIST,
  DEVICE_STATUS_VALUE
} from 'src/app/constant/config';
import LoadingComponent from 'src/app/components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '@material-ui/lab';

const Results = ({
  className,
  listUser,
  isLoading,
  getListUserRef,
  actionDetailsUserRef,
  totalUser,
  actionDeleteUserRef,
  totalPage,
  currentPage,
  changePage,
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
                    <TableCell>Tên</TableCell>
                    <TableCell>Bằng lái xe</TableCell>
                    <TableCell>Loaị bằng lái</TableCell>
                    <TableCell>Số điện thoại</TableCell>
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
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.license_number}</TableCell>
                        <TableCell>{user.license_type}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              style={{ color: '#C62222' }}
              count={totalPage}
              size="small"
              page={currentPage}
              onChange={(e, value) => changePage(value)}
            />
          </Box>
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
