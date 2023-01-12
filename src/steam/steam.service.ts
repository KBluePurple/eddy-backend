import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface SteamUser {
  steamId: string;
}

interface AuthenticateUserTicketResult {
  success: boolean;
  steamUser: SteamUser;
}

@Injectable()
export class SteamService {
  static async getSteamUser(
    ticket: string,
  ): Promise<AuthenticateUserTicketResult> {
    const response = await axios.get(
      'https://partner.steam-api.com/ISteamUserAuth/AuthenticateUserTicket/v1/',
      {
        params: {
          key: process.env.STEAM_API_KEY,
          appid: process.env.STEAM_APP_ID,
          ticket: ticket,
        },
      },
    );
    if (response.status === 200) {
      const data = response.data.response.params;
      const result = data.result as string;
      const steamId = data.steamid as string;

      if (result === 'OK') {
        return {
          success: true,
          steamUser: {
            steamId: steamId,
          },
        };
      }
    }
    return {
      success: false,
      steamUser: null,
    };
  }
}
