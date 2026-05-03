import { Test, TestingModule } from '@nestjs/testing';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { DeviceAuthGuard } from '../common/guards/device-auth.guard';
import { DeviceLicenseGuard } from '../common/guards/device-license.guard';
import type { BarcodeDto } from '../common/pipes/barcode-parse.pipe';
import type { Device } from '../common/interfaces/device.interface';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockScanService = {
  processScan: jest.fn(),
};

// Override both guards to always allow — guard logic is tested separately
const allowGuard = { canActivate: jest.fn().mockReturnValue(true) };

// ── Fixtures ─────────────────────────────────────────────────────────────────

const mockDevice: Device = {
  id: 'dev-1',
  apiKey: 'key-1',
  warehouseId: 'WH-1',
  license: { key: 'lic-1', activatedAt: Date.now(), valid: true },
};

const mockDto: BarcodeDto = {
  barcode: 'ABC123456',
  parsed: { itemCode: 'ABC', batch: '123456' },
};

// ── Suite ────────────────────────────────────────────────────────────────────

describe('ScanController', () => {
  let controller: ScanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanController],
      providers: [{ provide: ScanService, useValue: mockScanService }],
    })
      // Replace guards so they don't require a real HTTP context in unit tests
      .overrideGuard(DeviceAuthGuard)
      .useValue(allowGuard)
      .overrideGuard(DeviceLicenseGuard)
      .useValue(allowGuard)
      .compile();

    controller = module.get<ScanController>(ScanController);
    jest.clearAllMocks();
  });

  // ── scan ──────────────────────────────────────────────────────────────────

  describe('scan()', () => {
    it('should call scanService.processScan with dto and device', () => {
      mockScanService.processScan.mockReturnValue({ scanned: true });

      controller.scan(mockDto, mockDevice);

      expect(mockScanService.processScan).toHaveBeenCalledWith(
        mockDto,
        mockDevice,
      );
    });

    it('should return the result from scanService.processScan', () => {
      mockScanService.processScan.mockReturnValue({ scanned: true });

      const result = controller.scan(mockDto, mockDevice);

      expect(result).toEqual({ scanned: true });
    });

    it('should propagate DomainException thrown by scanService', () => {
      mockScanService.processScan.mockImplementation(() => {
        throw new Error('DUPLICATE_SCAN');
      });

      expect(() => controller.scan(mockDto, mockDevice)).toThrow(
        'DUPLICATE_SCAN',
      );
    });

    it('should be decorated with both guards', () => {
      // Bracket notation avoids the unbound-method lint rule —
      // we only need the function reference as a metadata key, not to call it.
      const handler = ScanController.prototype['scan'] as object;
      const guards = Reflect.getMetadata('__guards__', handler) as unknown[];

      expect(guards).toContain(DeviceAuthGuard);
      expect(guards).toContain(DeviceLicenseGuard);
    });
  });
});
