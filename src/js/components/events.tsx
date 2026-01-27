import * as Events from '../models/Event';

export default function renderEvent(event: Events.Event) {
    switch (event.type) {
        case Events.EventType.SystemMessage:
            return SystemMessage(event);

        case Events.EventType.Error:
            return Error(event);
    }
}

export function SystemMessage(message: Events.SystemMessageEvent) {
    return (
        <li className='list-group-item'>{message.message}</li>
    );
}

export function Error(error: Events.ErrorEvent) {
    return (
        <li className='list-group-item list-group-item-danger'>{error.message}</li>
    );
}