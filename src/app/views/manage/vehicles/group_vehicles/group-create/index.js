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
import { green } from '@material-ui/core/colors';

import {
  STATUS_API
} from 'src/app/constant/config';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { createGroupVehicle } from 'src/features/groupVehicle';
import { GroupVehicle } from 'src/app/model/GroupVehicle';

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

function CreateVehicleTypeForm({ closeRef, isEdit = false, vehicleType }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const statusCreate = useSelector(state => state.driverSlice.statusCreate);
  const [initValue, setInitValue] = useState(vehicleType || new GroupVehicle());

  const handleSubmit = data => {
    if(isEdit) {
      const { id } = data;
      
      delete data.id;
      delete data.created_at; 
      delete data.updated_at;
      const newData = data;

      // dispatch(updateVehicleType({ id , data: newData }));
    } else {

      dispatch(createGroupVehicle({ ...data, agency_id: dataLogin.agency.id }));
      setInitValue(data);
    }
  
  };

 

  return (
    <div>
      <Formik
        initialValues={initValue}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(100)
            .required('Tên không được để trống'),

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
                <InputLabel>Tên nhóm phương tiện<span style={{ color: 'red' }}>*</span>: </InputLabel>
                <TextField
                  error={Boolean(
                    touched.name && errors.name
                  )}
                  className="input-no-fieldset"
                  fullWidth
                  helperText={touched.name && errors.name}
                  margin="normal"
                  name="name"
                  size="small"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
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
                    { isEdit ? 'Cập nhật' : 'Thêm mới' }
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

export default CreateVehicleTypeForm;
