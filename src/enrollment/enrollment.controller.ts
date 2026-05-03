import { Controller, Post, Body } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { DeviceService } from '../device/device.service';
import { EnrollDto } from './dto/enroll.dto';
import { DeviceResponse } from '../device/device-response';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    private enrollmentService: EnrollmentService,
    private deviceService: DeviceService,
  ) {}

  @Post('generate')
  generate() {
    return this.enrollmentService.generateToken();
  }

  @Post('enroll')
  enroll(@Body() dto: EnrollDto): DeviceResponse {
    this.enrollmentService.consumeToken(dto.token);
    const device = this.deviceService.registerNewDevice();
    // Wrap in DeviceResponse — ClassSerializerInterceptor will exclude apiKey
    return new DeviceResponse(device);
  }
}
