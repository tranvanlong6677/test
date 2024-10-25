import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import ToastMessage from 'src/app/components/ToastMessage';
import FilterBox from 'src/app/components/FilterBox';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Popover,
  InputAdornment,
  makeStyles,
  SvgIcon,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import {
  DEVICE_STATUS_VALUE,
  STATUS_API,
  messageToastType_const,
  PAGE_SIZE_LIST
} from 'src/app/constant/config';
import { Search as SearchIcon } from 'react-feather';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { CloudUpload } from '@material-ui/icons';
import { importDevice } from 'src/features/deviceSlice';
import {
  showToast,
  closeToast
} from 'src/features/uiSlice';
import { getListDevice } from 'src/features/deviceSlice'
import { useNavigate, useLocation } from 'react-router-dom';
import { _convertObjectToQuery } from 'src/app/utils/apiService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Toolbar = ({
  className,
  searchRef,
  clearSearchRef,
  createNewDeviceRef,
  isLoading,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const queryParams = useQuery();

  const [query, setQuery] = useState({
    keyword: '',
    status: ''
  });
  const [agency, setAgency] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInput = useRef(null)

  const params = {
    page: queryParams.get('page') || 1,
    page_size: queryParams.get('page_size') || PAGE_SIZE_LIST,
    is_pagination: true
  };

  
  const handleClickFilter = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null)
  }

  const resetChange = () => {
    closeToast();
  }

  const [file, setFile] = useState(null)

  const dispatch = useDispatch();

  const onFileChange = event => {
    upload(event.target.files[0])
  };

  const upload = (file) => {
    if(file) {
      const formData = new FormData();

      formData.append("file", file, file.name);
        
      dispatch(importDevice(formData));

      setFile(null)

      document.getElementById("importDevice").value = "";
      dispatch(getListDevice(params));

      navigate(`/app/device?${_convertObjectToQuery(params)}`);
    }
  }

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

  const searcDevice = () => {
    if (!searchRef) return;
    searchRef(query);
  };

  const createNewDevice = () => {
    if (!createNewDeviceRef) return;
    createNewDeviceRef();
  };

  const handleChange = () => {

  }

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box>
            <Box className={classes.groupSearch}>
              <div className="col-6">
                <TextField
                  onKeyDown={onEnterSearchInput}
                  onChange={changeTextInputSearch}
                  className={'searchInputDevice'}
                  value={query.keyword}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Nhập tên, số serial, số điện thoại để tìm ..."
                />
                
              </div>
              <div className="col-6 d-flex justify-content-end">
                <div
                  style={{ color:'#C62222'}}
                  color="secondary"
                  size="small"
                  variant="contained"
                  className="pt-2 mx-3 cursor-pointer"
                >
                  <span className="cursor-pointer"  aria-describedby="filter-module" onClick={handleClickFilter}>                    
                   <img src={`/static/iconSvg/filter.svg`} style={{ paddingRight: '5px', paddingBottom: '4px'}}/>
                    &nbsp; Lọc 
                  </span>

                  <Popover
                    id="filter-module"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <FilterBox />
                  </Popover>
                </div>
                <input
                    name="file"
                    ref={fileInput}
                    id="importDevice"
                    onChange={onFileChange}
                    type="file"
                    hidden
                />
                <div
                    onClick={() => fileInput.current.click()}
                    style={{ color:'#C62222'}}
                    color="secondary"
                    size="small"
                    variant="contained"
                    className="pt-2 mx-3 cursor-pointer"
                >
                <span >                    
                  <img src={`/static/iconSvg/import.svg`} style={{ paddingRight: '5px', paddingBottom: '4px'}}/>
                  &nbsp; Import 
                  
                </span>
                
              </div>
              <Button
                onClick={() => createNewDevice()}
                style={{marginLeft: '10px' , color:'#ffff', backgroundColor: '#AE0000'}}
                className={classes.styleInputSearch}
                color="secondary"
                variant="contained"
              >
                Kích hoạt thiết bị
              </Button>
              </div>
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
    justifyContent: 'flex-start',
  },
  searchInput: {
    width: '353px'
  },
  styleInputSearch: {
    height: '40px',
    textTransform: 'none !important'
  },
  exportBtn: {
    justifyContent: 'flex-end',
    display: 'flex',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  shadowBox: {
    boxShadow: '0 2px 5px rgba(0,0,0,.18)'
  },
}));

export default Toolbar;
