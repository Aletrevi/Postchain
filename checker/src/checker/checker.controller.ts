import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CheckerService } from './checker.service';
import { CreateCheckerDto } from './dto/create-checker.dto';
import { UpdateCheckerDto } from './dto/update-checker.dto';
import { Posts } from './schemas/checker.schema';
import { ClientProxy, EventPattern, Payload} from '@nestjs/microservices'

@Controller('checker')
export class CheckerController {
  constructor(private readonly checkerService: CheckerService,
    @Inject('RABBIT_TRIGGERS') private triggersClient: ClientProxy,
    @Inject('RABBIT_EVENTS') private eventsClient: ClientProxy,) {}

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
  //  }

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

  @EventPattern('verify_post')
  postControlEvent(@Payload() body: any){
    this.eventsClient.emit("VALIDATION_COMPLETE", this.checkerService.manageValidation(body)) 
  }
}
