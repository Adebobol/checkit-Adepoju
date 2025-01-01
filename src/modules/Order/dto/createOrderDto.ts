import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  specifications: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
