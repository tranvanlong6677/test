import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, makeStyles, SvgIcon } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';
import { Truck as Car, MapPin as Map, Users as User } from 'react-feather';

const MainControlView = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Box className={classes.contentContainer}>
      <div className={classes.content}>
        <div className={classes.wrapMenu}>
          <p style={{color: 'red', fontSize: '16px'}}>Chú ý: </p>
          <p style={{color: 'red', fontStyle: 'italic', fontSize: '16px'}}>- Hệ thống báo cáo đáp ứng quy định của Bộ GTVT với TBGSHT theo quy chuẩn QCVN31-2014 và thông tư 73/2014/TT-BGTVT</p>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
            Báo cáo TT73/2014/TT - BGTVT
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
               onClick={() => navigate('/app/baocao-bgt/hanh-trinh-chay-xe')}
            >
              Hành trình xe chạy
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Tốc độ của xe
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Quá tốc độ giới hạn
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Thời gian lái xe liên tục
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo dừng đỗ
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo tổng hợp theo xe
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo tổng hợp theo xe
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo tổng hợp theo lái xe
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Danh sách phương tiện đã lắp đặt thiết bị theo Quy chuẩn BGT
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo thời gian theo ngày
            </li>
          </ul>
        </div>
       </div>
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  contentContainer: {
    display: 'flex',
    margin: '30px',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  wrapMenu: {
    marginTop: '30px',
    marginRight: '100px',
    marginLeft: '30px'
  },
  title: {
    color: '#3f51b5',
    cursor: 'pointer'
  },
  menuItem: {
    listStyleType: 'none',
    margin: 0,
    padding: 0
  },
  item: {
    paddingTop: '30px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '500',

    '&:hover': {
      color: '#3f51b5',
      borderBottom: '1px solid #3f51b5',
      width: 'max-content'
    }
  }
}));

export default MainControlView;
