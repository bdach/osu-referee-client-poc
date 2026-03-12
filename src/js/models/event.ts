import * as ClientResponses from "./referee-client/responses";
import * as ClientEvents from "./referee-client/events";

export enum EventType
{
    SystemMessage = "system-message",
    Error = "error",

    CountdownStarted = "countdown-started",
    CountdownStopped = "countdown-stopped",
    MatchAborted = "match-aborted",
    MatchCompleted = "match-completed",
    MatchStarted = "match-started",
    MatchStateChanged = "match-state-changed",
    PlaylistItemAdded = "playlist-item-added",
    PlaylistItemChanged = "playlist-item-changed",
    PlaylistItemRemoved = "playlist-item-removed",
    RefereeAdded = "referee-added",
    RefereeInvited = "referee-invited",
    RefereeRemoved = "referee-removed",
    RollCompleted = "roll-completed",
    RoomDisbanded = "room-disbanded",
    RoomJoined = "room-joined",
    RoomSettingsChanged = "room-settings-changed",
    UserBanned = "user-banned",
    UserJoined = "user-joined",
    UserKicked = "user-kicked",
    UserLeft = "user-left",
    UserModsChanged = "user-mods-changed",
    UserStatusChanged = "user-status-changed",
    UserStyleChanged = "user-style-changed",
    UserTeamChanged = "user-team-changed",
}

export type Event =
| SystemMessageEvent
| ErrorEvent
| RoomEvent

export type RoomEvent =
| CountdownStartedEvent
| CountdownStoppedEvent
| MatchAbortedEvent
| MatchCompletedEvent
| MatchStartedEvent
| MatchStateChangedEvent
| PlaylistItemAddedEvent
| PlaylistItemChangedEvent
| PlaylistItemRemovedEvent
| RefereeAddedEvent
| RefereeInvitedEvent
| RefereeRemovedEvent
| RollCompletedEvent
| RoomDisbandedEvent
| RoomJoinedEvent
| RoomSettingsChangedEvent
| UserBannedEvent
| UserJoinedEvent
| UserKickedEvent
| UserLeftEvent
| UserModsChangedEvent
| UserStatusChangedEvent
| UserStyleChangedEvent
| UserTeamChangedEvent;

export type CountdownStartedEvent = ({ event_type: EventType.CountdownStarted } & ClientEvents.CountdownStartedEvent);
export type CountdownStoppedEvent = ({ event_type: EventType.CountdownStopped } & ClientEvents.CountdownStoppedEvent);
export type MatchAbortedEvent = ({ event_type: EventType.MatchAborted } & ClientEvents.MatchAbortedEvent);
export type MatchCompletedEvent = ({ event_type: EventType.MatchCompleted } & ClientEvents.MatchCompletedEvent);
export type MatchStartedEvent = ({ event_type: EventType.MatchStarted } & ClientEvents.MatchStartedEvent);
export type MatchStateChangedEvent = ({ event_type: EventType.MatchStateChanged } & ClientEvents.MatchStateChangedEvent);
export type PlaylistItemAddedEvent = ({ event_type: EventType.PlaylistItemAdded } & ClientEvents.PlaylistItemAddedEvent);
export type PlaylistItemChangedEvent = ({ event_type: EventType.PlaylistItemChanged } & ClientEvents.PlaylistItemChangedEvent);
export type PlaylistItemRemovedEvent = ({ event_type: EventType.PlaylistItemRemoved } & ClientEvents.PlaylistItemRemovedEvent);
export type RefereeAddedEvent = ({ event_type: EventType.RefereeAdded } & ClientEvents.RefereeAddedEvent);
export type RefereeInvitedEvent = ({ event_type: EventType.RefereeInvited } & ClientEvents.RefereeInvitedEvent);
export type RefereeRemovedEvent = ({ event_type: EventType.RefereeRemoved } & ClientEvents.RefereeRemovedEvent);
export type RollCompletedEvent = ({ event_type: EventType.RollCompleted } & ClientEvents.RollCompletedEvent);
export type RoomJoinedEvent = ({ event_type: EventType.RoomJoined } & ClientResponses.RoomJoinedResponse);
export type RoomSettingsChangedEvent = ({ event_type: EventType.RoomSettingsChanged } & ClientEvents.RoomSettingsChangedEvent);
export interface RoomDisbandedEvent { event_type: EventType.RoomDisbanded, room_id: number }
export type UserBannedEvent = ({ event_type: EventType.UserBanned } & ClientEvents.UserBannedEvent)
export type UserJoinedEvent = ({ event_type: EventType.UserJoined } & ClientEvents.UserJoinedEvent)
export type UserLeftEvent = ({ event_type: EventType.UserLeft } & ClientEvents.UserLeftEvent);
export type UserKickedEvent = ({ event_type: EventType.UserKicked } & ClientEvents.UserKickedEvent);
export type UserModsChangedEvent = ({ event_type: EventType.UserModsChanged } & ClientEvents.UserModsChangedEvent);
export type UserStatusChangedEvent = ({ event_type: EventType.UserStatusChanged } & ClientEvents.UserStatusChangedEvent);
export type UserStyleChangedEvent = ({ event_type: EventType.UserStyleChanged } & ClientEvents.UserStyleChangedEvent);
export type UserTeamChangedEvent = ({ event_type: EventType.UserTeamChanged } & ClientEvents.UserTeamChangedEvent);

export interface HasEvents
{
    events: Event[]
}

export interface SystemMessageEvent
{
    event_type: EventType.SystemMessage;
    message: string;
}

export interface ErrorEvent
{
    event_type: EventType.Error;
    message: string;
}