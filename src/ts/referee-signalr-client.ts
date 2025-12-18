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
  private readonly _connection: HubConnection;
  private readonly _logCallback: LogCallback;

  constructor(logCallback: LogCallback) {
    this._connection = new HubConnectionBuilder()
      .withUrl("http://127.0.0.1:8081/referee")
      .configureLogging(LogLevel.Information)
      .build();
    this._logCallback = logCallback;
  }

  async start()
  {
    try {
      await this._connection.start();
      this._logCallback("Connected to referee hub.", "info");
    } catch (err) {
      this._logCallback(`Error when connecting to referee hub: ${err}`, "danger");
    }
  }

  async startWatching(roomId: number)
  {
    await this._connection.invoke("StartWatching", roomId);
  }

  async stopWatching(roomId: number)
  {
    await this._connection.invoke("StopWatching", roomId);
  }

  onRoomEventLogged(callback: (ev: RoomEvent) => void) {
    this._connection.on("RoomEventLogged", function (rawEvent)
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