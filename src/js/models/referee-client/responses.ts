import {Player, PlaylistItem, Referee, MatchState} from "./common";

export interface RoomJoinedResponse
{
    room_id: number;
    chat_channel_id: number;
    name: string;
    password: string;
    state: MatchState;
    playlist: PlaylistItem[];
    players: Player[];
    referees: Referee[];
}
