import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';
import { ScanEvents } from './scan.events';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [DeviceModule],
  providers: [ScanService, ScanEvents],
  controllers: [ScanController],
})
export class ScanModule {}
