import React, { useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
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
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Pagination from '@material-ui/lab/Pagination';
import {
  BaoCaoTongHopTheoLaiXe,
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
     
  }
}))(TableRow);

const BaoCaoTongHopTheoLaiXeControlView = () => {
  //useEffect


  const classes = useStyles();
  const dispatch = useDispatch();
  const dataBaoCaoTongHopTheoLaiXe = useSelector(
    state => state.reportSlice.dataBaoCaoTongHopTheoLaiXe
  );

  const isLoading = useSelector(state => state.reportSlice.isLoading);

  const [nowPage, setNowPage] = useState({
    page: 1
  });
  const [pages, setPages] = useState(10);

  const [searchObject, setSearchObject] = useState({
    driverLicense: '',
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



  useEffect(() => {
    dispatch(resetDataSceen());
    dispatch(licensePlate({}));
  }, []);


  useEffect(() => {
    const currentPage_local = JSON.parse(localStorage.getItem('pageCurrent-thlx'))
    const searchObject_local = JSON.parse(localStorage.getItem('searchObject-thlx'))

    const firstTime_local = searchObject_local?.firstTime
    const lastTime_local = searchObject_local?.lastTime
    if(!!searchObject_local && searchObject_local !== '' && currentPage_local?.page){
      
      searchObject_local.firstTime = searchObject_local.firstTime ? moment(searchObject_local.firstTime).unix() : null;
      searchObject_local.lastTime = searchObject_local.lastTime ? moment(searchObject_local.lastTime).unix() : null;

      setNowPage(currentPage_local)
      setSearchObject(searchObject_local)
     
      dispatch(BaoCaoTongHopTheoLaiXe(searchObject_local));
      searchObject_local.firstTime = firstTime_local;
      searchObject_local.lastTime = lastTime_local;
    }

  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('searchObject-thlx');
      localStorage.removeItem('pageCurrent-thlx');
    }
  }, []);

  useEffect(() => {
      if(dataBaoCaoTongHopTheoLaiXe && dataBaoCaoTongHopTheoLaiXe.total >1 && nowPage.page==1){
        
      let currentSearchObject = {...searchObject};  
      var total = dataBaoCaoTongHopTheoLaiXe.total;

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
    
  }, [dataBaoCaoTongHopTheoLaiXe]);

  const changeSearchCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-thlx',JSON.stringify(currentSearchObject))
  };

  const changeDateCondition = (name, value) => {
    let currentSearchObject = { ...searchObject };
    currentSearchObject[name] = value;
    setSearchObject(currentSearchObject);
    localStorage.setItem('searchObject-thlx',JSON.stringify(currentSearchObject))
  };

  const searchFunction = () => {
    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = 1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-thlx',JSON.stringify(currentNowpage));
    localStorage.setItem('searchObject-thlx',JSON.stringify(currentSearchObject))
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(BaoCaoTongHopTheoLaiXe(currentSearchObject));
  };

  const nextPage = () => {
    //console.log("kien check",dataBaoCaoTongHopTheoXe);
    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = currentNowpage.page + 1;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-thlx',JSON.stringify(currentNowpage));
    currentSearchObject.page = currentNowpage.page;
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(BaoCaoTongHopTheoLaiXe(currentSearchObject));
  };

  const downloadFile = () => {
    let currentSearchObject = { ...searchObject };

    var urlBase = `${
      process.env.REACT_APP_REPORT_URL
    }/api/v1/report/agency/${localStorage.getItem(
      'agency-id'
    )}/general/driver/excel?`;

    if (currentSearchObject.firstTime) {
      urlBase =
        urlBase + 'firstTime=' + moment(currentSearchObject.firstTime).unix();
    }

    if (currentSearchObject.lastTime) {
      urlBase =
        urlBase + '&lastTime=' + moment(currentSearchObject.lastTime).unix();
    }

    if (currentSearchObject.driverLicense) {
      urlBase =
        urlBase +
        '&driverLicense=' +
        moment(currentSearchObject.lastTime).unix();
    }

    // console.log("Kien:"+urlBase);

    window.open(urlBase, '_blank');
  };

  const handleChange = (e, value) => {
    //console.log("kien check",dataBaoCaoTongHopTheoXe);
    let currentSearchObject = { ...searchObject };
    let currentNowpage = { ...nowPage };
    currentNowpage.page = value;
    setNowPage(currentNowpage);
    localStorage.setItem('pageCurrent-thlx',JSON.stringify(currentNowpage));
    currentSearchObject.page = currentNowpage.page;
    currentSearchObject.firstTime = currentSearchObject.firstTime
      ? moment(currentSearchObject.firstTime).unix()
      : null;
    currentSearchObject.lastTime = currentSearchObject.lastTime
      ? moment(currentSearchObject.lastTime).unix()
      : null;
    dispatch(BaoCaoTongHopTheoLaiXe(currentSearchObject));
  }

  return (
    <Box className={classes.contentContainer}>
      <div className={classes.titleHeader}>BÁO CÁO TỔNG HỢP THEO LÁI XE</div>
      <div className={classes.searchContainer}>
        <div className={classes.searchRow}>
          <div className={classes.searchItem}>
            <div className={classes.label}>Từ ngày</div>
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                <KeyboardDateTimePicker
                  variant="inline"
                  inputVariant="outlined"
                  format="HH:mm DD/MM/YYYY"
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
                  format="HH:mm DD/MM/YYYY"
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
                <StyledTableCell rowSpan={2}>TT</StyledTableCell>

                <StyledTableCell align="left" rowSpan={2}>
                  Họ tên lái xe
                </StyledTableCell>
                <StyledTableCell align="left" rowSpan={2}>
                  Số Giấy phép lái xe
                </StyledTableCell>
                <StyledTableCell align="left" rowSpan={2}>
                  Tổng Km
                </StyledTableCell>

                <StyledTableCell
                  align="left"
                  style={{ textAlign: 'center' }}
                  colSpan={4}
                >
                  Tỷ lệ quá hạn tổng tốc độ giới km (%)
                </StyledTableCell>

                <StyledTableCell
                  align="left"
                  style={{ textAlign: 'center' }}
                  colSpan={4}
                >
                  Tổng số lần quá tốc độ giới hạn (lần)
                </StyledTableCell>

                <StyledTableCell align="left" rowSpan={2}>
                  Tổng số lần lái xe liên tục quá 04 giờ
                </StyledTableCell>
                <StyledTableCell align="left" rowSpan={2}>
                  Ghi chú
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="left">
                  Tỷ lệ quá tốc độ từ 5 km/h đến dưới 10 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Tỷ lệ quá tốc độ từ 10 km/h đến dưới 20 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Tỷ lệ quá tốc độ từ 20 km/h đến 35 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Tỷ lệ quá tốc độ trên 35 km/h
                </StyledTableCell>

                <StyledTableCell align="left">
                  Số lần quá tốc độ từ 5 km/h đến dưới 10 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Số lần quá tốc độ từ 10 km/h đến dưới 20 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Số lần quá tốc độ từ 20 km/h đến 35 km/h
                </StyledTableCell>
                <StyledTableCell align="left">
                  Số lần quá tốc độ trên 35 km/h
                </StyledTableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {dataBaoCaoTongHopTheoLaiXe &&
                dataBaoCaoTongHopTheoLaiXe.data &&
                dataBaoCaoTongHopTheoLaiXe.data.length > 0 &&
                dataBaoCaoTongHopTheoLaiXe.data.map((row, index) => {
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

                      <StyledTableCell>{row.driverName}</StyledTableCell>
                      <StyledTableCell>{row.driverLicense}</StyledTableCell>
                      <StyledTableCell>{row.totalDistance}</StyledTableCell>

                      <StyledTableCell>
                        {row.ratioOverspeedType1}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.ratioOverspeedType2}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.ratioOverspeedType3}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.ratioOverspeedType4}
                      </StyledTableCell>

                      <StyledTableCell>
                        {row.countOverspeedType1}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.countOverspeedType2}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.countOverspeedType3}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.countOverspeedType4}
                      </StyledTableCell>

                      <StyledTableCell>{row.driveOver4h}</StyledTableCell>
                      <StyledTableCell>{row.note}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>

          </Table>
        </TableContainer>


        {!dataBaoCaoTongHopTheoLaiXe || !dataBaoCaoTongHopTheoLaiXe.data || dataBaoCaoTongHopTheoLaiXe.data.length < 1 ?
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
    marginTop: '16px',
    fontSize: "20px",
     
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '24px',
    // marginTop: '16px',
    // marginBottom: '16px'
     
  },
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '12px',
    marginRight: '48px',
     
  },
  searchItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '352px',
    marginRight: '122px',
     
  },
  label: {
    marginRight: '20px',
    color: '#858C93',
    marginBottom: '8px',
    marginLeft: '4px',
    fontSize: '14px',
     
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
      width: '300px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #E5E5E8',
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
    minWidth: 700,
  },
  btnStyle: {
    padding: '10px',
    color: 'white',
    backgroundColor: '#AE0000',
    marginTop: '20px',
    width: '180px',
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
  actionHead: {
    width: '100%',
    height: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '30px',
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

export default BaoCaoTongHopTheoLaiXeControlView;
