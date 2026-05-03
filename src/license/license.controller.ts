import { Controller, Post, Body } from '@nestjs/common';
import { LicenseService } from './license.service';
import { ActivateLicenseDto } from './dto/activate-license.dto';
import { DeviceResponse } from '../device/device-response';

@Controller('license')
export class LicenseController {
  constructor(private readonly service: LicenseService) {}

  @Post('generate')
  generate() {
    return this.service.generate();
  }

  @Post('activate')
  activate(
    deviceId: string,
    token: string,
    @Body()
    dto: ActivateLicenseDto,
  ): DeviceResponse | null {
    const device = this.service.activate(dto.deviceId, dto.token);
    return device ? new DeviceResponse(device) : null;
  }
}
