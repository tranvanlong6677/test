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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
import {
  thoiGianLaiXeLientuc,
  licensePlate,
  resetDataSceen
} from '../../../../features/reportBgtQC31Slice';
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
    border: '1px solid black'
  },
  '.&td': {
    border: '1px solid black'
  },
   
}))(TableRow);

const ThoiGianLaiXeLienTucControlView = () => {
  

  const classes = useStyles();
  const dispatch = useDispatch();
  
  const dataThoiGianLaiXeLientuc = useSelector(
    state => state.reportSlice.dataThoiGianLaiXeLientuc
  );
  const dataLicensePlate = useSelector(
    state => state.reportSlice.dataLicensePlate
  );

  const isLoading = useSelector(state => state.reportSlice.isLoading);

  const [nowPage, setNowPage] = useState({
    page: 1
  });

  const [pages, setPages] = useState(0);

  const [searchObject, setSearchObject] = useState({
    type: 'all',
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
    pageSize: 30,
    time: 'All',
  });


  //useEffect
  useEffect(() => {
    dispatch(resetDataSceen());
    dispatch(licensePlate({}));
  }, []);


  useEffect(() => {
    const currentPage_local = JSON.parse(localStorage.getItem('pageCurrent-tglx'))
    const searchObject_local = JSON.parse(localStorage.getItem('searchObject-tglx'))
    const firstTime_local = searchObject_local?.firstTime
    const lastTime_local = searchObject_local?.lastTime
    if(!!searchObject_local && searchObject_local !== '' && currentPage_local?.page){
      
      searchObject_local.firstTime = searchObject_local.firstTime ? moment(searchObject_local.firstTime).unix() : null;
      searchObject_local.lastTime = searchObject_local.lastTime ? moment(searchObject_local.lastTime).unix() : null;

      setNowPage(currentPage_local)
      setSearchObject(searchObject_local)
     
      dispatch(thoiGianLaiXeLientuc(searchObject_local));
      searchObject_local.firstTime = firstTime_local;
      searchObject_local.lastTime = lastTime_local;
    }

  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('searchObject-tglx');
      localStorage.removeItem('pageCurrent-tglx');
    }
  }, []);

  useEffect(() => {
    console.log("check");
    if(dataThoiGianLaiXeLientuc && dataThoiGianLaiXeLientuc.total >0 && nowPage.page==1){
      
    let currentSearchObject = {...searchObject};  
    var total = dataThoiGianLaiXeLientuc.total;
  
    var phanduong = Math.floor(total/currentSearchObject.pageSize);
    var phandu =  total%currentSearchObject.pageSize;
    var newPages;
  
    if(phandu>0){
      newPages = phanduong+1;
    }else{
      newPages = phanduong;
    }
  
    setPages(newPages);
   
    console.log("nap data");
  
    }else if(nowPage.page==1){
       setPages(0);
    }
    
  }, [dataThoiGianLaiXeLientuc]);


  const changeSearchCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-tglx',JSON.stringify(currentSearchObject))
  };

  const changeDateCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-tglx',JSON.stringify(currentSearchObject))
  };

  const searchFunction = () => {
    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = 1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-tglx',JSON.stringify(currentNowpage));
    localStorage.setItem('searchObject-tglx',JSON.stringify(currentSearchObject))
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(thoiGianLaiXeLientuc(currentSearchObject));
  };

  const nextPage = () => {
    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = currentNowpage.page + 1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-tglx',JSON.stringify(currentNowpage));
    currentSearchObject.page = currentNowpage.page;
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(thoiGianLaiXeLientuc(currentSearchObject));
  };


  const handleChange = (e, value) => {

    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = value;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-tglx',JSON.stringify(currentNowpage));
    currentSearchObject.page = currentNowpage.page;
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(thoiGianLaiXeLientuc(currentSearchObject));
  }

  const downloadFile = () => {
    let currentSearchObject = { ...searchObject };

    var urlBase= `${process.env.REACT_APP_REPORT_URL}/api/v1/report/agency/${localStorage.getItem('agency-id')}/drivetime/excel?`;

    if(currentSearchObject.firstTime){
      urlBase = urlBase + 'firstTime='+moment(currentSearchObject.firstTime).unix();
    }
    
    if(currentSearchObject.lastTime){
      urlBase = urlBase + '&lastTime='+moment(currentSearchObject.lastTime).unix();
    }


    if(currentSearchObject.type){
      urlBase = urlBase + '&type='+currentSearchObject.type;
    }

     console.log("Kien:"+urlBase);

    window.open(urlBase, '_blank')
  }

  return (
    <Box className={classes.contentContainer}>
      <div className={classes.titleHeader}>THỜI GIAN LÁI XE LIÊN TỤC</div>
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
            <div className={classes.label}>Thời gian</div>
            <div>
            <RadioGroup className={classes.searchTime} aria-label="time" name="type" value={searchObject.type} onChange={(e) => changeSearchCondition('type', e.target.value)}>
              <FormControlLabel value="all" control={<Radio />} label="Tất cả" />
              <FormControlLabel value="4h" control={<Radio />} label="Thời gian liên tục >= 4 giờ" />
            </RadioGroup>
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
                <StyledTableCell rowSpan="2">TT</StyledTableCell>
                <StyledTableCell rowSpan="2">Biển số xe</StyledTableCell>
                <StyledTableCell rowSpan="2">Họ tên lái xe</StyledTableCell>
                <StyledTableCell rowSpan="2">Số Giấy phép lái xe</StyledTableCell>
                <StyledTableCell rowSpan="2">
                  Loại hình hoạt động
                </StyledTableCell>
                <StyledTableCell colSpan="3" style={{ textAlign: 'center' }}>
                  Thời điểm bắt đầu
                </StyledTableCell>
                <StyledTableCell colSpan="3" style={{ textAlign: 'center' }}>
                  Thời điểm kết thúc
                </StyledTableCell>
                <StyledTableCell rowSpan="2">
                  Thời gian lái xe (phút)
                </StyledTableCell>
                <StyledTableCell rowSpan="2">Ghi chú</StyledTableCell>
              </TableRow>
              <TableRow>
                {/* <StyledTableCell>TT</StyledTableCell>
                <StyledTableCell align="left">Biển kiểm soát</StyledTableCell>
                <StyledTableCell align="left">Tên lái xe</StyledTableCell>
                <StyledTableCell align="left">Giấy phép lái xe</StyledTableCell>
                <StyledTableCell align="left">
                  Loại hình hoạt động
                </StyledTableCell> */}

                <StyledTableCell align="left">Thời điểm (giờ, phút, giây, ngày, tháng, năm)</StyledTableCell>
                <StyledTableCell align="left">Tọa độ</StyledTableCell>
                <StyledTableCell align="left">Địa điểm</StyledTableCell>

                <StyledTableCell align="left">Thời điểm (giờ, phút, giây, ngày, tháng, năm)</StyledTableCell>
                <StyledTableCell align="left">Tọa độ</StyledTableCell>
                <StyledTableCell align="left">Địa điểm</StyledTableCell>

                {/* <StyledTableCell align="left">
                  Thời gian lái xe (phút)
                </StyledTableCell>
                <StyledTableCell align="left">Ghi chú</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataThoiGianLaiXeLientuc &&
                dataThoiGianLaiXeLientuc.data &&
                dataThoiGianLaiXeLientuc.data.length > 0 &&
                dataThoiGianLaiXeLientuc.data.map((row, index) => {
                  return (
                    <StyledTableRow
                      hover
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
                        {row.startAt
                          ? moment
                              .unix(row.startAt)
                              .format('HH:mm:ss DD/MM/YYYY')
                          : ''}
                      </StyledTableCell>
                      <StyledTableCell>{row.startCoord}</StyledTableCell>
                      <StyledTableCell>{row.startAddr}</StyledTableCell>

                      <StyledTableCell>
                        {row.endAt
                          ? moment.unix(row.endAt).format('HH:mm:ss DD/MM/YYYY')
                          : ''}
                      </StyledTableCell>
                      <StyledTableCell>{row.endCoord[0]} , {row.endCoord[1]}</StyledTableCell>
                      <StyledTableCell>{row.endAddr}</StyledTableCell>
                      <StyledTableCell>{row.driveDuration}</StyledTableCell>
                      <StyledTableCell>{row.note}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

          



   {!dataThoiGianLaiXeLientuc || !dataThoiGianLaiXeLientuc.data || dataThoiGianLaiXeLientuc.data.length < 1 ?
          <div className={classes.bottomTableError}>
          Không có dữ liệu
          </div> :
            null
          }

      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

        <Pagination onChange={handleChange} className={classes.pagination} count={pages} page={nowPage.page} variant="outlined" shape="rounded" /> 
        {/* <div className={classes.pagination}>
          <Button
            type="button"
            variant="contained"
            className={classes.btnStyle}
            onClick={() => nextPage()}
          >
            Tiếp theo
          </Button>
        </div> */}
      
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
 //   justifyContent: 'space-between',
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
    width: '300px',
    height: '30px',
    '& .MuiOutlinedInput-root': {
      height: '30px'
    },
     
  },
  timeComponent: {
    marginRight: '4px',
    '& .MuiOutlinedInput-root': {
      height: '30px',
      width: '80px'
    },
     
  },
  dateComponent: {
    // marginRight: '4px',
    '& .MuiOutlinedInput-root': {
      height: '30px',
      width: '300px'
    },
     
  },
  btnSearch: {
    width: '180px',
    height:'40px',
    marginLeft: 'auto',
     
  },
  btnDownload: {
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
  btnStyle: {
    padding: '10px',
    color: 'white',
    backgroundColor: '#AE0000',
    marginTop: '20px',
    width : '180px',
    height: '40px',
     
  },

  btnDownloadStyle: {
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
  searchTime: {
    display: 'flex',
    flexDirection: 'row',
     
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

export default ThoiGianLaiXeLienTucControlView;
