import { Module, DynamicModule, Global } from '@nestjs/common';
import { DeviceService } from './device.service';

@Global()
@Module({})
export class DeviceModule {
  static register(): DynamicModule {
    return {
      module: DeviceModule,
      providers: [DeviceService],
      exports: [DeviceService],
    };
  }
}
