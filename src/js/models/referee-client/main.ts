import { HubConnection } from "@microsoft/signalr";
import { RoomJoinedResponse } from "./responses";
import * as Events from "./events";

export default class RefereeClient
{
    private connection: HubConnection;

    constructor(connection: HubConnection)
    {
        this.connection = connection;
    }

    async ping(message: string)
    {
        await this.connection.invoke("Ping", message);
    }

    async makeRoom(rulesetId: number, beatmapId: number, roomName: string) : Promise<RoomJoinedResponse>
    {
        return await this.connection.invoke("MakeRoom", rulesetId, beatmapId, roomName);
    }

    async joinRoom(roomId: number) : Promise<RoomJoinedResponse>
    {
        return await this.connection.invoke("JoinRoom", roomId);
    }

    async leaveRoom(roomId: number)
    {
        await this.connection.invoke("LeaveRoom", roomId);
    }

    async closeRoom(roomId: number)
    {
        await this.connection.invoke("CloseRoom", roomId);
    }

    async invitePlayer(roomId: number, userId: number)
    {
        await this.connection.invoke("InvitePlayer", roomId, userId);
    }

    async kickPlayer(roomId: number, userId: number)
    {
        await this.connection.invoke("KickPlayer", roomId, userId);
    }

    onPong(callback: (message: string) => void)
    {
        this.connection.on("Pong", callback);
    }

    onUserJoined(callback: (event: Events.UserJoinedEvent) => void)
    {
        this.connection.on("UserJoined", callback);
    }

    onUserLeft(callback: (event: Events.UserLeftEvent) => void)
    {
        this.connection.on("UserLeft", callback);
    }

    onUserKicked(callback: (event: Events.UserKickedEvent) => void)
    {
        this.connection.on("UserKicked", callback);
    }

    async disconnect() {
        await this.connection.stop();
    }
}