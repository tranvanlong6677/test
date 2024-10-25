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
          <p style={{color: 'red', fontStyle: 'italic', fontSize: '16px'}}>- Hệ thống báo cáo đáp ứng quy định của Bộ GTVT với TBGSHT theo quy chuẩn QCVN31-2014 và thông tư 09/2015/TT-BGTVT</p>
        </div>
        <div className={classes.wrapMenu}>
          <h2 className={classes.title}>
            Báo cáo TT09/2015/TT - BGTVT
          </h2>
          {/* <ul className={classes.menuItem}>
            <li
              className={classes.item}
              onClick={() => navigate('/app/baocao-tt09/tt09-phu-luc-5')}
            >
              Phụ lục 05
            </li>
            <li
              className={classes.item}
            >
              Phụ lục 08
            </li>
            <li
              className={classes.item}
            >
              Phụ lục 14
            </li>
            <li
              className={classes.item}
            >
              Phụ lục 16
            </li>
            <li
              className={classes.item}
            >
              Phụ lục 17
            </li>
            <li
              className={classes.item}
            >
              Phụ lục 19
            </li>
          </ul> */}
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
