export interface RoomEvent
{
    room_id: number;
}

export interface UserJoinedEvent extends RoomEvent
{
    user_id: number;
}

export interface UserKickedEvent extends RoomEvent
{
    kicked_user_id: number;
    kicking_user_id: number;
}

export interface UserLeftEvent extends RoomEvent
{
    user_id: number;
}