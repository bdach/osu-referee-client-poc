import {Player, PlaylistItem, Referee, MatchState, QueueMode} from "./common";

export interface RoomJoinedResponse
{
    room_id: number;
    chat_channel_id: number;
    name: string;
    password: string;
    max_participants: number;
    state: MatchState;
    queue_mode: QueueMode;
    playlist: PlaylistItem[];
    players: Player[];
    referees: Referee[];
}

export interface ListRoomsResponse
{
    room_ids: number[];
}