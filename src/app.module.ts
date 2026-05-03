import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DeviceModule } from './device/device.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { LicenseModule } from './license/license.module';
import { ScanModule } from './scan/scan.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DeviceModule.register(),
    EnrollmentModule,
    LicenseModule,
    ScanModule,
  ],
  providers: [],
})
export class AppModule {}
