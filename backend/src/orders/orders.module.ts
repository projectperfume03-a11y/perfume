import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { Order, OrderSchema } from './order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), ProductsModule, AuthModule], controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
