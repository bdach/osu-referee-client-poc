import { HubConnection } from "@microsoft/signalr";
import { RoomJoinedResponse } from "./responses";
import * as Events from "./events";
import {
    AddPlaylistItemRequest,
    ChangeRoomSettingsRequest,
    EditCurrentPlaylistItemRequest, EditPlaylistItemRequest, MakeRoomRequest,
    MoveUserRequest, RemovePlaylistItemRequest,
    StartMatchRequest
} from "./requests";
import {
    PlaylistItemAddedEvent,
    PlaylistItemRemovedEvent,
    RefereeAddedEvent,
    RefereeInvitedEvent,
    RefereeRemovedEvent
} from "./events";

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

    async makeRoom(request: MakeRoomRequest) : Promise<RoomJoinedResponse>
    {
        return await this.connection.invoke("MakeRoom", request);
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

    async addReferee(roomId: number, targetUserId: number)
    {
        await this.connection.invoke("AddReferee", roomId, targetUserId);
    }

    async removeReferee(roomId: number, targetUserId: number)
    {
        await this.connection.invoke("RemoveReferee", roomId, targetUserId);
    }

    async changeRoomSettings(roomId: number, request: ChangeRoomSettingsRequest)
    {
        await this.connection.invoke("ChangeRoomSettings", roomId, request);
    }

    async editCurrentPlaylistItem(roomId: number, request: EditCurrentPlaylistItemRequest)
    {
        await this.connection.invoke("EditCurrentPlaylistItem", roomId, request);
    }

    async addPlaylistItem(roomId: number, request: AddPlaylistItemRequest)
    {
        await this.connection.invoke("AddPlaylistItem", roomId, request);
    }

    async editPlaylistItem(roomId: number, request: EditPlaylistItemRequest)
    {
        await this.connection.invoke("EditPlaylistItem", roomId, request);
    }

    async removePlaylistItem(roomId: number, request: RemovePlaylistItemRequest)
    {
        await this.connection.invoke("RemovePlaylistItem", roomId, request);
    }

    async moveUser(roomId: number, request: MoveUserRequest)
    {
        await this.connection.invoke("MoveUser", roomId, request);
    }

    async startMatch(roomId: number, request: StartMatchRequest)
    {
        await this.connection.invoke("StartMatch", roomId, request);
    }

    async stopMatchCountdown(roomId: number)
    {
        await this.connection.invoke("StopMatchCountdown", roomId);
    }

    async abortMatch(roomId: number)
    {
        await this.connection.invoke("AbortMatch", roomId);
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

    onRefereeAdded(callback: (event: RefereeAddedEvent) => void)
    {
        this.connection.on("RefereeAdded", callback);
    }

    onRefereeRemoved(callback: (event: RefereeRemovedEvent) => void)
    {
        this.connection.on("RefereeRemoved", callback);
    }

    onRefereeInvited(callback: (event: RefereeInvitedEvent) => void)
    {
        this.connection.on("RefereeInvited", callback);
    }

    onRoomSettingsChanged(callback: (event: Events.RoomSettingsChangedEvent) => void)
    {
        this.connection.on("RoomSettingsChanged", callback);
    }

    onPlaylistItemAdded(callback: (event: PlaylistItemAddedEvent) => void)
    {
        this.connection.on("PlaylistItemAdded", callback);
    }

    onPlaylistItemChanged(callback: (event: Events.PlaylistItemChangedEvent) => void)
    {
        this.connection.on("PlaylistItemChanged", callback);
    }

    onPlaylistItemRemoved(callback: (event: PlaylistItemRemovedEvent) => void)
    {
        this.connection.on("PlaylistItemRemoved", callback);
    }

    onUserStatusChanged(callback: (event: Events.UserStatusChangedEvent) => void)
    {
        this.connection.on("UserStatusChanged", callback);
    }

    onUserModsChanged(callback: (event: Events.UserModsChangedEvent) => void)
    {
        this.connection.on("UserModsChanged", callback);
    }

    onUserStyleChanged(callback: (event: Events.UserStyleChangedEvent) => void)
    {
        this.connection.on("UserStyleChanged", callback);
    }

    onUserTeamChanged(callback: (event: Events.UserTeamChangedEvent) => void)
    {
        this.connection.on("UserTeamChanged", callback);
    }

    onCountdownStarted(callback: (event: Events.CountdownStartedEvent) => void)
    {
        this.connection.on("CountdownStarted", callback);
    }

    onCountdownStopped(callback: (event: Events.CountdownStoppedEvent) => void)
    {
        this.connection.on("CountdownStopped", callback);
    }

    onMatchStarted(callback: (event: Events.MatchStartedEvent) => void)
    {
        this.connection.on("MatchStarted", callback);
    }

    onMatchAborted(callback: (event: Events.MatchAbortedEvent) => void)
    {
        this.connection.on("MatchAborted", callback);
    }

    onMatchCompleted(callback: (event: Events.MatchCompletedEvent) => void)
    {
        this.connection.on("MatchCompleted", callback);
    }

    async disconnect() {
        await this.connection.stop();
    }
}