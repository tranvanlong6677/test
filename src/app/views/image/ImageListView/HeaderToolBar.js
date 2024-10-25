import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  makeStyles,
  SvgIcon,
  TextField
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { resetListImg } from 'src/features/imageSlice';


const Toolbar = ({
  className,
  querySearch,
  searchRef,
  clearSearchRef,
  createNewDeviceRef,
  isLoading,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [query, setQuery] = useState({
    license_plate: querySearch.name || '',
    start_date: querySearch.start_date || moment().subtract(7, 'd').format('YYYY-MM-DDTHH:mm'),
    end_date: querySearch.end_date || moment().format('YYYY-MM-DDTHH:mm')
    // status: ''
  });

  const onEnterSearchInput = event => {
   
    if (!searchRef) return;
    if (event.keyCode === 13) {
      const queryValue = Object.assign({}, query, {
        license_plate: event.target.value,
        page: 1
      });
      setQuery(queryValue);
      searchRef(queryValue);
    }
  };

  const changeTextInputSearch = event => {
    const queryValue = Object.assign({}, query, {
      license_plate: event.target.value,
      page: 1
    });
    setQuery(queryValue);
  };

  const changeStartDate = event => {
    const queryValue = Object.assign({}, query, {
      start_date: event.target.value,
      page: 1
    });
    setQuery(queryValue);
  };

  const changeEndDate = event => {
    const queryValue = Object.assign({}, query, {
      end_date: event.target.value,
      page: 1
    });
    setQuery(queryValue);
  };

  const clearSearch = () => {
    if (!clearSearchRef) return;
    clearSearchRef();
    setQuery({ license_plate: '' });
  };

  const searchDevice = () => {
    if (!searchRef) {return;}
    searchRef(query);
  };

 

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.groupSearch}>
        <div className={classes.groupSearchLeft}>
          <div className={classes.wrapper}>
            <div style={{marginBottom: '10px'}}>Chọn phương tiện</div>
            <TextField
              size="small"
              onKeyDown={onEnterSearchInput}
              onChange={changeTextInputSearch}
              className={classes.searchInput}
              value={query.license_plate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Nhập tên để tìm kiếm ..."
              variant="outlined"
            />
          </div>
          <div className={classes.wrapper}>
            <div style={{marginBottom: '10px'}}>Từ ngày</div>
            <TextField
                size="small"
                style={{margin: 0}}
                fullWidth
                margin="normal"
                name="effective_date"
                onChange={changeStartDate}
                value={query.start_date}
                type="datetime-local"
                variant="outlined"
              />
          </div>
          <div className={classes.wrapper}>
            <div style={{marginBottom: '10px'}}>Đến ngày</div>
             <TextField
                size="small"
                style={{margin: 0}}
                fullWidth
                margin="normal"
                name="effective_date"
                onChange={changeEndDate}
                value={query.end_date}
                type="datetime-local"
                variant="outlined"
              />
          </div>
          <div className={classes.wrapper}>
            <Button
              className={classes.styleInputSearch}
              style={{ background: '#C62222', color: '#fff', paddingLeft: '30px',  paddingRight: '30px', textTransform: 'inherit', fontSize: '16px' }}
              variant="contained"
              size="small"

              onClick={() => searchDevice()}
            >
              {!isLoading ? <span>Tìm kiếm ảnh </span> : ''}
            </Button>
            {isLoading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          {/* <div className={classes.wrapper}>
            <Button
              className={classes.styleInputSearch}
              color="default"
              variant="contained"
              onClick={() => clearSearch()}
            >
              Bỏ lọc
            </Button>
          </div> */}
        </div>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

const useStyles = makeStyles(theme => ({
  root: {marginTop: '20px', marginBottom: '20px'},
  importButton: {
    marginRight: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  groupSearch: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // overflowX: 'scroll',
    minWidth: '50%'
  },
  groupSearchLeft: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  searchInput: {
    width: '400px'
  },
  styleInputSearch: {
    height: '40px',
  },
  exportBtn: {
    justifyContent: 'flex-end',
    display: 'flex',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  shadowBox: {
    boxShadow: '0 2px 5px rgba(0,0,0,.18)'
  }
}));

export default Toolbar;
