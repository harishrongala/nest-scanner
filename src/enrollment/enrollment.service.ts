import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainException } from '../common/exceptions/domain.exception';

@Injectable()
export class EnrollmentService {
  private tokens = new Map();

  generateToken() {
    const token = randomUUID();

    this.tokens.set(token, {
      expiresAt: Date.now() + 5 * 60 * 1000,
      used: false,
    });

    return { token };
  }

  consumeToken(token: string) {
    const record = this.tokens.get(token);

    if (!record) throw new DomainException('INVALID_TOKEN', 'Not found');
    if (record.used) throw new DomainException('TOKEN_USED', 'Used');
    if (Date.now() > record.expiresAt)
      throw new DomainException('TOKEN_EXPIRED', 'Expired');

    record.used = true;
  }
}
