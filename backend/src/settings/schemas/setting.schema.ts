import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, default: 7 })
  shippingCost: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
