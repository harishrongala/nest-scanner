import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainException } from '../common/exceptions/domain.exception';
import { DeviceService } from '../device/device.service';

@Injectable()
export class LicenseService {
  private tokens = new Map<string, { expiresAt: number; used: boolean }>();

  constructor(private deviceService: DeviceService) {}

  generate() {
    const token = randomUUID();

    this.tokens.set(token, {
      expiresAt: Date.now() + 10 * 60 * 1000,
      used: false,
    });

    return { token };
  }

  activate(deviceId: string, token: string) {
    const record = this.tokens.get(token);

    if (!record) throw new DomainException('INVALID_LICENSE', 'Not found');
    if (record.used) throw new DomainException('LICENSE_USED', 'Used');
    if (Date.now() > record.expiresAt)
      throw new DomainException('LICENSE_EXPIRED', 'Expired');

    record.used = true;

    return this.deviceService.attachLicense(deviceId, {
      key: token,
      activatedAt: Date.now(),
    });
  }
}
