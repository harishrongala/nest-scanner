import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DeviceService } from '../../device/device.service';
import { DeviceRequest } from '../interfaces/device-request.interface';

@Injectable()
export class DeviceAuthGuard implements CanActivate {
  constructor(private readonly deviceService: DeviceService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<DeviceRequest>();
    const apiKey = req.headers['x-device-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException(
        'Missing device key in headers: x-device-key',
      );
    }

    const device = this.deviceService.getDeviceByKey(apiKey);

    if (!device) {
      throw new UnauthorizedException('Invalid device');
    }

    req.device = device;
    return true;
  }
}
