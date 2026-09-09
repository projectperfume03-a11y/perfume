import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem { @Prop({ required: true }) productId!: string; @Prop({ required: true }) productName!: string; @Prop() image?: string; @Prop({ required: true }) quantity!: number; @Prop({ required: true }) unitPrice!: number; @Prop({ required: true }) subtotal!: number; }

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true }) orderNumber!: string;
  @Prop({ type: [OrderItem], required: true }) items!: OrderItem[];
  @Prop({ required: true }) subtotal!: number;
  @Prop({ default: 0 }) discount!: number;
  @Prop({ default: 0 }) deliveryFee!: number;
  @Prop({ required: true }) total!: number;
  @Prop({ enum: ['COD'], default: 'COD' }) paymentMethod!: string;
  @Prop({ enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' }) paymentStatus!: string;
  @Prop({ enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'pending' }) orderStatus!: string;
  @Prop({ type: Object, required: true }) shippingAddress!: Record<string, string>;
  @Prop() notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
