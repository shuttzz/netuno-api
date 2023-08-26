import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryParamsRegisterDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  page: number;
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  size: number;
  @IsOptional()
  sort?: string;
  @IsOptional()
  order?: string;
  @IsOptional()
  searchDescription?: string;
  @IsOptional()
  searchValue?: string;
  @IsOptional()
  searchDueDate?: string;
  @IsOptional()
  searchEntry?: boolean;
  @IsOptional()
  searchRecurrency?: boolean;
  @IsOptional()
  searchCategory?: string;
  @IsOptional()
  searchWallet?: string;
}
