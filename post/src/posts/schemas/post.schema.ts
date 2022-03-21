import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts extends Document {
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

export const PostsSchema = SchemaFactory.createForClass(Posts);
