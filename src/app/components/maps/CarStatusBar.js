import React from 'react';
import 'date-fns';
import { CAR_STATUS } from 'src/app/constant/config'
import { Paper } from '@material-ui/core';


const CarStatusBar = ({
  clickRoadTrackingUpdate,
  startFollow,
  resetTracking,
  setLine,
  statisticVehicleTracking,
  setCarStatus,
  statusActive
}) => {
  const handleSelectCar = (car) => {
    if(statusActive === car.value) {
      setCarStatus('')

    } else {
      setCarStatus(car.value)
    }
  }
  return (
    <div className="car-status-bar">

      {
        CAR_STATUS && CAR_STATUS.map((car, index) =>
          <div className="car-status-wrapper" key={index++}>
            <Paper className={`CarStatusIcon ${statusActive === car.value ? 'CarStatusActive rotating' : ''}`} onClick={() => handleSelectCar(car)}>
              <img alt="icon" src={`/static/iconSvg/cars/${car?.icon}.svg`} className={`imageCar`} />
            </Paper>
            <br />
            {car?.label}
            <span className="CarCount">{
                index == 0 && statisticVehicleTracking ? statisticVehicleTracking.running_vehicles.length :
                  index == 1 && statisticVehicleTracking ? statisticVehicleTracking.stop_vehicles.length :
                    index == 2 && statisticVehicleTracking ? statisticVehicleTracking.over_speed_vehicles.length :
                      index == 3 && statisticVehicleTracking ? statisticVehicleTracking.lost_gps_vehicles.length :
                        index == 4 && statisticVehicleTracking ? statisticVehicleTracking.lost_gsm_vehicles.length : 0
              }</span>
          </div>
        )
      }
    </div>
  );
};

export default CarStatusBar;
