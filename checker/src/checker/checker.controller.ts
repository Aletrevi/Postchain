import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CreateCheckerDto } from './dto/create-checker.dto';
import { UpdateCheckerDto } from './dto/update-checker.dto';

@Controller('checker')
export class CheckerController {
  constructor(private readonly checkerService: CheckerService) {}

  @Post()
  checkPost(@Body() createCheckerDto: CreateCheckerDto) {
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
