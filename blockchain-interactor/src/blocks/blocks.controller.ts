import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PaginationQueryDto } from 'src/dto/paginationQuery.dto';
import { BlocksService } from './blocks.service';
import { FindOneParams } from './params/find-one.params';
import { Block } from './schemas/block.schema';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'All existing records',
    type: [Block]
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid id format provided'
  })
  @ApiResponse({
    status: 404,
    description: 'No record found'
  })
  findAll(@Query() paginationQuery: PaginationQueryDto): Observable<Block[]> {
    Logger.debug(paginationQuery);
    return this.blocksService.findAll(paginationQuery);
  }


  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Block,
  })
  @ApiResponse({
    status: 404,
    description: 'No records found'
  })
  findOne(@Param() { id }: FindOneParams): Observable<Block> {
    return this.blocksService.findOne(id);
  }


  // TODO: Change path
  @Get('/hash/:hash')
  @ApiParam({
    name: 'hash',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'The link of the relative transaction',
    type: Block,
  })
  @ApiResponse({
    status: 404,
    description: 'No transactions found'
  })
  findOneByHash(@Param('hash') hash: string): Observable<any> {
    return this.blocksService.findTransaction(hash);
  }

  @EventPattern('createBlock')
  createEvent(@Payload() blockBody: any): Observable<Block> {
    return this.blocksService.create(blockBody);
  }
}
