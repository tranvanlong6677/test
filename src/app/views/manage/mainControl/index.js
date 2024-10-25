import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, makeStyles, SvgIcon } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import { Truck as Car, MapPin as Map, Users as User } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';

const MainControlView = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const isAdmin = useSelector(state => state.authSlice.isAdmin);

  return (
    <Box className={classes.contentContainer}>
      <div className={classes.content}>
        <div className={classes.wrapMenu}>
            <h4 className={classes.title}>
              <span style={{marginRight:10}}>
                <img src={`/static/iconSvg/userIcon.svg`} /> 
              </span>
              Quản Trị Người Dùng
            </h4>
          <ul className={classes.menuItem}>
            { !isAdmin ? <> 
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/user')}
              >
                Quản lý người dùng 
              </li>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/group-users')}
              >
                Quản lý nhóm thành viên
              </li>
              </> : <>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/sales')}
              >
                Quản lý đại lý kinh doanh
              </li>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/service-staff')}
              >
                Quản lý nhân viên CSKH
              </li> 
            </> }
          </ul>
        </div>
       { isAdmin ? <div className={classes.wrapMenu}>
            <h4 className={classes.title}>
              <span style={{marginRight:10}}>
                <img src={`/static/iconSvg/vehicle.svg`} /> 
              </span>
              Quản Trị Phương Tiện
            </h4>
            <ul className={classes.menuItem}>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/vehicle-types')}
              >
                Quản trị loại phương tiện
              </li>
            </ul>
          </div> : 
          (<> <div className={classes.wrapMenu}>
            <h4 className={classes.title}>
            <span style={{marginRight:10}}>
                <img src={`/static/iconSvg/vehicle.svg`} /> 
              </span>
              Quản Trị Phương Tiện
             
            </h4>
            <ul className={classes.menuItem}>
            
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/vehicles')}
              >
                Quản trị phương tiện
              </li>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/group-vehicles')}
              >
                Quản lý nhóm xe
              </li>
            </ul>
          </div> 
          <div className={classes.wrapMenu}>
            <h4 className={classes.title}>
              <span style={{marginRight:10}}>
                <img src={`/static/iconSvg/drive.svg`} /> 
              </span>
              Quản Trị Lái Xe
            </h4>
            <ul className={classes.menuItem}>
              <li
                className={classes.item}
                onClick={() => navigate('/app/manage/driver/all')}
              >
                Danh Sách Lái Xe
              </li>
            </ul>
          </div></>)
        }
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
    color: '#C62222',
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
