import React, { useEffect, useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import Page from 'src/app/components/Page';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetImages,
  AdminGetImages,
  setPageId
} from '../../../../features/imageSlice';
import { GetUserInfo } from '../../../../features/authSlice';
import LoadingComponent from '../../../components/Loading';
import ImageDetail from './ImageDetail';
import HeaderToolBar from './HeaderToolBar';
import { PAGE_SIZE_IMAGE } from '../../../constant/config';
import { roles } from '../../../constant/roles';
import NotFoundView from '../../errors/NotFoundView';
import Result from './Result';
import { _convertObjectToQuery } from 'src/app/utils/apiService';
import moment from 'moment';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const ImageList = () => {
  const query = useQuery();
  const page = query.get('page');
  const name = query.get('license_plate');
  const start_date = query.get('start_date');
  const end_date = query.get('end_date');
  
  //console.log('check useQuery file index>>>',name, start_date, end_date);

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLogin = useSelector(state => state.authSlice.dataLogin);
  const roleUser = dataLogin && dataLogin.role?.title;
  const agencyId = dataLogin && dataLogin.agency?.id;
  const isLoading = useSelector(state => state.imageSlice.isLoading);
  const err = useSelector(state => state.imageSlice.err);
  const listImages = useSelector(state => state.imageSlice.listImage);
  const totalPage = useSelector(state => state.imageSlice.totalPage);

  const [isShowModalImgDetails, setShowModalImg] = React.useState(false);
  const [sendData, setSendData] = React.useState(undefined);
  const [currentPage, setCurrentPage] = React.useState(
    page ? Number.parseInt(page) : 1
  );
  const showDetailsImg = data => {
    if (!data) return;
    setSendData(data);
    setShowModalImg(true);
  };

  //----------------- Reload page ---------------------
  const [params, setParams] = useState({
    page: page || 1,
    page_size: PAGE_SIZE_IMAGE,
    license_plate: name || '',
    start_date:
      Math.floor(
        moment(start_date)
          .utcOffset(0)
          .unix()
      ) ||
      moment()
        .subtract(7, 'd')
        .utcOffset(0)
        .unix() ||
      '',
    end_date:
      Math.floor(
        moment(end_date)
          .utcOffset(0)
          .unix()
      ) ||
      moment()
        .subtract(7, 'd')
        .utcOffset(0)
        .unix() ||
      ''
  });
  const agency_id_local = +localStorage.getItem('agency-id');
  const getListImageWithParams = (data, Changepage = false, pageNumber) => {
    const paramValue = Object.assign({}, params, data);
    const dataFormatUix = {
      license_plate: data.license_plate,
      start_date:
        Math.floor(
          moment(data.start_date)
            .utcOffset(0)
            .unix()
        ) ||
        moment()
          .subtract(7, 'd')
          .utcOffset(0)
          .unix(),
      end_date:
        Math.floor(
          moment(data.end_date)
            .utcOffset(0)
            .unix()
        ) ||
        moment()
          .utcOffset(0)
          .unix()
    };
    const paramFormattedValue = Object.assign({}, params, dataFormatUix);
    if (Changepage) {
      paramValue.page = pageNumber;
      setCurrentPage(pageNumber);
    } else {
      setCurrentPage(paramValue.page);
    }

    setParams(paramValue);
    navigate(`/app/image?${_convertObjectToQuery(paramValue)}`);
    if (roleUser && roleUser === roles.ADMIN) {
      dispatch(AdminGetImages(paramFormattedValue));
    } else if(agency_id_local){
        dispatch(GetImages({ payload: paramFormattedValue, agencyId: agency_id_local}));

    }else{
       dispatch(GetImages({ payload: paramFormattedValue, agencyId: agencyId }));
    }
  };

  const clearSearch = () => {
    const paramValue = {
      page: 1,
      page_size: PAGE_SIZE_IMAGE,
      license_plate: ''
    };
    setParams(paramValue);
    if (roleUser && roleUser === roles.ADMIN) {
      dispatch(AdminGetImages(paramValue));
    } else {
      dispatch(GetImages({ payload: paramValue, agencyId }));
    }
  };

  useEffect(() => {
    dispatch(GetUserInfo());
  }, [dispatch]);

  useEffect(() => {
    // if (!listImages) dispatch(GetImages(params));
  }, [dispatch]);

  if (err) {
    return (
      <Page className={classes.root} title="Ảnh">
        <Container maxWidth={false}>
          <NotFoundView />
        </Container>
      </Page>
    );
  }
  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <React.Fragment>
          <HeaderToolBar
            querySearch={{
              name: name,
              start_date: start_date,
              end_date: end_date
            }}
            isLoading={isLoading}
            searchRef={getListImageWithParams}
            clearSearchRef={clearSearch}
          />
          <Box mt={3}>
            <React.Fragment>
              {isLoading ? (
                <LoadingComponent />
              ) : (
                <Result
                  listImages={listImages}
                  actionDetailsImg={showDetailsImg}
                />
              )}
              {!listImages && (
                <Box textAlign={'center'} color={'red'} marginTop={'1em'}>
                  Vui lòng nhập chính xác xe để tìm kiếm hình ảnh, hoặc không
                  nhập gì để hiển thị tất cả ảnh
                </Box>
              )}
            </React.Fragment>
          </Box>
          {listImages && listImages.length > 0 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                style={{ color: '#C62222' }}
                count={totalPage}
                size="small"
                page={currentPage}
                onChange={(e, value) =>
                  getListImageWithParams(
                    {
                      end_date: params.end_date,
                      license_plate: params.license_plate,
                      start_date: params.start_date
                    },
                    true,
                    value
                  )
                }
              />
            </Box>
          )}
        </React.Fragment>
      </Container>
      {isShowModalImgDetails && sendData && (
        <ImageDetail
          open={isShowModalImgDetails}
          data={sendData}
          closeRef={() => setShowModalImg(false)}
        />
      )}
    </Page>
  );
};

export default ImageList;
