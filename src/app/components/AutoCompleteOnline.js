import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Proptypes from 'prop-types';
import axios from 'axios';
import Cookie from 'js-cookie';
import { TIMEOUT_DEFAULT } from '../constant/config';

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

const AutoCompleteOnline = React.memo(function({
  OnSendValue,
  Option,
  urlSearch,
  placeHolder
}) {
  const [open, setOpen] = React.useState(false);
  // const [options, setOptions] = React.useState([
  //   { id: 1, name: 'Sy' },
  //   { id: 1, name: 'Thinh' }
  // ]);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  function handleSendValue(value) {
    OnSendValue(value);
  }

  const [dataSearch, setCheckTyping] = React.useState({
    textSearch: '',
    typing: false,
    typingTimeOut: 0
  });
  function handleSearch(value) {
    console.log('function call');
    clearTimeout(dataSearch.typingTimeOut);
    setCheckTyping({
      textSearch: value,
      typing: false,
      typingTimeOut: setTimeout(async () => {
        setLoading(true);
        const response = await axios({
          // ToDo : change with param
          url: urlSearch + value,
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: 'Bearer ' + Cookie.get('access-token'),
            timeout: TIMEOUT_DEFAULT
          }
        });
        await sleep(1e3); // For demo purposes.
        const vehicle = await response.data;
        setLoading(false);
        setOptions(vehicle.payload.vehicles);
        // console.log(vehicle.payload.vehicles);
      }, 300)
    });
  }

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: '100%' }}
      open={open}
      onOpen={event => {
        // console.log(event.target.value);
        if (!event.target.value) return;
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => {
        console.log(value);
        handleSendValue(value);
      }}
      getOptionSelected={(option, value) =>
        option.license_plate === value.license_plate
      }
      getOptionLabel={option => option.license_plate}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          onChange={event => {
            handleSearch(event.target.value);
          }}
          placeholder={placeHolder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
});
AutoCompleteOnline.propsTypes = {
  OnSendValue: Proptypes.func.isRequired,
  Option: Proptypes.array,
  urlSearch: Proptypes.string.isRequired,
  placeholder: Proptypes.string
};
export default AutoCompleteOnline;
