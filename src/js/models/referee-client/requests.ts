import {Mod, MatchTeam, MatchType} from "./common";

export interface ChangeRoomSettingsRequest
{
    name?: string;
    password?: string;
    type?: MatchType;
}

export interface EditCurrentPlaylistItemRequest
{
    ruleset_id?: number;
    beatmap_id?: number;
    required_mods?: Mod[];
    allowed_mods?: Mod[];
    freestyle?: boolean;
}

export interface MakeRoomRequest
{
    ruleset_id: number;
    beatmap_id: number;
    name: string;
}

export interface MoveUserRequest
{
    user_id: number;
    team: MatchTeam;
}

export interface StartMatchRequest
{
    countdown: number | null;
}