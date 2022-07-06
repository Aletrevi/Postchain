import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
    
    @ApiProperty()
    // Query params are string by default, casting to Number
    limit: number;

    @ApiProperty()
    // Query params are string by default, casting to Number
    offset: number;
}