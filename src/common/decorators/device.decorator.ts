import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceRequest } from '../interfaces/device-request.interface';

export const DeviceDecorator = createParamDecorator(
  (_, ctx: ExecutionContext): DeviceRequest['device'] => {
    const req = ctx.switchToHttp().getRequest<DeviceRequest>();
    return req.device;
  },
);
