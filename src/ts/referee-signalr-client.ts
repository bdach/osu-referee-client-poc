import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';

type EventType = "success" | "warning" | "danger" | "info";
type LogCallback = (message: string, type?: EventType) => void;

export class RefereeSignalRClient {
  private readonly _connection: HubConnection;
  private readonly _logCallback: LogCallback;

  constructor(logCallback: LogCallback) {
    this._connection = new HubConnectionBuilder()
      .withUrl("http://127.0.0.1:8081/referee")
      .withHubProtocol(new MessagePackHubProtocol())
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

  async ping(payload: string) {
    await this._connection.invoke("Ping", payload);
  }

  onPong(callback: (payload: string) => void) {
    this._connection.on("Pong", callback);
  }
}