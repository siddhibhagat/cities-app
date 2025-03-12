import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'cities' })
export class City extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  name_native: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  continent: string;

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  population: string;

  @Prop({ required: true })
  founded: string;

  @Prop({ type: [String] })
  landmarks: string[];

  @Prop({})
  imgURL: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

// Create text index for name, name_native, country and continent
CitySchema.index({ name: 'text', name_native: 'text', country: 'text', continent: 'text' });
