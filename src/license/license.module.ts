import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';

@Module({
  imports: [],
  providers: [LicenseService],
  controllers: [LicenseController],
})
export class LicenseModule {}
