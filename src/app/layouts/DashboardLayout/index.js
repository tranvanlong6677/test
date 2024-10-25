import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie';

const DashboardLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!Cookie.get('access-token')) navigate('/login');
  }, [navigate]);
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [hiddenBar, setHiddenBar] = useState(true);

  return (
    <div className={classes.root}>
      {window.location.pathname != '/login' &&
        window.location.pathname != '/register' && (
          <TopBar
            onMobileNavOpen={() => {
              setMobileNavOpen(true);
            }}
          />
        )}
      <div className="container-fluid" style={{marginTop:'80px', overflowY:'auto'}}>
        <Outlet />
        <ToastContainer />
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100vw'
  },
  wrapper: {
    display: 'flex',
    position: 'relative',
    flex: '1 1 auto',
    paddingTop: 64
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    width: '100vw',
    height: 'calc(100%-80px)',
    overflow: 'auto'
  }
}));

export default DashboardLayout;
