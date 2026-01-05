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

  constructor(logCallback: LogCallback) {
    this._logCallback = logCallback;
  }

  async start()
  {
    const formData = new FormData();
    formData.append("client_id", import.meta.env.VITE_WEB_CLIENT_ID);
    formData.append("client_secret", import.meta.env.VITE_WEB_CLIENT_SECRET);
    formData.append("grant_type", "client_credentials");
    formData.append("scope", "delegate");

    this._logCallback("Requesting oauth token.", "info");
    const response = await fetch(
        import.meta.env.VITE_WEB_OAUTH_URL,
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
        headers: {
          "Authorization": `Bearer ${responseJson.access_token}`,
        }
      })
      .configureLogging(LogLevel.Information)
      .build();

    try {
      await this._connection.start();
      this._logCallback("Connected to referee hub.", "info");
    } catch (err) {
      this._logCallback(`Error when connecting to referee hub: ${err}`, "danger");
    }
  }

  async ping(message: string)
  {
    await this._connection?.invoke("Ping", message);
  }

  async startWatching(roomId: number)
  {
    await this._connection?.invoke("StartWatching", roomId);
  }

  async stopWatching(roomId: number)
  {
    await this._connection?.invoke("StopWatching", roomId);
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