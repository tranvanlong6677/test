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
          <p style={{color: 'red', fontStyle: 'italic', fontSize: '16px'}}>- Hệ thống báo cáo được xây dựng theo yêu cầu quản lý riêng của nội bộ doanh nghiệp, đáp ứng nhiều những yêu cầu riêng lẻ, chuyên sâu khác khi áp dụng GPS - TBGSHT.</p>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
            Báo cáo tổng hợp
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo tổng hợp hoạt động (theo nhóm)
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo tổng hợp hoạt động
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              báo cáo chi tiết hoạt động (bao gồm mất tín hiệu)
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo lịch hẹn
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
             Báo cáo tổng hợp km xe hoạt động
            </li>
          </ul>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
          Báo cáo hoạt động
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo tổng hợp bật điều hòa
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
              Báo cáo ra vào trạm
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
              Báo cáo chuyến kinh doanh
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
             Báo cáo bật điều hòa
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
             Thu phí đường bộ - báo cáo phí theo chặng
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
             Báo cáo cước qua điểm thu phí
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/create')}
            >
             Báo cáo hoạt động hoạt động tháng
            </li>
          </ul>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
          Báo cáo lịch trình
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo hành trình
            </li>
          </ul>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
          Báo cáo trạng thái
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo mở cửa
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo nâng hạ ben
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo nâng hạ cẩu
            </li>
          </ul>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
          Báo cáo động cơ
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo động cơ
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo trạng thái động cơ
            </li>
          </ul>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
          Báo cáo hệ thống
          </h2>
          <ul className={classes.menuItem}>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo lỗi xung
            </li>
            <li
              className={classes.item}
              // onClick={() => navigate('/app/manage/user/agencies')}
            >
              Báo cáo mất tín hiệu
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
