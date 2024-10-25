import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  TextField,
  Chip,
  CircularProgress
} from '@material-ui/core';

import { green } from '@material-ui/core/colors';
import { useNavigate } from 'react-router-dom';

import {
  messageToastType_const,
  STATUS_API
} from 'src/app/constant/config';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { AccountCircle } from '@material-ui/icons';
import { getListProvinces } from 'src/features/provinceSlice';
import { VpnKey, Phone, Email } from '@material-ui/icons';
import { getListAgencies } from 'src/features/agencySlice';
import { updateStaff, getListStaff, resetChange } from 'src/features/staffSlice';
import { Staff } from '../../../../model/Staff';
import { List } from 'rc-field-form';
import { DataGrid } from '@mui/x-data-grid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function EditStaff({ closeRef, staff }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.staffSlice.errors);
  const statusCreate = useSelector(state => state.staffSlice.statusCreate);
  const listAgencies = useSelector(state => state.agencySlice.listAgencies);

  const [listAgenciesSelect, setListAgenciesSelect] = useState([]);
  const [initValue, setInitValue] = useState(staff || new Staff());

  const handleSubmit = data => {
    const id = data.id;

    const listAgenciesID = listAgenciesSelect.map(item =>  item.id);

    const newData = {
      email: data.email,
      phone: data.phone,
      full_name: data.full_name,
      address: data.address,
      list_sale_agent_id: listAgenciesID
    }

    setInitValue(newData);
    dispatch(updateStaff({ id, data: newData }));

    closeRef();
  };

  useEffect(() => {
    setInitValue(staff)
  })

  useEffect(() => {
    console.log(staff.sale_agencies_taken_care_by_customer_care)
    setListAgenciesSelect(staff.sale_agencies_taken_care_by_customer_care)
  }, [staff])

  const getName = (id) => {
    const target = listAgencies.filter((agency) => {
      return agency.id == id;
    })

    return target && target[0] ? target[0].name : null;
  }

  const handleChoose = (e) => {
    setListAgenciesSelect([...listAgenciesSelect, { 
      id: Number(e.target.value), name: getName(e.target.value) 
    }])
  }

  const handleClickChip = () => {
    console.info('You clicked the Chip.');
  };

  const handleDeleteChip = (agencySelect) => {
    const newAngencies = listAgenciesSelect.filter(agency => agency.id != agencySelect.id);
    setListAgenciesSelect(newAngencies);
  };

  useEffect(() => {
    dispatch(getListProvinces());
    dispatch(getListAgencies());
  }, [dispatch]);

  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          full_name: Yup.string()
            .max(100)
            .required('Tên không được để trống'),
          email: Yup.string()
            .email('Email chưa đúng định dạng')
            .required('email không được để trống'),
          phone: Yup.string()
            .matches(
              /^(84|0[3|5|7|8|9])+([0-9]{8})$/,
              'Số điện thoại chưa đúng định dạng'
            )
            .required('Số điện thoại không được để trống'),
          address: Yup.string()
              .max(100)
              .required('Địa chỉ không được để trống'),
        })}
        onSubmit={handleSubmit}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values
          }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputLabel>Tên nhân viên<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.full_name && errors.full_name
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.full_name && errors.full_name}
                  margin="normal"
                  name="full_name"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.full_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Số điện thoại <span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(touched.phone && errors.phone)}
                  fullWidth
                  className="input-no-fieldset"
                  helperText={touched.phone && errors.phone}
                  margin="normal"
                  size="small"
                  name="phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Email <span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  margin="normal"
                  className="input-no-fieldset"
                  name="email"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>{' '}
              <Grid item md={6} xs={12}>
                <InputLabel>Địa chỉ<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.address && errors.address
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.address && errors.address}
                  margin="normal"
                  name="address"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
             
              <Grid item md={6} xs={6}>
                <InputLabel>Đại lý <span className="text-danger">*</span> :</InputLabel>
                <TextField
                  className="input-no-fieldset"
                  size="small"
                  fullWidth
                  select
                  helperText={touched.agency_id && errors.agency_id}
                  margin="normal"
                  name="agency_id"
                  onBlur={handleBlur}
                  onChange={handleChoose}
                  SelectProps={{
                    native: true
                  }}
                  value={values.agency_id}
                  variant="outlined"
                >
                  <option>Chọn đại lý</option>
                  {listAgencies && listAgencies.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                {listAgenciesSelect && listAgenciesSelect.map((agency => <> 
                  <Chip
                      label={agency.name}
                      onClick={handleClickChip}
                      onDelete={() => handleDeleteChip(agency)}
                    /> 
                    </>))}
              </Grid>
            </Grid>
            <Box my={3}>
              <div className={classes.groupButtonSubmit}>
                <div className={classes.wrapper}>
                  <Button
                    style={{ marginRight: '10px', textTranform: 'none !important' }}
                    onClick={() => closeRef()}
                    className="btn-main btn-plain mx-3"
                    color="primary"
                    size="large"
                    variant="contained"
                  >
                    Thoát
                  </Button>
                  <Button
                    style={{ marginRight: '10px', textTranform: 'none !important' }}
                    className="btn-main mx-3"
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Cập nhật 
                  </Button>
                  {statusCreate === STATUS_API.PENDING && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </div>
            </Box>
          </form>
        )}
      </Formik>

      
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  shadowBox: {
    boxShadow: '0 2px 5px rgba(0,0,0,.18)'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  formHeader: {
    padding: theme.spacing(3)
  },
  root: {
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  groupButtonSubmit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15px',

    '& .left-button': {
      display: 'flex'
    }
  },
  avatar: {
    height: 100,
    width: 100
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  wrapper: {
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  disableForm: {
    pointerEvents: 'none'
  },
  colorWhite: {
    color: '#fff'
  }
}));

export default EditStaff;
