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
import { AccountCircle, DataUsageRounded } from '@material-ui/icons';
import { getListProvinces } from 'src/features/provinceSlice';
import { VpnKey, Phone, Email } from '@material-ui/icons';
import { createStaff, getListStaff, resetChange } from 'src/features/staffSlice';
import { addDriver, getListDriverLicenseType, getListDriver } from 'src/features/driverSlice';
import { createVehicleType, updateVehicleType } from 'src/features/vehicleTypeSlice';
import { updateAgencyStatus } from 'src/features/agencySlice';

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

function CreateVehicleTypeForm({ closeRef, isEdit , agency }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [initValue, setInitValue] = useState({ agency_status: agency.status });
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = data => {
    if(isEdit) {
      dispatch(updateAgencyStatus({ id: agency.id , data  }));
    } 
  };

 

  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          agency_status: Yup.string()
            .required('Trạng thái không được để trống'),

        })}
        onSubmit={handleSubmit}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            touched,
            values
          }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column ", width: "100%", borderColor: "#E5E5E8", borderWidth: "1px", borderStyle: "solid", padding: '0.3em', marginBottom: "10px", borderRadius: "5px" }}>
              <Select
                style={{ width: '100%', borderWidth: "0px" }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                defaultValue={agency.status}
                displayEmpty
                name="agency_status"
                disableUnderline
                onChange={(e) => setFieldValue('agency_status', e.target.value)}
              >
                <MenuItem value='active'>
                  <small> Hoạt động </small>
                </MenuItem>
                <MenuItem value='freeze'>
                  <small> Không hoạt động </small>
                </MenuItem>

              </Select>
            </div>
            <Box my={3}>
              <div className={classes.groupButtonSubmit}>
                <div className={classes.wrapper}>
                 
                  <Button
                    style={{ marginRight: '10px', textTranform: 'none !important' }}
                    className="btn-main mx-3"
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Đổi trạng thái
                  </Button>
                  {isLoading && (
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

export default CreateVehicleTypeForm;
