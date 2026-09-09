import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

@Schema({ timestamps: true, collection: 'contact_messages' })
export class ContactMessage {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true }) phone!: string;
  @Prop({ required: true, lowercase: true, trim: true }) email!: string;
  @Prop({ required: true }) message!: string;
  @Prop({ enum: ['new', 'read'], default: 'new' }) status!: string;
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
ContactMessageSchema.index({ status: 1, createdAt: -1 });
