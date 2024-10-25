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
  withStyles
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
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
  KeyboardDateTimePicker
} from '@material-ui/pickers';

import Pagination from '@material-ui/lab/Pagination';
import { BaoCaoDungDo,licensePlate,groupID,resetDataSceen } from '../../../../features/reportBgtQC31Slice';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress';

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

const BaoCaoDungDoControlView = () => {
 

  const classes = useStyles();
  const dispatch = useDispatch();
  const dataBaoCaoDungDo = useSelector(state => state.reportSlice.dataBaoCaoDungDo);

  const dataLicensePlate = useSelector(state => state.reportSlice.dataLicensePlate);
  const dataGroupID = useSelector(state => state.reportSlice.dataGroupID);

  const isLoading = useSelector(state => state.reportSlice.isLoading);

  
  const [nowPage, setNowPage] = useState({
    page: 1
  });

  const [pages, setPages] = useState(0);

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
    page: 1,
    pageSize: 30
  });


 //useEffect
 useEffect(() => {
  dispatch(resetDataSceen());
  dispatch(licensePlate({}));
  dispatch(groupID({}));

  }, []);


  useEffect(() => {
    const currentPage_local = JSON.parse(localStorage.getItem('pageCurrent-dd'))
    const searchObject_local = JSON.parse(localStorage.getItem('searchObject-dd'))
    const firstTime_local = searchObject_local?.firstTime
    const lastTime_local = searchObject_local?.lastTime
    if(!!searchObject_local && searchObject_local !== '' && currentPage_local?.page){
      
      searchObject_local.firstTime = searchObject_local.firstTime ? moment(searchObject_local.firstTime).unix() : null;
      searchObject_local.lastTime = searchObject_local.lastTime ? moment(searchObject_local.lastTime).unix() : null;

      setNowPage(currentPage_local)
      setSearchObject(searchObject_local)
     
      dispatch(BaoCaoDungDo(searchObject_local));
      searchObject_local.firstTime = firstTime_local;
      searchObject_local.lastTime = lastTime_local;
    }

  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('searchObject-dd');
      localStorage.removeItem('pageCurrent-dd');
    }
  }, []);


  useEffect(() => {
    console.log("check");
    if(dataBaoCaoDungDo && dataBaoCaoDungDo.total >0 && nowPage.page==1){
      
    let currentSearchObject = {...searchObject};  
    var total = dataBaoCaoDungDo.total;
  
    var phanduong = Math.floor(total/currentSearchObject.pageSize);
    var phandu =  total%currentSearchObject.pageSize;
    var newPages;
  
    if(phandu>0){
      newPages = phanduong+1;
    }else{
      newPages = phanduong;
    }
  
    setPages(newPages);
     
    }else if(nowPage.page==1){
       setPages(0);
    }
    
  }, [dataBaoCaoDungDo]);



  const changeSearchCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-dd',JSON.stringify(currentSearchObject))
  };


  const changeDateCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-dd',JSON.stringify(currentSearchObject))
  };

  const searchFunction = () => {
    let currentSearchObject = {...searchObject};
    let currentNowpage = {...nowPage};
    currentNowpage.page = 1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-dd',JSON.stringify(currentNowpage));
    localStorage.setItem('searchObject-dd',JSON.stringify(currentSearchObject))
    console.log('check')
    currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
    dispatch(BaoCaoDungDo(currentSearchObject));
   
  };

  const nextPage = () => {
    let currentSearchObject = {...searchObject};
    let currentNowpage = {...nowPage};
    currentNowpage.page = currentNowpage.page +1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-dd',JSON.stringify(currentNowpage));
     currentSearchObject.page=currentNowpage.page;
     currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
     currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
     dispatch(BaoCaoDungDo(currentSearchObject));
  };


  const handleChange = (e, value) => {

    let currentSearchObject = {...searchObject};
    let currentNowpage = {...nowPage};
    currentNowpage.page = value;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-dd',JSON.stringify(currentNowpage));
     currentSearchObject.page=currentNowpage.page;
     currentSearchObject.firstTime = currentSearchObject.firstTime ? moment(currentSearchObject.firstTime).unix() : null;
     currentSearchObject.lastTime = currentSearchObject.lastTime ? moment(currentSearchObject.lastTime).unix() : null;
     dispatch(BaoCaoDungDo(currentSearchObject));

  }

  
  const downloadFile = () => {
    let currentSearchObject = { ...searchObject };

    var urlBase= `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/stop/excel?`;

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
      <div className={classes.titleHeader}>BÁO CÁO DỪNG ĐỖ</div>
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
                onChange={e =>
                  changeSearchCondition('groupID', e.target.value)
                }

              >
                <MenuItem value={''}></MenuItem>

                {/* onChange={e =>
                  changeSearchCondition('dataGroupID', e.target.value)
                } */}

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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="outlined"
                className={classes.searchComponent}
                value={searchObject.licensePlate}
                onChange={e =>
                  changeSearchCondition('licensePlate', e.target.value)
                }
              >

                <MenuItem value={''}></MenuItem>
                {dataLicensePlate &&
              dataLicensePlate.length > 0 &&
              dataLicensePlate.map((row, index) => {
                return (
                  <MenuItem value={row.license_plate}>{row.license_plate}</MenuItem>
                );
              })}
              </Select>
            </div>
          </div>
        </div>
       

      </div>

      <div className={classes.actionHead}>
      <img
          alt="print image"
          className={classes.image}
          src="/static/images/print.svg"
          // onClick={() => downloadFile()}
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
                <StyledTableCell align="left">Biển số xe</StyledTableCell>
                <StyledTableCell align="left">Họ tên lái xe</StyledTableCell>
                <StyledTableCell align="left">Số Giấy phép lái xe</StyledTableCell>

                <StyledTableCell align="left">Loại hình hoạt động</StyledTableCell>
                <StyledTableCell align="left">Thời điểm dừng đỗ (giờ, phút, giây, ngày, tháng, năm)</StyledTableCell>

                <StyledTableCell align="left">Thời gian dừng đỗ (phút)</StyledTableCell>
                <StyledTableCell align="left">Tọa độ dừng đỗ</StyledTableCell>
                <StyledTableCell align="left">Địa điểm dừng đỗ</StyledTableCell>

                <StyledTableCell align="left">Ghi chú</StyledTableCell>
            


              </TableRow>
            </TableHead>
            <TableBody>
            {dataBaoCaoDungDo &&
              dataBaoCaoDungDo.data &&
              dataBaoCaoDungDo.data.length > 0 &&
              dataBaoCaoDungDo.data.map((row, index) => {
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

                    <StyledTableCell>{row.licensePlate}</StyledTableCell>
                    <StyledTableCell>{row.driverName}</StyledTableCell>
                    <StyledTableCell>{row.licenseNumber}</StyledTableCell>
                    <StyledTableCell>{row.business}</StyledTableCell>
                  
                    <StyledTableCell>
                    
                      {row.stopAt
                        ? moment.unix(row.stopAt).format('HH:mm:ss DD/MM/YYYY')
                        : ''}
                    </StyledTableCell>

                    <StyledTableCell>{row.stopDuration}</StyledTableCell>
                    <StyledTableCell>{row.startCoord[0]} , {row.startCoord[1]}</StyledTableCell>
                    <StyledTableCell>{row.addr}</StyledTableCell>
                    <StyledTableCell>{row.note}</StyledTableCell>
                  </StyledTableRow>
                );
              })}

            </TableBody>
          </Table>

          {(dataBaoCaoDungDo &&
              dataBaoCaoDungDo.data &&
              dataBaoCaoDungDo.data.length > 0) ?

          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            // size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
              
                <StyledTableCell align="left" style={{ textAlign: 'center',width: '50%',backgroundColor: 'white' }}>Tổng</StyledTableCell>
                <StyledTableCell align="left" style={{ textAlign: 'center',width: '50%',backgroundColor: 'white' }}></StyledTableCell>
                {/* //<StyledTableCell align="left"> </StyledTableCell> */}

              </TableRow>
            </TableHead>
           
          </Table>
            :
                null
              }

        </TableContainer>

        {!dataBaoCaoDungDo || !dataBaoCaoDungDo.data || dataBaoCaoDungDo.data.length < 1 ?
          <div className={classes.bottomTableError}>
          Không có dữ liệu
          </div> :
            null
          }

<Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
       

        <Pagination onChange={handleChange} className={classes.pagination} count={pages} page={nowPage.page} variant="outlined" shape="rounded" /> 
       
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
      width: '300px',
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
    marginTop: '10px',
     
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

export default BaoCaoDungDoControlView;
