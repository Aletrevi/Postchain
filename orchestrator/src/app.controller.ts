import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { combineLatest, Observable, of } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('POST_SERVICE_EVENTS') private post_service_events_client: ClientProxy,
    @Inject('CHECKER_SERVICE_EVENTS') private checker_service_events_client: ClientProxy,
    @Inject('BC_INTERACTOR_EVENTS') private bc_interactor_events_client: ClientProxy,
    @Inject('POST_SERVICE_TRIGGERS') private post_service_triggers_client: ClientProxy,
    @Inject('CHECKER_SERVICE_TRIGGERS') private checker_service_triggers_client: ClientProxy,
    @Inject('BC_INTERACTOR_TRIGGERS') private bc_interactor_triggers_client: ClientProxy,
  ) {}

  @EventPattern('post_created')
  postCreatedEvent(@Payload() body: any): Observable<any> {
  
    let bc = this.bc_interactor_triggers_client.emit<any>('create_block', body);
   
    let checker = this.checker_service_triggers_client.emit<any>('verify_post', body);
   
    return combineLatest([checker, bc]);
  }

  @EventPattern('post_verified')
  postVerifiedEvent(@Payload() body: any): Observable<any> {
    
    return this.post_service_triggers_client.emit<any>('post_verified', body);  
  }

  @EventPattern('post_rejected')
  postRejectedEvent(@Payload() body: any): Observable<any> {

    let post = this.post_service_triggers_client.emit<any>('post_rejected', body);
    let bc = this.bc_interactor_triggers_client.emit<any>('remove_block', body);
    return combineLatest([post, bc])
  }

  @EventPattern('block_published')
  blockPublishedEvent(@Payload() body: any): Observable<any> {
     
    return this.post_service_triggers_client.emit<any>('block_published', body); 
  }

  @EventPattern('block_removed')
  blockNotPublishedEvent(@Payload() body: any): Observable<any> {
   
    return this.post_service_triggers_client.emit<any>('block_not_published', body);
  }
 
  @Get()
  health(): boolean {
    return true;
  }

}
