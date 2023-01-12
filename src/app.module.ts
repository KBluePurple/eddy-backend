import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { SteamService } from './steam/steam.service';

@Module({
  imports: [LeaderboardModule],
  controllers: [AppController],
  providers: [AppService, SteamService],
})
export class AppModule {}
