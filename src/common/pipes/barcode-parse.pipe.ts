import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

export interface BarcodeInput {
  barcode: string;
  location?: string;
}

export interface BarcodeDto extends BarcodeInput {
  parsed: {
    itemCode: string;
    batch: string;
  };
}

@Injectable()
export class BarcodeParsePipe implements PipeTransform<
  BarcodeInput,
  BarcodeDto
> {
  transform(value: BarcodeInput): BarcodeDto {
    if (!value || !value?.barcode || typeof value?.barcode !== 'string') {
      throw new BadRequestException('Invalid barcode');
    }
    const { barcode } = value;

    return {
      ...value,
      parsed: {
        itemCode: barcode.slice(0, 3),
        batch: barcode.slice(3),
      },
    };
  }
}
