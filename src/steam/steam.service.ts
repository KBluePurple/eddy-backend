import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface SteamUser {
  steamid: string;
}

interface AuthenticateUserTicketResult {
  success: boolean;
  steamUser: SteamUser;
}

interface LobbyDataSuccess {
  success: true;
  lobbyId: string;
  owner: SteamUser;
  members: SteamUser[];
}

interface LobbyDataFailure {
  success: false;
}

type LobbyData = LobbyDataSuccess | LobbyDataFailure;

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
            steamid: steamId,
          },
        };
      }
    }
    return {
      success: false,
      steamUser: null,
    };
  }

  static async getRoomData(roomId: string): Promise<LobbyData> {
    try {
      const response = await axios.get(
        'https://partner.steam-api.com/ILobbyMatchmakingService/GetLobbyData/v1/',
        {
          params: {
            key: process.env.STEAM_API_KEY,
            appid: process.env.STEAM_APP_ID,
            steamid_lobby: roomId,
          },
        },
      );
      if (response.status === 200) {
        const data = response.data.response.params;
        const owner = data.steamid_owner as string;
        const members = data.members as SteamUser[];

        return {
          success: true,
          lobbyId: roomId,
          owner: {
            steamid: owner,
          },
          members: members.map((member) => ({
            steamid: member.steamid,
          })),
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}
