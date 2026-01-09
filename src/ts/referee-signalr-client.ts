import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

type EventType = "success" | "warning" | "danger" | "info";
type LogCallback = (message: string, type?: EventType) => void;

export type RoomType =
  | "playlists"
  | "head_to_head"
  | "team_versus";

export type Team = "blue" | "red";

export enum MatchType
{
  HeadToHead = 1,
  TeamVersus = 2,
  Matchmaking = 3,
}

export interface APIMod
{
  acronym: string;
  settings?: Partial<Record<string, any>>;
}

export interface MatchStartedEventDetail {
  room_type: RoomType;
  teams?: Partial<Record<number, Team>>;
}

export type RoomEvent =
  | { event_type: 'room_created'; room_id: number; user_id: number }
  | { event_type: 'room_disbanded'; room_id: number; user_id: number }
  | { event_type: 'player_joined'; room_id: number; user_id: number }
  | { event_type: 'player_left'; room_id: number; user_id: number }
  | { event_type: 'player_kicked'; room_id: number; user_id: number }
  | { event_type: 'host_changed'; room_id: number; user_id: number }
  | {
      event_type: 'game_started';
      room_id: number;
      playlist_item_id: number;
      event_detail: MatchStartedEventDetail;
    }
  | { event_type: 'game_aborted'; room_id: number; playlist_item_id: number }
  | { event_type: 'game_completed'; room_id: number; playlist_item_id: number };

export class RefereeSignalRClient {
  private _connection?: HubConnection;
  private readonly _logCallback: LogCallback;
  private readonly _authorizationCode: string;

  constructor(logCallback: LogCallback, authorizationCode: string) {
    this._logCallback = logCallback;
    this._authorizationCode = authorizationCode;
  }

  async start()
  {
    const formData = new FormData();
    formData.append("client_id", import.meta.env.VITE_WEB_CLIENT_ID);
    formData.append("client_secret", import.meta.env.VITE_WEB_CLIENT_SECRET);
    formData.append("code", this._authorizationCode);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", "http://localhost:5173")

    this._logCallback("Requesting oauth token.", "info");
    const response = await fetch(
        import.meta.env.VITE_WEB_OAUTH_TOKEN_URL,
        {
          method: "POST",
          body: formData,
        });

    if (!response.ok) {
      this._logCallback("Failed to retrieve oauth token.", "danger");
      return;
    }

    const responseJson = await response.json();
    if (responseJson.access_token == null) {
      this._logCallback("Failed to retrieve oauth token.", "danger");
      return;
    }

    this._logCallback("oauth token successfully retrieved.", "success");

    this._connection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_REFEREE_HUB_URL, {
        accessTokenFactory: () => responseJson.access_token,
      })
      .configureLogging(LogLevel.Information)
      .build();

    try {
      this._logCallback("Connecting to referee hub...", "info")
      await this._connection.start();
      this._logCallback("Connected to referee hub.", "success");
    } catch (err) {
      this._logCallback(`Error when connecting to referee hub: ${err}`, "danger");
    }
  }

  async ping(message: string)
  {
    await this.invoke("Ping", message);
  }

  async startWatching(roomId: number)
  {
    await this.invoke("StartWatching", roomId);
  }

  async stopWatching(roomId: number)
  {
    await this.invoke("StopWatching", roomId);
  }

  async makeRoom(rulesetId: number, beatmapId: number, name: string)
  {
    const roomId: number | undefined = await this.invoke("MakeRoom", rulesetId, beatmapId, name);
    if (roomId != null)
      this._logCallback(`Room ${name} created (id:${roomId})`, "success");
  }

  async closeRoom(roomId: number)
  {
    if (await this.invoke("CloseRoom", roomId))
      this._logCallback(`Room closed (id:${roomId})`, 'success');
  }

  async setRoomName(roomId: number, name: string)
  {
    await this.invoke("SetRoomName", roomId, name);
  }

  async setRoomPassword(roomId: number, password: string)
  {
    await this.invoke("SetRoomPassword", roomId, password);
  }

  async setMatchType(roomId: number, matchType: MatchType)
  {
    await this.invoke("SetMatchType", roomId, matchType);
  }

  async invitePlayer(roomId: number, userId: number)
  {
    await this.invoke("InvitePlayer", roomId, userId);
  }

  async setHost(roomId: number, userId: number)
  {
    await this.invoke("SetHost", roomId, userId);
  }

  async kickUser(roomId: number, userId: number)
  {
    await this.invoke("KickUser", roomId, userId);
  }

  async setBeatmap(roomId: number, beatmapId: number, rulesetId?: number)
  {
    await this.invoke("SetBeatmap", roomId, beatmapId, rulesetId);
  }

  async setRequiredMods(roomId: number, mods: APIMod[])
  {
    await this.invoke("SetRequiredMods", roomId, mods);
  }

  async setAllowedMods(roomId: number, mods: APIMod[])
  {
    await this.invoke("SetAllowedMods", roomId, mods);
  }

  async setFreestyle(roomId: number, enabled: boolean)
  {
    await this.invoke("SetFreestyle", roomId, enabled);
  }

  async startGameplay(roomId: number, countdown?: number)
  {
    await this.invoke("StartGameplay", roomId, countdown);
  }

  async abortGameplayCountdown(roomId: number)
  {
    await this.invoke("AbortGameplayCountdown", roomId);
  }

  async abortGameplay(roomId: number)
  {
    await this.invoke("AbortGameplay", roomId);
  }

  private async invoke<T = any>(methodName: string, ...args: any[]) : Promise<T | undefined> {
    if (this._connection == null) {
      this._logCallback(`Dropping request to ${methodName}: Connection not established!`);
      return undefined;
    }

    try {
      return await this._connection?.invoke<T>(methodName, ...args);
    }
    catch (err) {
      this._logCallback(`Error invoking ${methodName}: ${err}`, "danger");
      return undefined;
    }
  }

  onPong(callback: (msg: string) => void)
  {
    this._connection?.on("Pong", callback);
  }

  onRoomEventLogged(callback: (ev: RoomEvent) => void)
  {
    this._connection?.on("RoomEventLogged", function (rawEvent)
    {
      switch (rawEvent.event_type)
      {
        case "game_started":
          rawEvent.event_detail = JSON.parse(rawEvent.event_detail);
          break;
      }

      callback(rawEvent);
    });
  }
}