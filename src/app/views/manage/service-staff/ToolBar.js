import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  SvgIcon,
  TextField
} from '@material-ui/core';
import { DEVICE_STATUS_VALUE } from 'src/app/constant/config';
import { Search as SearchIcon } from 'react-feather';
import { green } from '@material-ui/core/colors';
import { NavLink as RouterLink } from 'react-router-dom';
import CreateAgency from './create';

// import CreateAgency from './create';

const Toolbar = ({
  className,
  searchRef,
  clearSearchRef,
  // createNewUserRef,
  isLoading,
  ...rest
}) => {
  const classes = useStyles();
  const [query, setQuery] = useState({
    keyword: '',
    status: ''
  });
  const [openCreateModal, setOpenCreateModal] = useState(false)


  const selectStatusUser = event => {
    if (!searchRef) return;
    const queryValue = Object.assign({}, query, {
      status: event.target.value,
      page: 1
    });
    setQuery(queryValue);
    searchRef(queryValue);
  };

  const onEnterSearchInput = event => {
    if (!searchRef) return;
    if (event.keyCode === 13) {
      const queryValue = Object.assign({}, query, {
        keyword: event.target.value,
        page: 1
      });
      setQuery(queryValue);
      searchRef(queryValue);
    }
  };

  const changeTextInputSearch = event => {
    const queryValue = Object.assign({}, query, {
      keyword: event.target.value,
      page: 1
    });
    setQuery(queryValue);
  };

  const clearSearch = () => {
    if (!clearSearchRef) return;
    clearSearchRef();
    setQuery({ keyword: '', status: '' });
  };

  const searcUser = () => {
    if (!searchRef) return;
    searchRef(query);
  };

  const createAgency = () => {
 
  };

  const closeModal = () => {
    setOpenCreateModal(false)
  }

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <CreateAgency open={openCreateModal} closeRef={closeModal} />
      <Box>
        <Box className={classes.groupSearch}>
          <div className={classes.groupSearchLeft}>
            <TextField
              onKeyDown={onEnterSearchInput}
              onChange={changeTextInputSearch}
              className={'searchInputDevice'}
              value={query.keyword}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Tìm kiếm"
              variant="outlined"
            />

          </div>
          <Button
              style={{marginLeft: '10px' , color:'#ffff', backgroundColor: '#AE0000'}}
            className={classes.styleInputSearch}
            color="secondary"
            variant="contained"
            onClick={() => setOpenCreateModal(true)}
            // component={RouterLink}
            // to={'/app/agency/create'}
          >
            Thêm nhân viên
          </Button>
        </Box>
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
    height: '40px',
    textTransform: 'none',
    padding: '0px 1em',
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
