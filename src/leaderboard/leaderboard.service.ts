import { HttpException, Injectable } from '@nestjs/common';
import { Collection, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { TimeRankingElement } from '../schemas/timeRankingElement.schema';
import { User } from '../schemas/user.schema';
import { SteamService } from '../steam/steam.service';
import { SubmitLeaderboardDto } from './dto/submit-leaderboard.dto';

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

  async submitRanking(data: SubmitLeaderboardDto): Promise<string> {
    const newRanking = new TimeRankingElement();
    newRanking.time = data.time;
    newRanking.teamId = data.teamId;
    newRanking.leader = new User();

    const authResult = await SteamService.getSteamUser(data.ticket);
    if (authResult.success) {
      newRanking.leader.steamid = authResult.steamUser.steamid;
    } else {
      throw new HttpException('Invalid ticket', 401);
    }

    const roomData = await SteamService.getRoomData(data.lobbyId);
    if (roomData.success) {
      if (roomData.owner.steamid !== newRanking.leader.steamid) {
        throw new HttpException('Not the room owner', 401);
      } else {
        newRanking.members = roomData.members;
      }
    } else {
      throw new HttpException('Invalid room', 401);
    }

    const result = await this.collection.insertOne(newRanking);
    if (result.acknowledged) {
      return 'Ranking submitted';
    }
    throw new HttpException('Ranking not submitted', 500);
  }
}
