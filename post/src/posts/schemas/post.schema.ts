import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts extends Document {
  @Prop({
    required: false,
    default: "pending",
  })
  status: string;

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

  @ApiProperty()
  @Prop({
    required: false,
    default: false
  })
  isChecked: boolean;

  @ApiProperty()
  @Prop({
    required: false,
    default: false,
  })
  isPublished: boolean;

  @ApiProperty()
  @Prop({
    required: false,
    default: false,
  })
  checkPassed: boolean
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
