import { Request } from 'express';
import { Device } from './device.interface';

export interface DeviceRequest extends Request {
  device: Device;
}
