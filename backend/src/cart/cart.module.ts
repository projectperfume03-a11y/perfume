import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { CartController } from './cart.controller';

@Module({ imports: [ProductsModule], controllers: [CartController] })
export class CartModule {}
