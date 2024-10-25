import React,  { useState } from 'react';

import {
  Button,
  FormControl,
  Select
} from '@material-ui/core';

const FilterBox = ({  }) => {
  const [agency, setAgency] = useState(null);

  const handleChange = () => {

  }

  return (
    <div className="py-3 px-4">
      <div className="row text-left title-filter mb-3">
        Bộ lọc
      </div>

      <div className="row justify-content-center mb-2">

        <FormControl className="filter-item" size="small" variant="outlined">
          <span className="mb-1 label-input-filter"> Xí nghiệp </span>

          <Select
            native
            value={agency}
            onChange={handleChange}
          
            inputProps={{
              name: 'Xí nghiệp',
            }}
          >
            <option aria-label="None" value=""> Tất cả </option>
          </Select>
        </FormControl>
      </div>
      <div className="row justify-content-center mb-2">

        <FormControl  className="filter-item" size="small" variant="outlined">
          <span className="mb-1 label-input-filter"> Loại thiết bị </span>
          <Select
            native
            value={agency}
            onChange={handleChange}
          
            inputProps={{
              name: 'Xí nghiệp',
            }}
          >
            <option aria-label="None" value=""> Tất cả </option>
          </Select>
        </FormControl>
      </div>
      <div className="row justify-content-center mb-2">

        <FormControl className="filter-item" size="small" variant="outlined">
          <span className="mb-1 label-input-filter"> Loại xe </span>

          <Select
            native
            value={agency}
            onChange={handleChange}
          
            inputProps={{
              name: 'Xí nghiệp',
              id: 'outlined-age-native-simple2',
            }}
          >
            <option aria-label="None" value=""> Tất cả </option>
          </Select>
        </FormControl>
      </div>
      <div className="row justify-content-center mb-2">

        <FormControl className="filter-item" size="small" variant="outlined">
          <span className="mb-1 label-input-filter"> Trạng thái </span>

          <Select
            native
            value={agency}
            onChange={handleChange}
          
            inputProps={{
              name: 'Xí nghiệp',
              id: 'outlined-age-native-simple3',
            }}
          >
            <option aria-label="None" value=""> Tất cả </option>
          </Select>
        </FormControl>
      </div>
      <div className="row mt-4">
        <div className="col-6">
          <Button
              className="btn-filter btn-plain"
              variant="contained"
          >
            Đặt lại
          </Button>
        </div>

        <div className="col-6">
          <Button
              className="btn-filter"
              color="primary"
              variant="contained"
          >
            Áp dụng
          </Button>
        </div>
      </div>
  
    </div>
  );
};



export default FilterBox;
