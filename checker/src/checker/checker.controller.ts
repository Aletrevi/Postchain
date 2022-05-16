import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CheckerService } from './checker.service';
import { CreateCheckerDto } from './dto/create-checker.dto';
import { UpdateCheckerDto } from './dto/update-checker.dto';
import { Posts } from './schemas/checker.schema';

@Controller('checker')
export class CheckerController {
  constructor(private readonly checkerService: CheckerService) {}

  @Get()
  @ApiBody({
    required: true,
    type: CreateCheckerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Checked status',
    type: Posts,
  })
  async checkPost(@Body() createCheckerDto: CreateCheckerDto) {
    return this.checkerService.checkPost(createCheckerDto);
  }

  // @Get()
  // findAll() {
  //   return this.checkerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.checkerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCheckerDto: UpdateCheckerDto) {
  //   return this.checkerService.update(+id, updateCheckerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.checkerService.remove(+id);
  // }
}
