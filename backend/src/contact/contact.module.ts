import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactMessage, ContactMessageSchema } from './contact.schema';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [MongooseModule.forFeature([{ name: ContactMessage.name, schema: ContactMessageSchema }]), AuthModule], controllers: [ContactController] })
export class ContactModule {}
