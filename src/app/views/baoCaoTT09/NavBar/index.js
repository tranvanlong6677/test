import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  Hidden,
  List,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Truck as Car, MapPin as Map, Users as User } from 'react-feather';
import RouterIcon from '@material-ui/icons/Router';
import NavItem from './NavItem';
import { useSelector } from 'react-redux';
import { roleName_const } from '../../../constant/config';

import { withStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(() => ({
  box : {
    paddingTop: "10px",
    paddingLeft: "16px"
  }
  ,
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
    marginTop: '20px'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  nested: {
    paddingLeft: 50
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    fontSize: '14px',
    color: '#45485E'
  },
  titleHeader: {
    width: '100%',
    height: '45px',
    color: '#C62222',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    fontWeight: 'bold',
    fontSize: "18px",
  //  textTransform: 'uppercase',
    marginBottom: '20px'
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  // const location = useLocation();
  // const dataLogin = useSelector(state => state.authSlice.dataLogin);

  const content = (
    <Box height="100%" display="flex" flexDirection="column"  >
      <Box p={2} className={classes.box} >
        <List>
          
        <div className={classes.titleHeader}>Báo cáo BGT<br></br>TT09/2015/TT-BGTVT</div>
          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-baocaotonghopxe.svg"
            /> */}
            <NavItem title="Vi phạm theo đơn vị vận tải" href="tt09-phu-luc-5" icon="/static/images/nav-baocaotonghopxe.svg"/>
          </div>

          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-quatocdogioihan.svg"
            /> */}
            <NavItem title="Thống kê vi phạm tốc độ" href="tt09-phu-luc-8" icon="/static/images/nav-quatocdogioihan.svg"/>
          </div>
          
          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-quatocdogioihan.svg"
            /> */}
            <NavItem title="Chi tiết vi phạm tốc độ" href="tt09-phu-luc-14" icon="/static/images/nav-quatocdogioihan.svg"/>
          </div>
          
          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-thoigianlaixelientuc.svg"
            /> */}
            <NavItem title="Vi phạm thời gian lái xe liên tục (4H)" href="tt09-phu-luc-16" icon="/static/images/nav-thoigianlaixelientuc.svg"/>
          </div>

          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-thoigianlaixelientuc.svg"
            /> */}
            <NavItem title="Vi phạm lái xe quá 10h/ngày" href="tt09-phu-luc-17" icon="/static/images/nav-thoigianlaixelientuc.svg"/>
          </div>

          <div className={classes.menuItem}>
            {/* <img
              alt="Under development"
              className={classes.image}
              src="/static/images/nav-baocaotonghopxe.svg"
            /> */}
            <NavItem title="Vi phạm truyền dữ liệu" href="tt09-phu-luc-19" icon="/static/images/nav-baocaotonghopxe.svg"/>
          </div>
          
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;