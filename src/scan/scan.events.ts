import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ScanEvents {
  @OnEvent('scan.received')
  handle(payload: any) {
    console.log('Event:', payload);
  }
}
