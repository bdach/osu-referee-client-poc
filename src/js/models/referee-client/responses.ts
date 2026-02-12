import { MatchType } from "./common";

export interface RoomJoinedResponse
{
    room_id: number;
    chat_channel_id: number;
    name: string;
    password: string;
    type: MatchType;
}
