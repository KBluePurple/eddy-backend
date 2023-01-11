import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class LeaderboardService {
  constructor(@InjectConnection() private connection: Connection) {}

  async getRankings(): Promise<string> {
    const db = this.connection.db;
    const collection = db.collection('rankings');
    const rankings = await collection.find().toArray();
    return JSON.stringify(rankings);
  }

  async submitRanking(ranking: string): Promise<string> {
    const db = this.connection.db;
    const collection = db.collection('rankings');
    const result = await collection.insertOne({ ranking });
    return JSON.stringify(result);
  }
}
