import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TimeRankingElementDocument = HydratedDocument<TimeRankingElement>;

@Schema()
export class TimeRankingElement {
  @Prop()
  leader: User;
  @Prop()
  members: User[];
  @Prop()
  teamId: string;
  @Prop()
  time: number;
}

export const TimeRankingElementSchema =
  SchemaFactory.createForClass(TimeRankingElement);
