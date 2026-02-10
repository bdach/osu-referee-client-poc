import * as ClientResponses from "./referee-client/responses";
import * as ClientEvents from "./referee-client/events";

export enum EventType
{
    SystemMessage = "system-message",
    Error = "error",
    RoomJoined = "room-joined",
    RoomDisbanded = "room-disbanded",
    UserJoined = "player-joined",
    UserLeft = "player-left",
    UserKicked = "player-kicked",
}

export type Event =
| SystemMessageEvent
| ErrorEvent
| RoomEvent

export type RoomEvent =
| RoomJoinedEvent
| RoomDisbandedEvent
| UserJoinedEvent
| UserLeftEvent
| UserKickedEvent;

export type RoomJoinedEvent = ({ event_type: EventType.RoomJoined } & ClientResponses.RoomJoinedResponse)
export type RoomDisbandedEvent = ({ event_type: EventType.RoomDisbanded } & ClientEvents.RoomDisbandedEvent)
export type UserJoinedEvent = ({ event_type: EventType.UserJoined } & ClientEvents.UserJoinedEvent)
export type UserLeftEvent = ({ event_type: EventType.UserLeft } & ClientEvents.UserLeftEvent)
export type UserKickedEvent = ({ event_type: EventType.UserKicked } & ClientEvents.UserKickedEvent);

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