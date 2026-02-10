import * as Events from '../models/event';

export interface Props
{
    closeTab: () => void;
}

export default function renderEvent(event: Events.Event, props: Props) {
    switch (event.event_type) {
        case Events.EventType.SystemMessage:
            return SystemMessage(event);

        case Events.EventType.Error:
            return Error(event);

        case Events.EventType.RoomJoined:
            return RoomJoined(event);

        case Events.EventType.RoomDisbanded:
            return RoomDisbanded(props.closeTab);

        case Events.EventType.UserJoined:
            return PlayerJoined(event);

        case Events.EventType.UserLeft:
            return PlayerLeft(event);

        case Events.EventType.UserKicked:
            return PlayerKicked(event);
    }
}

export function SystemMessage(message: Events.SystemMessageEvent) {
    return (
        <li className='list-group-item d-flex align-items-center'>
            <span className='badge rounded-pill text-bg-dark me-2'>SYSTEM</span>
            {message.message}
        </li>
    );
}

export function Error(error: Events.ErrorEvent) {
    return (
        <li className='list-group-item list-group-item-danger'>{error.message}</li>
    );
}

export function RoomJoined(event: Events.RoomJoinedEvent) {
    return (
        <li className='list-group-item list-group-item-success'>Welcome to room {event.name} (ID: {event.room_id})</li>
    );
}

export function RoomDisbanded(closeTab: () => void) {
    return (
        <li className='list-group-item list-group-item-dark'>
            The room has been disbanded.
            <a className="link-danger link-underline-danger float-end" onClick={closeTab}>Close tab</a>
        </li>
    );
}

export function PlayerJoined(event: Events.UserJoinedEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Player ID:{event.user_id} has joined.</li>
    );
}

export function PlayerLeft(event: Events.UserLeftEvent) {
    return (
        <li className='list-group-item list-group-item-info'>Player ID:{event.user_id} has left.</li>
    );
}

export function PlayerKicked(event: Events.UserKickedEvent) {
    return (
        <li className='list-group-item list-group-item-warning'>Player ID:{event.kicked_user_id} has been kicked by ID:{event.kicking_user_id}.</li>
    );
}