import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TimeRankingElementDocument = HydratedDocument<TimeRankingElement>;

@Schema()
export class TimeRankingElement {
  @Prop()
  leader: User;
  @Prop()
  team: User[];
  @Prop()
  roomId: string;
  @Prop()
  time: Date;
}

export const TimeRankingElementSchema =
  SchemaFactory.createForClass(TimeRankingElement);
