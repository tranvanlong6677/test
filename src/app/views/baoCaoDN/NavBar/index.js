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
  const classes = useStyles();
  const location = useLocation();
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  // useEffect(() => {
  //   if (openMobile && onMobileClose) {
  //     onMobileClose();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column" >
      <Box p={2}>
        <List>
          <NavItem
            title="Báo cáo tổng hợp"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo tổng hợp hoạt động (theo nhóm)'
              },
              {
                href: `#`,
                title: 'Báo cáo tổng hợp hoạt động'
              },
              {
                href: `#`,
                title: 'báo cáo chi tiết hoạt động (bao gồm mất tín hiệu)'
              },
              {
                href: `#`,
                title: 'Báo cáo lịch hẹn'
              },
              {
                href: `#`,
                title: 'Báo cáo tổng hợp km xe hoạt động'
              }
            ]}
          />
          <NavItem
            title="Báo cáo hoạt động"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo tổng hợp bật điều hòa'
              },
              {
                href: `#`,
                title: 'Báo cáo dừng đỗ'
              },
              {
                href: `#`,
                title: 'Báo cáo ra vào trạm'
              },
              {
                href: `#`,
                title: 'Báo cáo chuyến kinh doanh'
              },
              {
                href: `#`,
                title: 'Báo cáo bật điều hòa'
              },
              {
                href: `#`,
                title: 'Thu phí đường bộ - báo cáo phí theo chặng'
              },
              {
                href: `#`,
                title: 'Báo cáo cước qua điểm thu phí'
              },
              {
                href: `#`,
                title: 'Báo cáo hoạt động hoạt động tháng'
              }
            ]}
          />
          <NavItem
            title="Báo cáo lịch trình"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo hành trình'
              }
            ]}
          />
          <NavItem
            title="Báo cáo trạng thái"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo mở cửa'
              },
              {
                href: `#`,
                title: 'Báo cáo nâng hạ ben'
              },
              {
                href: `#`,
                title: 'Báo cáo nâng hạ cẩu'
              }
            ]}
          />
          <NavItem
            title="Báo cáo động cơ"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo động cơ'
              },
              {
                href: `#`,
                title: 'Báo cáo trạng thái động cơ'
              }
            ]}
          />
          <NavItem
            title="Báo cáo hệ thống"
            arrayNested={[
              {
                href: `#`,
                title: 'Báo cáo lỗi xung'
              },
              {
                href: `#`,
                title: 'Báo cáo mất tín hiệu'
              }
            ]}
          />
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
