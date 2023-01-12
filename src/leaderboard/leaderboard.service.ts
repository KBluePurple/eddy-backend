import { HttpException, Injectable } from '@nestjs/common';
import { Collection, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { TimeRankingElement } from '../schemas/timeRankingElement.schema';
import { User } from '../schemas/user.schema';
import { SteamService } from '../steam/steam.service';

@Injectable()
export class LeaderboardService {
  private collection: Collection<TimeRankingElement>;
  constructor(@InjectConnection() private connection: Connection) {
    const db = this.connection.useDb('rankings');
    this.collection = db.collection('time');
  }

  async getRankings(): Promise<string> {
    const rankings = await this.collection.find().toArray();
    return JSON.stringify(rankings);
  }

  async submitRanking(
    teamId: string,
    ticket: string,
    time: number,
  ): Promise<string> {
    const newRanking = new TimeRankingElement();
    newRanking.time = time;
    newRanking.teamId = teamId;
    newRanking.leader = new User();

    const authResult = await SteamService.getSteamUser(ticket);
    if (authResult.success === true) {
      newRanking.leader.steamId = authResult.steamUser.steamId;
    } else {
      throw new HttpException('Invalid ticket', 401);
    }

    const result = await this.collection.insertOne(newRanking);
    if (result.acknowledged) {
      return 'Ranking submitted';
    }
    throw new HttpException('Ranking not submitted', 500);
  }
}
