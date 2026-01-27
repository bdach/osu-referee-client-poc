export enum EventType
{
    SystemMessage = "system-message",
    Error = "error",
}

export type Event =
| SystemMessageEvent
| ErrorEvent;

export interface HasEvents
{
    events: Event[]
}

export interface SystemMessageEvent
{
    type: EventType.SystemMessage;
    message: string;
}

export interface ErrorEvent
{
    type: EventType.Error;
    message: string;
}