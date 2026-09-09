import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true, collection: 'settings' })
export class Settings {
  @Prop({ default: 'Aster Parfums' }) storeName!: string;
  @Prop({ default: 'ASTER' }) logoText!: string;
  @Prop({ default: 'hello@asterparfums.com' }) email!: string;
  @Prop({ default: '+216 70 172 200' }) phone!: string;
  @Prop({ default: '+216 70 172 200' }) whatsapp!: string;
  @Prop({ default: '18 Rue du Lac Windermere, Tunis' }) address!: string;
  @Prop({ default: 'Monday - Friday, 9:00 - 18:00' }) openingHours!: string;
  @Prop({ default: 'TND' }) currency!: string;
  @Prop({ default: 8, min: 0 }) defaultDeliveryFee!: number;
  @Prop({ default: 150, min: 0 }) freeDeliveryThreshold!: number;
  @Prop({ default: true }) cashOnDelivery!: boolean;
  @Prop({ default: true }) acceptOrders!: boolean;
  @Prop({ default: '' }) instagram!: string;
  @Prop({ default: '' }) facebook!: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
