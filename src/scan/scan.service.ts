import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeviceService } from '../device/device.service';
import { DomainException } from '../common/exceptions/domain.exception';
import { Device } from '../common/interfaces/device.interface';
import type { BarcodeDto } from '../common/pipes/barcode-parse.pipe';

@Injectable()
export class ScanService {
  constructor(
    private eventEmitter: EventEmitter2,
    private deviceService: DeviceService,
  ) {}

  processScan(dto: BarcodeDto, device: Device) {
    if (dto.barcode === 'DUPLICATE') {
      throw new DomainException('DUPLICATE_SCAN', 'Duplicate scan');
    }

    this.deviceService.updateLastSeen(device.id, dto.location);

    this.eventEmitter.emit('scan.received', {
      deviceId: device.id,
      item: dto.parsed.itemCode,
    });

    return { scanned: true };
  }
}
