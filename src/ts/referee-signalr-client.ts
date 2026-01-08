import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

type EventType = "success" | "warning" | "danger" | "info";
type LogCallback = (message: string, type?: EventType) => void;

export type RoomType =
  | "playlists"
  | "head_to_head"
  | "team_versus";

export type Team = "blue" | "red";

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
    if (!this._connection) {
      return;
    }

    const roomId: number | undefined = await this.invoke("MakeRoom", rulesetId, beatmapId, name);
    if (roomId != null)
      this._logCallback(`Room ${name} created (id:${roomId})`, "success");
  }

  async closeRoom()
  {
    if (!this._connection) {
      return;
    }

    const roomId: number | undefined = await this.invoke("CloseRoom");
    if (roomId != null) {
      this._logCallback(`Room closed (id:${roomId})`, 'success');
    }
  }

  async invitePlayer(userId: number)
  {
    await this.invoke("InvitePlayer", userId);
  }

  async kickUser(userId: number)
  {
    await this.invoke("KickUser", userId);
  }

  private async invoke<T = any>(methodName: string, ...args: any[]) : Promise<T | undefined> {
    try {
      return await this._connection?.invoke<T>(methodName, ...args);
    }
    catch (err) {
      this._logCallback(`Error invoking ${methodName}: ${err}`, "danger");
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