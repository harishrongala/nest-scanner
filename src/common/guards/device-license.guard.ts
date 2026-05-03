import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { DeviceRequest } from '../interfaces/device-request.interface';

@Injectable()
export class DeviceLicenseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<DeviceRequest>();
    const device = req.device;

    if (!device.license || !device.license.valid) {
      throw new ForbiddenException('Device not licensed');
    }

    return true;
  }
}
