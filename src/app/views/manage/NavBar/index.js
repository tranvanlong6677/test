import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Drawer,
  Hidden,
  List,
  makeStyles,
} from '@material-ui/core';
import { Truck as Car, MapPin as Map, Users as User } from 'react-feather';
import NavItem from './NavItem';
import { useSelector, useDispatch } from 'react-redux';
import { GetUserInfo } from 'src/features/authSlice'

const useStyles = makeStyles(() => ({
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
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const isAdmin = useSelector(state => state.authSlice.isAdmin);

  useEffect(() => {
    dispatch(GetUserInfo());

    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const menuManageUser = isAdmin ? [
    {
      href: `/app/manage/sales`,
      title: 'Quản lý đại lý kinh doanh'
    },
    {
      href: `/app/manage/service-staff`,
      title: 'Quản lý nhân viên CSKH'
    }
  ] : [
    {
      href: `/app/manage/user`,
      title: 'Quản lý thành viên'
    }, {
      href: `/app/manage/group-users`,
      title: 'Quản lý nhóm thành viên'
    }
  ]

  const menuVehicle  = isAdmin ? [{
      href: `/app/manage/vehicle-types`,
      title: 'Quản trị loại phương tiện'
  }] : [{
    href: `/app/manage/vehicles`,
    title: 'Quản lý phương tiện'
  }, {
    href: `/app/manage/group-vehicles`,
    title: 'Quản lý nhóm xe'
  }]

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box p={2}>
        <List>
          <NavItem
            icon={'userIcon'}
            title="Quản Trị Người Dùng"
            arrayNested={menuManageUser}
          />
          <NavItem
            icon={'vehicle'}
            title="Quản Trị Phương Tiện"
            arrayNested={menuVehicle}
          />
          { !isAdmin && <NavItem
            icon={'drive'}
            title="Quản Lý Lái Xe"
            arrayNested={[
              {
                href: `/app/manage/driver/all`,
                title: 'Danh sách lái xe'
              }
            ]}
          /> }
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
  onMobileClose: () => {
  },
  openMobile: false
};

export default NavBar;
