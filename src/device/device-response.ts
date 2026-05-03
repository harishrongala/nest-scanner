import { Exclude, Expose } from 'class-transformer';

/**
 * Serialized Device response.
 *
 * `apiKey` is excluded — it is a sensitive credential that should
 * never be returned after the initial enrollment response.
 *
 * Used with ClassSerializerInterceptor (registered globally in main.ts).
 */
export class DeviceResponse {
  @Expose()
  id: string;

  // apiKey is intentionally excluded from all responses after enroll
  @Exclude()
  apiKey: string;

  @Expose()
  warehouseId?: string;

  @Expose()
  license?: {
    key: string;
    activatedAt: number;
    valid: boolean;
  };

  @Expose()
  lastSeenAt?: number;

  @Expose()
  lastLocation?: string;

  constructor(partial: Partial<DeviceResponse>) {
    Object.assign(this, partial);
  }
}
