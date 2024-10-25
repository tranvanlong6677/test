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
  CircularProgress,
  Select,
  MenuItem
} from '@material-ui/core';
import { connect } from "react-redux";
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
import { createStaff, getListStaff, resetChange } from 'src/features/staffSlice';
import { addDriver, getListDriverLicenseType, getListDriver } from 'src/features/driverSlice';
import { createVehicleType } from 'src/features/vehicleTypeSlice';
import { VehicleType } from 'src/app/model/VehicleType';
import moment from 'moment';

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

function CreateDriverForm({ closeRef }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const statusCreate = useSelector(state => state.driverSlice.statusCreate);
  const [initValue, setInitValue] = useState(new VehicleType());

  const handleSubmit = data => {
    dispatch(createVehicleType(data));
    setInitValue(data);
  };

  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          title: Yup.string()
            .max(100)
            .required('Tên không được để trống'),
          slots: Yup.number(),
          tonnage: Yup.number(),
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
              <Grid item md={12} xs={12}>
                <InputLabel>Tên loại phương tiện<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.title && errors.title
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.title && errors.title}
                  margin="normal"
                  name="title"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                 
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Số chỗ: </InputLabel>
                <TextField
                  number
                  error={Boolean(
                    touched.slots && errors.slots
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.slots && errors.slots}
                  margin="normal"
                  name="slots"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.slots}
                 
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel>Tải trọng: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.tonnage && errors.tonnage
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.tonnage && errors.tonnage}
                  margin="normal"
                  name="tonnage"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.tonnage}
                 
                  variant="outlined"
                />
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
                    Thêm mới
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

export default CreateDriverForm;
