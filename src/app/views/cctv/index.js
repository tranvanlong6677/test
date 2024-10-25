import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { PAGE_SIZE_LIST } from 'src/app/constant/config';
import './style.css';
import { GetUserInfo } from 'src/features/authSlice';

const MapView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserInfo());
  }, []);
}