import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ActivateLicenseDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  token: string;
}
