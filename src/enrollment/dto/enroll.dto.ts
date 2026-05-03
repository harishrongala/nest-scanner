import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EnrollDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  token: string;
}
