import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/app/components/GlobalStyles';
import theme from 'src/app/theme';
import routes from 'src/routes';
import moment from 'moment';
import { GetUserInfo } from './features/authSlice'

import './App.css';
import 'moment/locale/vi';
require('dotenv');

const App = () => {
  const dispatch = useDispatch();
  const dataLogin = useSelector(state => state.authSlice.dataLogin);

  useEffect(() => {
    if(!dataLogin) {
      dispatch(GetUserInfo())
    }
  }, []) 

  moment.locale('vi');
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>

  );
};

export default App;
