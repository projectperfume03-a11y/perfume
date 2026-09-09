import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ContactMessage, ContactMessageSchema } from '../contact/contact.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({ imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }, { name: Product.name, schema: ProductSchema }, { name: ContactMessage.name, schema: ContactMessageSchema }]), AuthModule], controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
