import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Block, BlockSchema } from './schemas/block.schema';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema}]),
    MinioClientModule,
  ],
  controllers: [BlocksController],
  providers: [BlocksService]
})
export class BlocksModule {}
