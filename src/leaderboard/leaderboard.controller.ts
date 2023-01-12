import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { SubmitLeaderboardDto } from './dto/submit-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard() {
    return this.leaderboardService.getRankings();
  }

  @Post()
  async submitRanking(@Body() submitLeaderboardDto: SubmitLeaderboardDto) {
    return await this.leaderboardService.submitRanking(submitLeaderboardDto);
  }
}
