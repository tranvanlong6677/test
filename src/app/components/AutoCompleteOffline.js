import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

AutoCompleteOffline.propTypes = {
  value: PropTypes.number,
  options: PropTypes.array.isRequired,
  labelDisplay: PropTypes.string.isRequired,
  placeHoldInput: PropTypes.string,
  handleSendValue: PropTypes.func.isRequired,
  primaryProperRender: PropTypes.string,
  secondaryProperRender: PropTypes.string,
  defaultValue: PropTypes.string
};

function AutoCompleteOffline({ 
  value,
  options,
  labelDisplay,
  placeHoldInput,
  primaryProperRender,
  secondaryProperRender,
  handleSendValue
}) {
  return (
    <Autocomplete
      id="combo-box-demo"
      value={value}
      options={options}
      getOptionLabel={option => option[`${labelDisplay}`]}
      getOptionSelected={(option, value) =>
        option[labelDisplay] === value[labelDisplay]
      }
      onChange={(event, value) => {
        handleSendValue(value);
      }}
      style={{ width: '100%' }}
      renderOption={option => (
        secondaryProperRender ?
          <React.Fragment>
            {option[primaryProperRender]} ({option[secondaryProperRender]})
          </React.Fragment> :
          <React.Fragment>
            {option[primaryProperRender]}
          </React.Fragment>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={placeHoldInput || ''}
          variant="outlined"
        />
      )}
    />
  );
}

export default AutoCompleteOffline;
