import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  makeStyles,
  SvgIcon,
  Select,
  MenuItem,
  Button,
  withStyles,
  FormHelperText,
  FormControl
  
} from '@material-ui/core';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import MomentUtils from '@date-io/moment';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress';
// import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { reportTocDocuaXe,licensePlate,groupID } from '../../../../features/reportBgtQC31Slice';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#F5FAFF',
    color: '#0C1132',
    border: '1px solid #E5E5E8',
     
    // fontSize: '14px',
    // fontStyle: 'normal',
    // fontWeight: 'normal'
  },
  body: {
    fontSize: '14px',
    // fontStyle: 'normal',
    // fontWeight: 'normal',
    border: '1px solid #E5E5E8',
    color: '#0C1132',
     
  }
   }))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'white'
    },
     
  }
}))(TableRow);



const TocDoCuaXeControlView = () => {
  //useEffect
  useEffect(() => {
    dispatch(licensePlate({}));
    dispatch(groupID({}));
}, []);

  const classes = useStyles();
  const dispatch = useDispatch();
  const dataReportTocDocuaXe = useSelector(state => state.reportSlice.dataReportTocDocuaXe);
  const dataLicensePlate = useSelector(state => state.reportSlice.dataLicensePlate);
  const dataGroupID = useSelector(state => state.reportSlice.dataGroupID);
  const isLoading = useSelector(state => state.reportSlice.isLoading);

  const [countNext, setCountNext] = useState(0);
  const [isErrorBienSo, setErrorBienSo] = useState(false);
  

  const [searchObject, setSearchObject] = useState({
    licensePlate: '',
    groupID: '', 
    firstTime: moment().set({ 
      hour:0,
      minute:0,
      second:0,
      millisecond:0
    }),

    lastTime: moment().set({ 
      hour:23,
      minute:59,
      second:0,
      millisecond:0
    }),
    previousId: '',
    pageSize: 30,
    action: ''
  });

  useEffect(() => {
    const currentPage_local = JSON.parse(localStorage.getItem('page-current'))
    const searchObject_local = JSON.parse(localStorage.getItem('searchObject'))
    const firstTime_local = searchObject_local?.firstTime
    const lastTime_local = searchObject_local?.lastTime_local
    if(!!searchObject_local && searchObject_local !== '' && currentPage_local !== null){
      setSearchObject(searchObject_local)
      setCountNext(currentPage_local);
      searchObject_local.firstTime = searchObject_local.firstTime ? moment(searchObject_local.firstTime).unix() : null;
      searchObject_local.lastTime = searchObject_local.lastTime ? moment(searchObject_local.lastTime).unix() : null;
      dispatch(reportTocDocuaXe(searchObject_local));
      searchObject_local.firstTime = firstTime_local;
      searchObject_local.lastTime = lastTime_local;
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('searchObject');
      localStorage.removeItem('page-current');
    }
  }, []);

  const changeSearchCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
      if(name='licensePlate'){
            setErrorBienSo(false);
      }

    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject',JSON.stringify(currentSearchObject))
  };


  const changeDateCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject',JSON.stringify(currentSearchObject))
  };

  const searchFunction = () => {
    let currentSearchObject = {...searchObject};

    if(currentSearchObject.licensePlate && !currentSearchObject.licensePlate==''){
    setCountNext(0);
    localStorage.setItem('page-current',countNext);
    localStorage.setItem('searchObject',JSON.stringify(currentSearchObject))
    currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
    dispatch(reportTocDocuaXe(currentSearchObject));
    }else{
      setErrorBienSo(true);
    }
   
  };

  const nextPage = () => {

    let valcountNext = countNext;
    valcountNext = valcountNext +1;
    console.log("next"+valcountNext);
    setCountNext(valcountNext);

    localStorage.setItem('page-current',valcountNext);
    
    let currentSearchObject = {...searchObject};
    if (dataReportTocDocuaXe && dataReportTocDocuaXe.data && dataReportTocDocuaXe.data.length > 0) {
      currentSearchObject.previousId = dataReportTocDocuaXe.data[dataReportTocDocuaXe.data.length - 1]._id;
      localStorage.setItem('searchObject',JSON.stringify(currentSearchObject))
    }
  
     currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
     currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
     currentSearchObject.action ='next';
     dispatch(reportTocDocuaXe(currentSearchObject));
  };


  const backPage = () => {

    if(countNext>=1){
      let valcountNext = countNext;
      valcountNext = valcountNext-1;
      console.log("backPage"+valcountNext);
      setCountNext(valcountNext);
      localStorage.setItem('page-current',valcountNext);
    }


    let currentSearchObject = {...searchObject};
    if (dataReportTocDocuaXe && dataReportTocDocuaXe.data && dataReportTocDocuaXe.data.length > 0) {
      currentSearchObject.previousId = dataReportTocDocuaXe.data[0]._id;
      localStorage.setItem('searchObject',JSON.stringify(currentSearchObject))
    }

     currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
     currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
     currentSearchObject.action ='back';
     dispatch(reportTocDocuaXe(currentSearchObject));

  };


  const downloadFile = () => {
    let currentSearchObject = { ...searchObject };

    var urlBase= `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/speed/excel?`;

    if(currentSearchObject.firstTime){
      urlBase = urlBase + 'firstTime='+moment(currentSearchObject.firstTime).unix();
    }
    
    if(currentSearchObject.lastTime){
      urlBase = urlBase + '&lastTime='+moment(currentSearchObject.lastTime).unix();
    }


    if(currentSearchObject.licensePlate){
      urlBase = urlBase + '&licensePlate='+currentSearchObject.licensePlate;
    }

     console.log("Kien:"+urlBase);

    window.open(urlBase, '_blank')
  };

  return (
    <Box className={classes.contentContainer}>
      <div className={classes.titleHeader}>TỐC ĐỘ CỦA XE</div>
      <div className={classes.searchContainer}>

        <div className={classes.searchRow}>

          <div className={classes.searchItem}>
            <div className={classes.label}>Từ ngày</div>
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
        
                <KeyboardDateTimePicker
                  variant="inline"
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  onChange={e => changeDateCondition('firstTime', e)}
                  value={searchObject.firstTime}
                  classes={{
                    root: classes.dateComponent
                  }}
                  InputProps={{
                    className: classes.dateComponent
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>

          <div className={classes.searchItem}>
            <div className={classes.label}>Đến ngày</div>
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
         
                <KeyboardDateTimePicker
                  variant="inline"
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={searchObject.lastTime}
                  onChange={e => changeDateCondition('lastTime', e)}
                  classes={{
                    root: classes.dateComponent
                  }}
                  InputProps={{
                    className: classes.dateComponent
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>

          <div className={classes.btnSearch}>
          <Button
            type="button"
            variant="contained"
            className={classes.btnStyle}
            onClick={() => searchFunction()}
          >
            Tìm kiếm
          </Button>
        </div>

        </div>
        <div className={classes.searchRow}>
          <div className={classes.searchItem}>
            <div className={classes.label}>Nhóm</div>
            <div>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="outlined"
                className={classes.searchComponent}
                value={searchObject.groupID}
                onChange={e => changeSearchCondition('groupID', e.target.value) }
              >
                <MenuItem value={''}></MenuItem>

                {dataGroupID &&
                dataGroupID.length > 0 &&
                dataGroupID.map((row, index) => {
                  return (
                    <MenuItem value={row.id}>{row.name}</MenuItem>
                  );
                })}

              </Select>
            </div>
          </div>
          <div className={classes.searchItem}>
            <div className={classes.label}>Biển số</div>
            <div>
            <FormControl className={classes.formControl} error={isErrorBienSo}>
              <Select
                labelId="demo-simple-select-label"
                id="selectBienso"
                variant="outlined"
                className={classes.searchComponent}
                value={searchObject.licensePlate}
                onChange={e =>
                  changeSearchCondition('licensePlate', e.target.value)
                }
              >
              {dataLicensePlate &&
              dataLicensePlate.length > 0 &&
              dataLicensePlate.map((row, index) => {
                return (
                  <MenuItem value={row.license_plate}>{row.license_plate}</MenuItem>
                );
              })}
              </Select>
              </FormControl>
            </div>
          </div>
        </div>
       

      </div>

      <div className={classes.actionHead}>
      <img
          alt="print image"
          className={classes.image}
          src="/static/images/print.svg"
        />

        <img
          alt="Excell image"
          className={classes.image}
          src="/static/images/Excel.svg"
          onClick={() => downloadFile()}
        />
      </div>


      <div className={classes.dataTable}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            // size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>TT</StyledTableCell>
                <StyledTableCell align="left">Thời điểm (giờ, phút, giây, ngày, tháng, năm)</StyledTableCell>
                <StyledTableCell align="left">Các tốc độ (km/h)</StyledTableCell>
                <StyledTableCell align="left">Ghi chú</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {dataReportTocDocuaXe &&
              dataReportTocDocuaXe.data &&
              dataReportTocDocuaXe.data.length > 0 &&
              dataReportTocDocuaXe.data.map((row, index) => {
                return (
                  <StyledTableRow
                    hover
                    // onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    // selected={isItemSelected}
                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                    
                      {row.time
                        ? moment.unix(row.time).format('HH:mm:ss DD/MM/YYYY')
                        : ''}
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.data['261'].map((item , index,array)  => {
                         if (array.length - 1 === index) {
                          return `${item}`;
                        }else{
                          return `${item} , `;
                        }
                      
                            })}
                    </StyledTableCell>

                    <StyledTableCell>{row.note}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {!dataReportTocDocuaXe || !dataReportTocDocuaXe.data || dataReportTocDocuaXe.data.length < 1 ?
          <div className={classes.bottomTableError}>
          Không có dữ liệu
          </div> :
            null
          }
    
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

        <div className={classes.pagination}>

          {dataReportTocDocuaXe && dataReportTocDocuaXe.data && dataReportTocDocuaXe.data.length >= searchObject.pageSize && countNext >=1 ?
          <Button type="button"
              variant="contained"
              className={classes.btnStyle}
              onClick={() => backPage()}>Back</Button> :
            null
          }

        {dataReportTocDocuaXe && dataReportTocDocuaXe.data && dataReportTocDocuaXe.data.length >= searchObject.pageSize ?
              <Button type="button"
              variant="contained"
              className={classes.btnStyle}
              onClick={() => nextPage()}>Next</Button> :
              null
            }

        </div>
      
      </div>
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    backgroundColor: 'white',
    flexDirection: 'column',
     
  },
  titleHeader: {
    width: '100%',
    height: '36px',
    color: '#0C1132',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '16px',
    fontSize: "20px",
     
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '24px',
    // marginTop: '24px',
    // marginBottom: '24px'
     
  },
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '12px',
    // justifyContent: 'space-between',
    marginRight: '48px',
     
  },
  searchItem: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '122px',
     
  },
  label: {
    marginRight: '20px',
    marginBottom:'4px',
    fontSize : '14px',
    color : '#858C93',
     
  },
  searchComponent: {
    // marginRight: '6px',
    width: '300px',
    height: '30px',
    '& .MuiOutlinedInput-root': {
      height: '30px',
    },
     
  },
  timeComponent: {
    marginRight: '4px',
    '& .MuiOutlinedInput-root': {
      height: '30px',
      width: '80px',
    },
     
  },
  dateComponent: {
    // marginRight: '4px',
    '& .MuiOutlinedInput-root': {
      height: '30px',
      width: '300px',
    },
     
  },
  btnSearch: {
    width: '180px',
    height:'40px',
    marginLeft: 'auto',
     
  },
  btnDownload:{
    width: '100px',
    marginLeft: 'auto',
     
  },
  dataTable: {
    width: '100%',
    marginLeft: '20px',
    marginBottom: '30px',
     
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
     
  },
  wrapMenu: {
    marginTop: '30px',
    marginRight: '100px',
    marginLeft: '30px',
     
  },
  title: {
    color: '#3f51b5',
    cursor: 'pointer',
     
  },
  menuItem: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
     
  },
  item: {
    paddingTop: '30px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '500',

    '&:hover': {
      color: '#3f51b5',
      borderBottom: '1px solid #3f51b5',
      width: 'max-content'
    },
     
  },
  table: {
    minWidth: 700
  },
  btnStyle :{
    padding: '10px',
    color: 'white',
    backgroundColor: '#AE0000',
    marginTop: '20px',
    marginRight: '10px',
    width : '180px',
    height: '40px',
     
  },

  btnDownloadStyle :{
    padding: '5px',
    color: 'white',
    backgroundColor: 'blue',
    marginTop: '10px',
     
  },
  pagination: {
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '64px',
     
  },
  actionHead: {
    width: '100%',
    height: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '30px',
    backgroundColor: 'white',
    marginBottom: '5px',
     
  },
  bottomTableError: {
    width: '100%',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    marginTop:'10px',
     
  },
  image: {
    marginRight:'10px'
  }


}));

export default TocDoCuaXeControlView;
