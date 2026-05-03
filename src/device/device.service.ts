import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Device } from '../common/interfaces/device.interface';

@Injectable()
export class DeviceService {
  private devices: Device[] = [];

  registerNewDevice(): Device {
    const device: Device = {
      id: randomUUID(),
      apiKey: randomUUID(),
      warehouseId: 'WH-1',
    };

    this.devices.push(device);
    return device;
  }

  getDeviceByKey(apiKey: string): Device | null {
    return this.devices.find((d) => d.apiKey === apiKey) || null;
  }

  attachLicense(
    deviceId: string,
    license: Omit<NonNullable<Device['license']>, 'valid'>,
  ) {
    const device = this.devices.find((d) => d.id === deviceId);
    if (!device) return null;

    device.license = {
      ...license,
      valid: true,
    };

    return device;
  }

  updateLastSeen(deviceId: string, location?: string) {
    const device = this.devices.find((d) => d.id === deviceId);
    if (!device) return;

    device.lastSeenAt = Date.now();
    device.lastLocation = location || device.lastLocation;

    return device;
  }
}
