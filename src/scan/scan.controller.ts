import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ScanService } from './scan.service';
import { DeviceAuthGuard } from '../common/guards/device-auth.guard';
import { DeviceLicenseGuard } from '../common/guards/device-license.guard';
import { BarcodeParsePipe } from '../common/pipes/barcode-parse.pipe';
import type { BarcodeDto } from '../common/pipes/barcode-parse.pipe';
import { DeviceDecorator } from '../common/decorators/device.decorator';
import type { Device } from '../common/interfaces/device.interface';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @UseGuards(DeviceAuthGuard, DeviceLicenseGuard)
  @Post()
  scan(
    @Body(new BarcodeParsePipe()) dto: BarcodeDto,
    @DeviceDecorator() device: Device,
  ) {
    return this.scanService.processScan(dto, device);
  }
}
