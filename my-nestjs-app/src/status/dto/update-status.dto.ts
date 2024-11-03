import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsNumber()
  statusId: number;
}