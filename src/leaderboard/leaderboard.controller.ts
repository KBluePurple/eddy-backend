import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { SubmitLeaderboardDto } from './dto/submit-leaderboard.dto';
import { Response } from 'express';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(@Res() res: Response) {
    const leaderboard = await this.leaderboardService.getRankings();
    res.header('Content-Type', 'application/json');
    res.status(200).send(leaderboard);
  }

  @Post()
  async submitRanking(@Body() submitLeaderboardDto: SubmitLeaderboardDto) {
    return await this.leaderboardService.submitRanking(submitLeaderboardDto);
  }
}
