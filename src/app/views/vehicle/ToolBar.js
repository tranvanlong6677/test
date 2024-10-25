import React, { useState } from 'react';
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

const Toolbar = ({
  className,
  searchRef,
  clearSearchRef,
  createNewDeviceRef,
  isLoading,
  ...rest
}) => {
  const classes = useStyles();
  const [query, setQuery] = useState({
    license_plate: ''
    // status: ''
  });

  const onEnterSearchInput = event => {
    if (!searchRef) return;
    if (event.keyCode == 13) {
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

  const clearSearch = () => {
    if (!clearSearchRef) return;
    clearSearchRef();
    setQuery({ license_plate: '' });
  };

  const searchDevice = () => {
    if (!searchRef) return;
    searchRef(query);
  };

  const createNewDevice = () => {
    if (!createNewDeviceRef) return;
    createNewDeviceRef();
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box>
        <Card>
          <CardContent>
            <Box className={classes.groupSearch}>
              <div className={classes.groupSearchLeft}>
                <TextField
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
                <div className={classes.wrapper}>
                  <Button
                    className={classes.styleInputSearch}
                    color="primary"
                    variant="contained"
                    onClick={() => searchDevice()}
                  >
                    {!isLoading ? <span>Tìm kiếm </span> : ''}
                  </Button>
                  {isLoading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
                <Button
                  className={classes.styleInputSearch}
                  color="default"
                  variant="contained"
                  onClick={() => clearSearch()}
                >
                  Bỏ lọc
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

const useStyles = makeStyles(theme => ({
  root: {},
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
    justifyContent: 'space-between',
    // overflowX: 'scroll',
    minWidth: '50%'
  },
  groupSearchLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  searchInput: {
    width: '250px'
  },
  styleInputSearch: {
    height: '55px'
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