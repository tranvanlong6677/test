import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/app/layouts/DashboardLayout';
import MainLayout from 'src/app/layouts/MainLayout';
import LoginView from 'src/app/views/auth/LoginView';
import RegisterView from 'src/app/views/auth/RegisterView';
import NotFoundView from './app/views/errors/NotFoundView';
import DraftPageView from './app/views/errors/DraftPageView';
import Camera from './app/views/streamCamera';
import Playback from './app/views/playback';

import DeviceListView from './app/views/device';
import ImageListView from './app/views/image/ImageListView';
import VehicleListView from './app/views/vehicle';
import MapView from './app/views/map';
import ManageView from './app/views/manage';
import BaoCaoBGTView from './app/views/baoCaoBGT';
import HanhTrinhChayXeControlView from './app/views/baoCaoBGT/HanhTrinhChayXe';
import BaoCaoDungDoControlView from './app/views/baoCaoBGT/BaoCaoDungDo';
import BaoCaoTongHopTheoLaiXeControlView from './app/views/baoCaoBGT/BaoCaoTongHopTheoLaiXe';
import BaoCaoTongHopTheoXeControlView from './app/views/baoCaoBGT/BaoCaoTongHopTheoXe';
import QuaTocDoGioihanControlView from './app/views/baoCaoBGT/QuaTocDoGioihan';
import ThoiGianLaiXeLienTucControlView from './app/views/baoCaoBGT/ThoiGianLaiXeLienTuc';
import TocDoCuaXeControlView from './app/views/baoCaoBGT/TocDoCuaXe';

import BaoCaoTT09View from './app/views/baoCaoTT09';
import BaoCaoPhuLuc5ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc5';
import BaoCaoPhuLuc8ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc8';
import BaoCaoPhuLuc14ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc14';
import BaoCaoPhuLuc16ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc16';
import BaoCaoPhuLuc17ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc17';
import BaoCaoPhuLuc19ControlView from './app/views/baoCaoTT09/BaoCaoPhuLuc19';

import BaoCaoDNiew from './app/views/baoCaoDN';
import MainControlView from './app/views/manage/mainControl';
import MainBaoCaoBGTView from './app/views/baoCaoBGT/mainControl';
import MainBaoCaoTT09View from './app/views/baoCaoTT09/mainControl';
import MainBaoCaoDNiew from './app/views/baoCaoDN/mainControl';
import AgencyView from './app/views/agency';
import CreateAgency from './app/views/agency/agency_create';

import CreateVehicle from './app/views/vehicle/vehicle_create';
import DriverListView from './app/views/manage/driver';
import TrackingView from './app/views/tracking';
import ServiceStaff from './app/views/manage/service-staff';
import MemberManage from './app/views/manage/users';
import SalesManage from './app/views/manage/sales';
import VehicleType from './app/views/manage/vehicles/vehicle_types';
import Vehicle from './app/views/manage/vehicles/vehicles';
import GroupVehicle from './app/views/manage/vehicles/group_vehicles';
import GroupUser from './app/views/manage/users/group_users';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      // { path: 'p2p', element: <Camera /> },
      // { path: 'images', element: <ImageListView /> },
      { path: 'device', element: <DeviceListView /> },
      { path: 'tracking', element: <TrackingView /> },
      { path: 'map', element: <MapView /> },
      { path: 'image', element: <ImageListView /> },
      { path: 'camera', element: <Camera /> },
      { path: 'playback', element: <Playback /> },
      { path: 'agency', element: <AgencyView /> },
      { path: 'agency/create', element: <CreateAgency /> },
      {
        path: 'manage',
        element: <ManageView />,
        children: [
          { path: 'control', element: <MainControlView /> },
          {
            path: 'vehicle',
            children: [
              { path: 'all', element: <VehicleListView /> },
              // { path: 'images', element: <ImageListView /> },
              // { path: 'camera', element: <Camera /> },
              { path: 'create', element: <CreateVehicle /> }
            ]
          },
          {
            path: 'user',
            element: <MemberManage />
          },
          {
            path: 'driver',
            children: [{ path: 'all', element: <DriverListView /> }]
          },
          {
            path: 'service-staff',
            element: <ServiceStaff />
          },
          {
            path: 'sales',
            element: <SalesManage />
          },
          {
            path: 'vehicle-types',
            element: <VehicleType />
          },
          {
            path: 'vehicles',
            element: <Vehicle />
          },
          {
            path: 'group-vehicles',
            element: <GroupVehicle />
          },
          {
            path: 'group-users',
            element: <GroupUser />
          }
        ]
      },

      {
        path: 'baocao-bgt',
        element: <BaoCaoBGTView />,
        children: [
          { path: 'control', element: <MainBaoCaoBGTView /> },
          {
            path: 'hanh-trinh-chay-xe',
            element: <HanhTrinhChayXeControlView />
          },

          { path: 'bao-cao-dung-do', element: <BaoCaoDungDoControlView /> },
          {
            path: 'bao-cao-tong-hop-theo-lai-xe',
            element: <BaoCaoTongHopTheoLaiXeControlView />
          },
          {
            path: 'bao-cao-tong-hop-theo-xe',
            element: <BaoCaoTongHopTheoXeControlView />
          },
          {
            path: 'qua-toc-do-gioi-han',
            element: <QuaTocDoGioihanControlView />
          },
          {
            path: 'thoi-gian-lai-xe-lien-tuc',
            element: <ThoiGianLaiXeLienTucControlView />
          },
          { path: 'toc-do-cua-xe', element: <TocDoCuaXeControlView /> }
        ]
      },
      {
        path: 'baocao-tt09',
        element: <BaoCaoTT09View />,
        children: [
          { path: 'control', element: <MainBaoCaoTT09View /> },
          { path: 'tt09-phu-luc-5', element: <BaoCaoPhuLuc5ControlView /> },
          { path: 'tt09-phu-luc-8', element: <BaoCaoPhuLuc8ControlView /> },
          { path: 'tt09-phu-luc-14', element: <BaoCaoPhuLuc14ControlView /> },
          { path: 'tt09-phu-luc-16', element: <BaoCaoPhuLuc16ControlView /> },
          { path: 'tt09-phu-luc-17', element: <BaoCaoPhuLuc17ControlView /> },
          { path: 'tt09-phu-luc-19', element: <BaoCaoPhuLuc19ControlView /> }
        ]
      },
      {
        path: 'baocao-dn',
        element: <BaoCaoDNiew />,
        children: [{ path: 'control', element: <MainBaoCaoDNiew /> }]
      },
      { path: '*', element: <Navigate to="/app/tracking" /> }
    ]
  },

  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: 'waiting-confirm', element: <DraftPageView /> },
      { path: '/', element: <Navigate to="/app/p2p?role=viewer" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
