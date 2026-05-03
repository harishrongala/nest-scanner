export interface Device {
  id: string;
  apiKey: string;
  warehouseId?: string;

  license?: {
    key: string;
    activatedAt: number;
    valid: boolean;
  };

  lastSeenAt?: number;
  lastLocation?: string;
}
