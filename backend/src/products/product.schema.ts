import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, lowercase: true, trim: true }) slug!: string;
  @Prop({ required: true }) description!: string;
  @Prop({ required: true, trim: true }) brand!: string;
  @Prop({ required: true, trim: true }) category!: string;
  @Prop({ required: true, enum: ['Women', 'Men', 'Unisex'] }) gender!: string;
  @Prop({ required: true }) fragranceFamily!: string;
  @Prop({ required: true }) size!: string;
  @Prop({ required: true, min: 0 }) price!: number;
  @Prop({ min: 0 }) oldPrice?: number;
  @Prop({ type: [{ url: String, publicId: String }], default: [] }) images!: { url: string; publicId?: string }[];
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ enum: ['limited', 'unlimited'], default: 'limited' }) stockType!: string;
  @Prop({ min: 0, default: 0 }) quantity!: number;
  @Prop({ min: 0, default: 3 }) lowStockThreshold!: number;
  @Prop({ enum: ['show', 'hide'], default: 'show' }) outOfStockBehavior!: string;
  @Prop({ default: false }) featured!: boolean;
  @Prop({ default: false }) newArrival!: boolean;
  @Prop({ default: false }) bestSeller!: boolean;
  @Prop({ default: true }) active!: boolean;
  @Prop({ default: false }) archived!: boolean;
  @Prop({ type: { top: [String], heart: [String], base: [String] }, default: {} }) fragranceNotes!: { top?: string[]; heart?: string[]; base?: string[] };
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ active: 1, archived: 1, featured: 1 });
ProductSchema.index({ name: 'text', brand: 'text', category: 'text', tags: 'text' });
