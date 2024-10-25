import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Grid, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button,Paper
} from '@material-ui/core';

import Search from './Search.js';
import LoadingInBox from 'src/app/components/LoadingInBox';
import { addGroupToUser, removeGroupToUser } from 'src/features/groupUser'


export default function TransferList({ selectedGroup, listGroupVehicle, listGroupByUser, listVehicles }) {
  const dispatch = useDispatch();
  const [checkedLeft, setCheckedLeft] =  React.useState([]);
  const [checkedRight, setCheckedRight] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);
  const [right, setRight] = React.useState([4, 5, 6, 7]);

  const isLoadingGroup = useSelector(state => state.groupVehicle.isLoadingGroup);
  const isLoading = useSelector(state => state.groupVehicle.isLoading);

  const userSelected_local = JSON.parse(localStorage.getItem('userId-selected'));
  useEffect(() => {
    const checkedArray_local = JSON.parse(localStorage.getItem('checkedArray-left'));
    const checkedRight_local = JSON.parse(localStorage.getItem('checkedArray-right'));

    if(checkedArray_local){
      console.log('uef checkedLeft 111',checkedArray_local);
        setCheckedLeft(checkedArray_local);
    }
    if(checkedRight_local){
      setCheckedRight(checkedRight_local);
    }
  }, [selectedGroup]);

  useEffect(() => {
    setCheckedLeft([]);
    setCheckedRight([]);

    return () => {
      localStorage.setItem('checkedArray-left',JSON.stringify([]));
      localStorage.setItem('checkedArray-right',JSON.stringify([]));
    }
  }, [userSelected_local]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('checkedArray-left');
      localStorage.removeItem('checkedArray-right');
      localStorage.removeItem('userId-selected');
    }
  }, []);

  const handleToggleLeft = (value) => () => {
    //console.log('checkedLeft handleToggleLeft>>>>>',checkedLeft);
    const currentIndex = checkedLeft.indexOf(value);
    const newChecked = [...checkedLeft];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedLeft(newChecked);
    localStorage.setItem('checkedArray-left',JSON.stringify(newChecked))
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
    localStorage.setItem('checkedArray-right',JSON.stringify(newChecked))
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleAddDevice = () => {
    if(checkedRight.length > 0 && selectedGroup) {
        dispatch(addGroupToUser({ 
          payload: { user_id: selectedGroup, list_group_device_id: checkedRight },
        }))
    }
  }

  const handleRemoveDevice = () => {
    if(checkedLeft.length > 0 && selectedGroup) {
        dispatch(removeGroupToUser({ 
          payload: { user_id: selectedGroup, list_group_device_id: checkedLeft },
        }))
    }
  }

  const removeAll = () => {
    const all = listGroupByUser.map((item) => {
      return item.id;
    })
    if(all.length > 0 && selectedGroup) {
      dispatch(removeGroupToUser({ 
        payload: { user_id: selectedGroup, list_group_device_id: all },
      }))
    }
  };

  const addAll = () => {
    const all = listVehicles.map((item) => {
      return item.id;
    })

    if(all.length > 0 && selectedGroup) {
      dispatch(addGroupToUser({ 
          payload: { user_id: selectedGroup, list_group_device_id: all }
      }))
    }
  }


  const customListLeft = (items) => (
      <>
        <div className='title p-3'>
            <b> 
              Danh sách nhóm của người dùng
            </b>
        </div>
        <div className='row mx-auto'>
            <Search />
        </div>
        <div className="row list-vehicles">
          <List dense component="div" role="list">
              {isLoadingGroup ?
              <> 
                  <LoadingInBox /> 
              </>
              : (listGroupByUser && listGroupByUser.map((value) => {
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
                      <ListItemText id={labelId} primary={value.name} />
                      </ListItem>
                  );
              }))} {
                  !isLoadingGroup && ((listGroupByUser && listGroupByUser.length < 1) || !listGroupByUser) && <div className="text-center pb-5">
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
                Danh sách nhóm phương tiện
            </b>
        </div>
        <div className='row mx-auto'>
            <Search />
        </div>
        <div className="row list-vehicles">
          <List dense component="div" role="list">
              { isLoading ?  <> 
                <LoadingInBox /> 
                </> :  (items && items.map((value) => {
                const labelId = `transfer-list-item-${value.id}-label`;

                return (
                    <ListItem
                        key={value.id}
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
                    <ListItemText id={labelId} primary={value.name} />
                    </ListItem>
                );
                }))}  {
                  !isLoading && ((items && items.length < 1) || !items) && <div className="text-center pb-5">
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
                    disabled={listGroupByUser && listGroupByUser.length === 0  || !selectedGroup}
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
                    disabled={listGroupVehicle && listGroupVehicle.length === 0  || !selectedGroup}
                    aria-label="move all left"
                >
                    ≪
                </Button>
                </Grid>
            </div>
            <div className='col-5 list-vehicle-group'> { customListRight(listGroupVehicle)}</div>
        </div>
  );
}