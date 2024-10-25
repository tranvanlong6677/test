import { useSelector } from 'react-redux';
import {
  VEHICLE_STATUS
} from 'src/app/constant/config';

export const splitAndMergeLatLng = (car, carSelected) => {
  var snap = ''

  if (car) {
    car.forEach((e, index) => {
      const lat = Number(e.lat);
      const lng = Number(e.lng);

      snap += `${lat},${lng}`

      if (index != car.length - 1) {
        snap += '|'
      }
    }
    )
  }

  if (carSelected) {
    carSelected.forEach((e, index) => {
      const lat = Number(e.lat);
      const lng = Number(e.lng);

      snap += `${lat},${lng}`

      if (index != carSelected.length - 1) {
        snap += '|'
      }
    }
    )
  }

  return snap;
}
const getDegree = (number, url) => {
  const marker = document.querySelector(`[src="${url}"]`)

  if (marker) {

    marker.style.transform = `rotate(${number}deg)`
  }
}
export const renderIconCar = (vehicle, statisticVehicleTracking) => {
  let flag = true;
  let url = "";
  vehicle && flag && statisticVehicleTracking && statisticVehicleTracking.lost_gsm_vehicles.map((item, index) => {
    if (item == (vehicle.license_plate)) {
      flag = false;

      url = "/static/iconSvg/cars/car_lost_gps.svg"
    }
  })
  vehicle && flag && statisticVehicleTracking && statisticVehicleTracking.over_speed_vehicles.map((item, index) => {

    if (item == vehicle.license_plate) {
      flag = false;
      url = `/static/iconSvg/cars/car_out_speed.svg`;
    }
  })
  vehicle && flag && statisticVehicleTracking && statisticVehicleTracking.stop_vehicles.map((item, index) => {
    if (item === vehicle.license_plate) {
      flag = false;
      url = "/static/iconSvg/cars/car_stopped.svg";
    }

  })
  vehicle && flag && statisticVehicleTracking && statisticVehicleTracking.running_vehicles.map((item, index) => {

    if (item == vehicle.license_plate) {
      flag = false;

      url = `/static/iconSvg/cars/car_moving.svg`;

    }
  })

  flag && statisticVehicleTracking && vehicle && statisticVehicleTracking.lost_gps_vehicles.map((item, index) => {
    if (item === vehicle.license_plate) {
      flag = false;
      url = `/static/iconSvg/cars/car_lost_gsm.svg`;

    }
  })

  return url;
}

export const renderIconCar1 = (status) => {
  const baseUrlIcon = "/static/images/map/"

  const baseUrlIcon1 = "/static/iconSvg/cars/"

  switch (status) {
    case VEHICLE_STATUS.ACTIVE:

      return `${baseUrlIcon}green_car.png`

    case 'stopped':
      return `${baseUrlIcon}stopped.png`

    case 'begin':
      return `${baseUrlIcon}begin_flag.png`

    case 'end':
      return `${baseUrlIcon}car_stopped.svg`

    default:
      return `${baseUrlIcon1}car_moving.svg`

    // return  `${baseUrlIcon}gray_car.png`
  }
}
