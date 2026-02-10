export interface RoomJoinedResponse
{
    room_id: number;
    chat_channel_id: number;
    name: string;
    password: string;
    type: MatchType;
}

export enum MatchType
{
    HeadToHead = "head_to_head",
    TeamVersus = "team_versus",
}