import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitLeaderboardDto {
  @IsString()
  teamId: string;
  @IsString()
  ticket: string;
  @IsString()
  lobbyId: string;
  @IsNumber()
  time: number;
}
