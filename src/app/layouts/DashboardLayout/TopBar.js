import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  SvgIcon,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Logo from 'src/app/components/Logo';
import { logOutAction } from '../../../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Search as SearchIcon } from 'react-feather';
import './style.css'
import { MENU } from 'src/app/constant/menu'
import { roles } from 'src/app/constant/roles'

const useStyles = makeStyles(() => ({
  root: {
    background: '#fff',
    boxShadow: '0 0 5px 0px #b3b3b3b3',
    height: '80px'
  },
  avatar: {
    width: 60,
    height: 60
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'center',
  },
  listItem: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  wrapLogo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px'
  },
  textLogo: { fontWeight: 'bold' },
  leftTextLogo: { color: '#000000' },
  rightTextLogo: { color: '#8F0A0C' },
  itemMenu: {
    display: 'inline-block',
    padding: '20px',
    fontSize: '18px',
    fontWeight: '400',
    cursor: 'pointer',
    marginLeft: '15px',
    color: ' #475461',
    fontSize: '16px',
    '&:hover': {
      color: '#C62222',
    },
    '&:nth-child(1)': {
      color: '#C62222',
      fontWeight: '800',
    }
  },

}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [notifications] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [reportMenu, setReportMenu] = React.useState(null);

  const [menuResponsive, setMenuResponsive] = React.useState(false);
  const location = useLocation();

  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const isAdmin = dataLogin && dataLogin.role && (dataLogin.role.title === roles.ADMIN);

  const listMenu = isAdmin ? MENU.filter( item => item.value !== 'map'
      && item.value !== 'image' 
      && item.value !== 'camera')
    : MENU.filter(item => item.value !== 'device' && item.value !== 'agency')

  const current = location.pathname ? location.pathname.split('/')[2] : 'map'

  const [active, setActive] = useState(current);

  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenSwitchLang = (event) => {
    setAnchorEl1(event.currentTarget);
  }

  const handleClickReportMenu = (event) => {
    setReportMenu(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleCloseReportMenu = () => {
    setReportMenu(false);
  }

  const handleCloseLangSwitch = () => {
    setAnchorEl1(false);
  }

  const handleLogOut = () => {
    dispatch(logOutAction());
    navigate('/login');
    setAnchorEl(false);
  };

  const switchRoute = (to, query) => {

    if (typeof to === 'string') {
      setActive(to.split('/')[1]);
    }

    return navigate(`/app/${to}${query ? '?' + query : ''}`)
  }

  const renderClassMenu = (menu) => {

    const activeClass = menu === active ? 'itemMenu-active' : ''

    return `itemMenu ${activeClass}`
  }
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setMenuResponsive(open);
  };

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/" className={classes.wrapLogo}>
          <Logo />
        </RouterLink>
        <Hidden mdDown>

          <Box flexGrow={1} className={classes.menuHeader}>
            <ul className={classes.listItem}>
              {
                listMenu.map((menu) => <>
                  <li className={renderClassMenu(menu.value)} key={menu.value} onClick={() => switchRoute(menu.link)}>{menu.label}</li>
                </>)
              }

              <li className={`itemMenu ${active === 'baocao-dn' || active === 'baocao-bgt' ? 'itemMenu-active' : ''}`} aria-describedby="reports-menu" aria-controls="reports-menu" aria-haspopup="true" onClick={handleClickReportMenu}>
                Báo cáo
              </li>
              <Menu

                style={{ marginTop: "40px", marginLeft: "24px" }}
                className={classes.a}
                id="reports-menu"
                anchorEl={reportMenu}
                keepMounted
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(reportMenu)}
                onClose={handleCloseReportMenu}
              >
                <MenuItem onClick={() => switchRoute('/baocao-bgt/hanh-trinh-chay-xe')}>
                  Báo cáo TT073/2014/TT-BGTVT
                </MenuItem>
                <MenuItem onClick={() => switchRoute('/baocao-tt09/control')}>
                  Báo cáo TT09/2015/TT-BGTVT
                </MenuItem>
                {/* <MenuItem onClick={() => switchRoute('/baocao-dn/control')}>
                  Báo cáo doanh nghiệp
                </MenuItem> */}
              </Menu>
            </ul>
          </Box>
        </Hidden>
        <Hidden mdDown>
          <IconButton className="menu-right-icon" aria-controls="simple-menu" aria-haspopup="true"  >
            <SvgIcon fontSize="small" color="action" style={{ width: '20px', borderRadius: "50%" }}>
              <SearchIcon />
            </SvgIcon>
          </IconButton>
          <IconButton className="menu-right-icon"  >
            <Badge
              style={{ width: '20px', height: '20px', borderRadius: "50%" }}
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon style={{ width: '20px', borderRadius: "50%" }} />
            </Badge>
          </IconButton>
          <IconButton className="menu-right-icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <img
              style={{ width: '20px', borderRadius: "50%" }}
              alt="Logo"
              src="/static/images/no-avatar.png"
            />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem> Xin chào! {dataLogin && dataLogin.full_name}</MenuItem>
            <MenuItem onClick={() => {
              navigate('/app/account');
              handleClose();
            }}>My account</MenuItem>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>

          </Menu>
          <IconButton className="menu-right-icon" aria-controls="lang-menu" aria-haspopup="true" onClick={handleOpenSwitchLang}>
            <img
              style={{ width: '20px', borderRadius: "50%" }}
              alt="Language "
              src="/static/images/vn-square-flag.png"
            />
          </IconButton>
          <Menu
            id="lang-menu"
            anchorEl={anchorEl1}
            keepMounted
            open={Boolean(anchorEl1)}
            onClose={handleCloseLangSwitch}
          >
            <MenuItem onClick={() => { }}>
              <img
                style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                alt="Language "
                src="/static/images/en-square-flag.png"
              /> English
            </MenuItem>
            <MenuItem onClick={() => { }}>
              <img
                style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                alt="Language "
                src="/static/images/cn-square-flag.png"
              />
              中文
            </MenuItem>
            <MenuItem onClick={() => { }}>
              <img
                style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                alt="Language "
                src="/static/images/lao-square-flag.png"
              />
              ພາສາລາວ
            </MenuItem>
          </Menu>

        </Hidden>

        <Hidden lgUp>
          <Box width={1} textAlign={'right'}>
            <IconButton className="menu-right-icon" aria-controls="simple-menu" aria-haspopup="true">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </IconButton>
            <IconButton className="menu-right-icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <img
                style={{ width: '20px' }}
                alt="Logo"
                src="/static/images/no-avatar.png"
              />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate('/app/account')}>My account</MenuItem>
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
            <IconButton className="menu-right-icon" aria-controls="lang-menu" aria-haspopup="true" onClick={handleOpenSwitchLang}>
              <img
                style={{ width: '20px', borderRadius: "50%" }}
                alt="Language "
                src="/static/images/vn-square-flag.png"
              />
            </IconButton>
            <Menu
              id="lang-menu"
              anchorEl={anchorEl1}
              keepMounted
              open={Boolean(anchorEl1)}
              onClose={handleCloseLangSwitch}
            >
              <MenuItem onClick={() => { }}>
                <img
                  style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                  alt="Language "
                  src="/static/images/en-square-flag.png"
                /> English
              </MenuItem>
              <MenuItem onClick={() => { }}>
                <img
                  style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                  alt="Language "
                  src="/static/images/cn-square-flag.png"
                />
                中文
              </MenuItem>
              <MenuItem onClick={() => { }}>
                <img
                  style={{ width: '20px', borderRadius: "50%", marginRight: '5px' }}
                  alt="Language "
                  src="/static/images/lao-square-flag.png"
                />
                ພາສາລາວ
              </MenuItem>
            </Menu>

            <IconButton
              // onClick={onMobileNavOpen}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Hidden>

        <Drawer open={menuResponsive} anchor={'left'} onClose={toggleDrawer(false)}>
          <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <RouterLink to="/" className={classes.wrapLogo}>
              <Logo />
            </RouterLink>
            <List style={{ width: 350 }}>
              {listMenu.map((menu) => (
                <ListItem button key={menu.value}>
                  <ListItemText primary={menu.label} className={renderClassMenu(menu.value)} onClick={() => switchRoute(menu.link)} />
                  <Divider />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
