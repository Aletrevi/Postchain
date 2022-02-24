import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

// TODO: define
@Schema()
export class Block extends Document {
    
    @ApiProperty()
    @Prop()
    name: string;

    @ApiProperty()
    @Prop({
        type: mongoose.Schema.Types.Mixed
    })
    body: any

    @ApiProperty()
    @Prop()
    hash: string;

    @ApiProperty()
    @Prop()
    transactionHash: string;

    @ApiProperty()
    @Prop({
        type: Date,
        required: true,
        default: new Date().getTime()
    })
    date: Date;
}

export const BlockSchema = SchemaFactory.createForClass(Block);