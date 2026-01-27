import {HubConnection} from "@microsoft/signalr";

export default class RefereeClient
{
    private connection: HubConnection;

    constructor(connection: HubConnection)
    {
        this.connection = connection;
    }

    async ping(message: string)
    {
        // TODO: worry about error handling later.
        await this.connection.invoke("Ping", message);
    }

    onPong(callback: (message: string) => void)
    {
        this.connection.on("Pong", callback);
    }
}