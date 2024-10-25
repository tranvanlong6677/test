import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Grid, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button,Paper
} from '@material-ui/core';

import Search from './Search.js';
import LoadingInBox from 'src/app/components/LoadingInBox';
import { addDeviceToGroup, removeDeviceToGroup } from 'src/features/groupVehicle'

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({ selectedGroup, listVehicleByGroup, listVehicles }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState([]);
  const [checkedLeft, setCheckedLeft] =  React.useState([]);
  const [checkedRight, setCheckedRight] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);
  const [right, setRight] = React.useState([4, 5, 6, 7]);

  const isLoadingVehicle = useSelector(state => state.groupVehicle.isLoadingVehicle);
  const isLoadingVehicleA = useSelector(state => state.groupVehicle.isLoadingVehicleA)
 
  // React.useEffect(() => {
  //  console.log(checkedRight);
  //  console.log(checkedLeft);
  // }, [checkedLeft, checkedRight])\

  const groupCarId_local = JSON.parse(localStorage.getItem('carId-selected'))
  

  useEffect(() => {
    const checkedCarLeft_local = JSON.parse(localStorage.getItem('checkedCar-left'));
    const checkedCarRight_local = JSON.parse(localStorage.getItem('checkedCar-right'));

    if(checkedCarLeft_local){
        setCheckedLeft(checkedCarLeft_local);
    }
    if(checkedCarRight_local){
      setCheckedRight(checkedCarRight_local);
    }
  }, [selectedGroup]);

  useEffect(() => {
    setCheckedLeft([]);
    setCheckedRight([]);

    return () => {
      localStorage.setItem('checkedCar-left',JSON.stringify([]));
      localStorage.setItem('checkedCar-right',JSON.stringify([]));
    }
  }, [groupCarId_local]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('checkedCar-left');
      localStorage.removeItem('checkedCar-right');
      localStorage.removeItem('carId-selected');
    }
  }, []);

  const handleToggleLeft = (value) => () => {
    const currentIndex = checkedLeft.indexOf(value);
    const newChecked = [...checkedLeft];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedLeft(newChecked);
    localStorage.setItem('checkedCar-left',JSON.stringify(newChecked))
  }

  const handleToggleRight = (value) => () => {
    const currentIndex = checkedRight.indexOf(value);
    const newChecked = [...checkedRight];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedRight(newChecked);
    localStorage.setItem('checkedCar-right',JSON.stringify(newChecked))
  };



  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleAddDevice = () => {
    if(checkedRight.length > 0 && selectedGroup) {
        dispatch(addDeviceToGroup({ 
            payload: { list_device_id: checkedRight },
            groupDeviceId: selectedGroup
        }))
    }
  }

  const handleRemoveDevice = () => {
    if(checkedLeft.length > 0 && selectedGroup) {
        dispatch(removeDeviceToGroup({ 
            payload: { list_device_id: checkedLeft },
            groupDeviceId: selectedGroup
        }))
    }
  }

  const removeAll = () => {
    const all = listVehicleByGroup.map((item) => {
      return item.id;
    })
    if(all.length > 0 && selectedGroup) {
      dispatch(removeDeviceToGroup({ 
          payload: { list_device_id: all },
          groupDeviceId: selectedGroup
      }))
    }
  };

  const addAll = () => {
    const all = listVehicles.map((item) => {
      return item.id;
    })
    if(all.length > 0 && selectedGroup) {
      dispatch(addDeviceToGroup({ 
          payload: { list_device_id: all },
          groupDeviceId: selectedGroup
      }))
    }
  }


  const customListLeft = (items) => (
      <>
        <div className='title p-3'>
            <b> 
                Danh sách xe thuộc nhóm 
            </b>
        </div>
        <div className='row mx-auto'>
            <Search />
        </div>
        <div className="row list-vehicles">
          <List dense component="div" role="list">
              {isLoadingVehicle ?
              <> 
                  <LoadingInBox /> 
              </>
              : (listVehicleByGroup && listVehicleByGroup.map((value) => {
                  const labelId = `transfer-list-item-${value.id}-label`;

                  return (
                      <ListItem
                      key={value.id}
                      role="listitem"
                      button
                      onClick={handleToggleLeft(value.id)}
                      >
                      <ListItemIcon>
                          <Checkbox
                          checked={checkedLeft.indexOf(value.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                              'aria-labelledby': labelId,
                          }}
                          />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={value.vehicle.license_plate} />
                      </ListItem>
                  );
              }))} {
                  !isLoadingVehicle && ((listVehicleByGroup && listVehicleByGroup.length < 1) || !listVehicleByGroup) && <div className="text-center pb-5">
                      <img src="/static/empty.png" class="justify-content-center"/>
                      <h4> Danh sách trống  </h4>
                  </div>
              }
              <ListItem />
          </List>
        </div>
      </>
  );

  const customListRight = (items) => (
    <div >
        <div className='title p-3'>
            <b> 
                Danh sách phương tiện
            </b>
        </div>
        <div className='row mx-auto'>
            <Search />
        </div>
        <div className="row list-vehicles">
          <List dense component="div" role="list">
              { isLoadingVehicleA ?  <> 
                <LoadingInBox /> 
                </> :  (items && items.map((value) => {
                const labelId = `transfer-list-item-${value.vehicle.id}-label`;

                return (
                    <ListItem
                        key={value.vehicle.id}
                        role="listitem"
                        button
                        onClick={handleToggleRight(value.id)}
                    >
                    <ListItemIcon>
                        <Checkbox
                        checked={checkedRight.indexOf(value.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.vehicle.license_plate} />
                    </ListItem>
                );
                }))}  {
                  !isLoadingVehicleA && ((items && items.length < 1) || !items) && <div className="text-center pb-5">
                        <img src="/static/empty.png" class="justify-content-center"/>
                        <h4> Danh sách trống  </h4>
                    </div>
                }
              <ListItem />
          </List>
        </div>
    </div>
  );
  return (
        <div className="row">

            <div className="col-5 list-vehicle-group">{customListLeft(left)}</div>
            <div className="col-2 mt-5 button-tranfer-group">
                <Grid container direction="column" alignItems="center">
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={removeAll}
                    disabled={listVehicleByGroup && listVehicleByGroup.length === 0  || !selectedGroup}
                    aria-label="move all right"
                >
                    ≫
                </Button>
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    // onClick={handleCheckedRight}
                    onClick={handleRemoveDevice}
                    disabled={checkedLeft.length === 0 || !selectedGroup}
                    aria-label="move selected right"
                >
                    &gt;
                </Button>
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAddDevice}
                    // onClick={handleCheckedLeft}
                    disabled={checkedRight.length === 0 || !selectedGroup}
                    aria-label="move selected left"
                >
                    &lt;
                </Button>
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={addAll}
                    disabled={listVehicles && listVehicles.length === 0  || !selectedGroup}
                    aria-label="move all left"
                >
                    ≪
                </Button>
                </Grid>
            </div>
            <div className='col-5 list-vehicle-group'> { customListRight(listVehicles)}</div>
        </div>
  );
}