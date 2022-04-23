import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts extends Document {
  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  postId: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  checked: boolean;

  @ApiProperty()
  @Prop({
    required: true,
  })
  title: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  body: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  author: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
