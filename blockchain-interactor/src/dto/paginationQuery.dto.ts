import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
    
    @ApiProperty()
    // Query params are string by default, casting to Number
    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    limit: number;

    @ApiProperty()
    // Query params are string by default, casting to Number
    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    offset: number;
}