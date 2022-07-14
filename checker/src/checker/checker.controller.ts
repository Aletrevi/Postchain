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


  @EventPattern('verify_post')
  async postControlEvent(@Payload() body: any)  {
    
    let res = await this.checkerService.manageValidation(body);
    
    
    if (res) {
     
      return this.eventsClient.emit("post_verified", body._id) 
    } else {
     
      return this.eventsClient.emit("post_rejected", body._id) 
    }
    
  }
}
