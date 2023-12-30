import { Injectable } from '@angular/core';
import { Driver } from '../../driver.model';
import { DriverRequest } from '../request/driver-request.model';
import { DriverResponse } from '../response/driver-response.model';

@Injectable()
export class DriverMapper {
  toDriver(driverRequest: DriverRequest): Driver {
    if (!driverRequest) {
      driverRequest = new DriverRequest();
    }
    const driver = new Driver();
    driver.setUpdatedAt = driverRequest.getUpdatedAt;
    driver.setPublicId = driverRequest.getPublicId;
    driver.setName = driverRequest.getName;
    driver.setAvailable = driverRequest.isAvailable;
    driver.setRounds = driverRequest.getRounds;
    return driver;
  }

  toDriverRequest(driver: Driver): DriverRequest {
    if (!driver) {
      driver = new Driver();
    }
    const driverRequest = new DriverRequest();
    driverRequest.setCreatedAt = driver.getCreatedAt;
    driverRequest.setUpdatedAt = driver.getUpdatedAt;
    driverRequest.setPublicId = driver.getPublicId;
    driverRequest.setName = driver.getName;
    driverRequest.setAvailable = driver.isAvailable;
    driverRequest.setRounds = driver.getRounds;
    return driverRequest;
  }

  toDriverResponse(driver: Driver): DriverResponse {
    if (!driver) {
      driver = new Driver();
    }
    const driverResponse = new DriverResponse();
    driverResponse.setCreatedAt = driver.getCreatedAt;
    driverResponse.setUpdatedAt = driver.getUpdatedAt;
    driverResponse.setPublicId = driver.getPublicId;
    driverResponse.setName = driver.getName;
    driverResponse.setAvailable = driver.isAvailable;
    driverResponse.setRounds = driver.getRounds;
    return driverResponse;
  }

  toDriverResponseList(driver: Driver[]): DriverResponse[] {
    if (driver == null) {
      driver = [];
    }
    let driverResponses = [];
    for (let i = 0; i < driver.length; i++) {
      driverResponses.push(this.toDriverResponse(driver[i]));
    }
    return driverResponses;
  }
}
