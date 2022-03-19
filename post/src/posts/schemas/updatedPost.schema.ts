import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostsDocument = UpdatedPosts & Document;

@Schema()
export class UpdatedPosts extends Document {
  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  _id: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  status: string;

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

  @ApiProperty()
  @Prop({
    required: true,
  })
  isChecked: boolean;

  @ApiProperty()
  @Prop({
    required: true,
  })
  isPublished: boolean;
}

export const PostsSchema = SchemaFactory.createForClass(UpdatedPosts);
